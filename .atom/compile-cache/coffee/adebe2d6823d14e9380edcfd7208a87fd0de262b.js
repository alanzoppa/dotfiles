(function() {
  var $$, Point, SelectListView, SymbolsView, fs, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  _ref = require('atom'), $$ = _ref.$$, Point = _ref.Point, SelectListView = _ref.SelectListView;

  fs = require('fs-plus');

  module.exports = SymbolsView = (function(_super) {
    __extends(SymbolsView, _super);

    function SymbolsView() {
      return SymbolsView.__super__.constructor.apply(this, arguments);
    }

    SymbolsView.activate = function() {
      return new SymbolsView;
    };

    SymbolsView.prototype.initialize = function() {
      SymbolsView.__super__.initialize.apply(this, arguments);
      return this.addClass('symbols-view overlay from-top');
    };

    SymbolsView.prototype.destroy = function() {
      this.cancel();
      return this.remove();
    };

    SymbolsView.prototype.getFilterKey = function() {
      return 'name';
    };

    SymbolsView.prototype.viewForItem = function(_arg) {
      var file, name, position;
      position = _arg.position, name = _arg.name, file = _arg.file;
      return $$(function() {
        return this.li({
          "class": 'two-lines'
        }, (function(_this) {
          return function() {
            var text;
            _this.div(name, {
              "class": 'primary-line'
            });
            if (position) {
              text = "Line " + (position.row + 1);
            } else {
              text = path.basename(file);
            }
            return _this.div(text, {
              "class": 'secondary-line'
            });
          };
        })(this));
      });
    };

    SymbolsView.prototype.getEmptyMessage = function(itemCount) {
      if (itemCount === 0) {
        return 'No symbols found';
      } else {
        return SymbolsView.__super__.getEmptyMessage.apply(this, arguments);
      }
    };

    SymbolsView.prototype.confirmed = function(tag) {
      if (tag.file && !fs.isFileSync(atom.project.resolve(tag.file))) {
        this.setError('Selected file does not exist');
        return setTimeout(((function(_this) {
          return function() {
            return _this.setError();
          };
        })(this)), 2000);
      } else {
        this.cancel();
        return this.openTag(tag);
      }
    };

    SymbolsView.prototype.openTag = function(tag) {
      var position;
      position = tag.position;
      if (!position) {
        position = this.getTagLine(tag);
      }
      if (tag.file) {
        return atom.workspaceView.open(tag.file).done((function(_this) {
          return function() {
            if (position) {
              return _this.moveToPosition(position);
            }
          };
        })(this));
      } else if (position) {
        return this.moveToPosition(position);
      }
    };

    SymbolsView.prototype.moveToPosition = function(position) {
      var editor, editorView;
      editorView = atom.workspaceView.getActiveView();
      if (editor = typeof editorView.getEditor === "function" ? editorView.getEditor() : void 0) {
        editorView.scrollToBufferPosition(position, {
          center: true
        });
        editor.setCursorBufferPosition(position);
        return editor.moveCursorToFirstCharacterOfLine();
      }
    };

    SymbolsView.prototype.attach = function() {
      this.storeFocusedElement();
      atom.workspaceView.appendToTop(this);
      return this.focusFilterEditor();
    };

    SymbolsView.prototype.getTagLine = function(tag) {
      var file, index, line, pattern, _i, _len, _ref1, _ref2;
      pattern = (_ref1 = tag.pattern) != null ? _ref1.replace(/(^^\/\^)|(\$\/$)/g, '').trim() : void 0;
      if (!pattern) {
        return;
      }
      file = atom.project.resolve(tag.file);
      if (!fs.isFileSync(file)) {
        return;
      }
      _ref2 = fs.readFileSync(file, 'utf8').split('\n');
      for (index = _i = 0, _len = _ref2.length; _i < _len; index = ++_i) {
        line = _ref2[index];
        if (pattern === line.trim()) {
          return new Point(index, 0);
        }
      }
    };

    return SymbolsView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsT0FBOEIsT0FBQSxDQUFRLE1BQVIsQ0FBOUIsRUFBQyxVQUFBLEVBQUQsRUFBSyxhQUFBLEtBQUwsRUFBWSxzQkFBQSxjQURaLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FGTCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGtDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFdBQUMsQ0FBQSxRQUFELEdBQVcsU0FBQSxHQUFBO2FBQ1QsR0FBQSxDQUFBLFlBRFM7SUFBQSxDQUFYLENBQUE7O0FBQUEsMEJBR0EsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsNkNBQUEsU0FBQSxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLCtCQUFWLEVBRlU7SUFBQSxDQUhaLENBQUE7O0FBQUEsMEJBT0EsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBRk87SUFBQSxDQVBULENBQUE7O0FBQUEsMEJBV0EsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUFHLE9BQUg7SUFBQSxDQVhkLENBQUE7O0FBQUEsMEJBYUEsV0FBQSxHQUFhLFNBQUMsSUFBRCxHQUFBO0FBQ1gsVUFBQSxvQkFBQTtBQUFBLE1BRGEsZ0JBQUEsVUFBVSxZQUFBLE1BQU0sWUFBQSxJQUM3QixDQUFBO2FBQUEsRUFBQSxDQUFHLFNBQUEsR0FBQTtlQUNELElBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxVQUFBLE9BQUEsRUFBTyxXQUFQO1NBQUosRUFBd0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDdEIsZ0JBQUEsSUFBQTtBQUFBLFlBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSyxJQUFMLEVBQVc7QUFBQSxjQUFBLE9BQUEsRUFBTyxjQUFQO2FBQVgsQ0FBQSxDQUFBO0FBQ0EsWUFBQSxJQUFHLFFBQUg7QUFDRSxjQUFBLElBQUEsR0FBUSxPQUFBLEdBQU0sQ0FBQSxRQUFRLENBQUMsR0FBVCxHQUFlLENBQWYsQ0FBZCxDQURGO2FBQUEsTUFBQTtBQUdFLGNBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBZCxDQUFQLENBSEY7YUFEQTttQkFLQSxLQUFDLENBQUEsR0FBRCxDQUFLLElBQUwsRUFBVztBQUFBLGNBQUEsT0FBQSxFQUFPLGdCQUFQO2FBQVgsRUFOc0I7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QixFQURDO01BQUEsQ0FBSCxFQURXO0lBQUEsQ0FiYixDQUFBOztBQUFBLDBCQXVCQSxlQUFBLEdBQWlCLFNBQUMsU0FBRCxHQUFBO0FBQ2YsTUFBQSxJQUFHLFNBQUEsS0FBYSxDQUFoQjtlQUNFLG1CQURGO09BQUEsTUFBQTtlQUdFLGtEQUFBLFNBQUEsRUFIRjtPQURlO0lBQUEsQ0F2QmpCLENBQUE7O0FBQUEsMEJBNkJBLFNBQUEsR0FBWSxTQUFDLEdBQUQsR0FBQTtBQUNWLE1BQUEsSUFBRyxHQUFHLENBQUMsSUFBSixJQUFhLENBQUEsRUFBTSxDQUFDLFVBQUgsQ0FBYyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQWIsQ0FBcUIsR0FBRyxDQUFDLElBQXpCLENBQWQsQ0FBcEI7QUFDRSxRQUFBLElBQUMsQ0FBQSxRQUFELENBQVUsOEJBQVYsQ0FBQSxDQUFBO2VBQ0EsVUFBQSxDQUFXLENBQUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLFFBQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBRCxDQUFYLEVBQTZCLElBQTdCLEVBRkY7T0FBQSxNQUFBO0FBSUUsUUFBQSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQUEsQ0FBQTtlQUNBLElBQUMsQ0FBQSxPQUFELENBQVMsR0FBVCxFQUxGO09BRFU7SUFBQSxDQTdCWixDQUFBOztBQUFBLDBCQXFDQSxPQUFBLEdBQVMsU0FBQyxHQUFELEdBQUE7QUFDUCxVQUFBLFFBQUE7QUFBQSxNQUFBLFFBQUEsR0FBVyxHQUFHLENBQUMsUUFBZixDQUFBO0FBQ0EsTUFBQSxJQUFBLENBQUEsUUFBQTtBQUFBLFFBQUEsUUFBQSxHQUFXLElBQUMsQ0FBQSxVQUFELENBQVksR0FBWixDQUFYLENBQUE7T0FEQTtBQUVBLE1BQUEsSUFBRyxHQUFHLENBQUMsSUFBUDtlQUNFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBbkIsQ0FBd0IsR0FBRyxDQUFDLElBQTVCLENBQWlDLENBQUMsSUFBbEMsQ0FBdUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDckMsWUFBQSxJQUE2QixRQUE3QjtxQkFBQSxLQUFDLENBQUEsY0FBRCxDQUFnQixRQUFoQixFQUFBO2FBRHFDO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkMsRUFERjtPQUFBLE1BR0ssSUFBRyxRQUFIO2VBQ0gsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsUUFBaEIsRUFERztPQU5FO0lBQUEsQ0FyQ1QsQ0FBQTs7QUFBQSwwQkE4Q0EsY0FBQSxHQUFnQixTQUFDLFFBQUQsR0FBQTtBQUNkLFVBQUEsa0JBQUE7QUFBQSxNQUFBLFVBQUEsR0FBYSxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQW5CLENBQUEsQ0FBYixDQUFBO0FBQ0EsTUFBQSxJQUFHLE1BQUEsZ0RBQVMsVUFBVSxDQUFDLG9CQUF2QjtBQUNFLFFBQUEsVUFBVSxDQUFDLHNCQUFYLENBQWtDLFFBQWxDLEVBQTRDO0FBQUEsVUFBQSxNQUFBLEVBQVEsSUFBUjtTQUE1QyxDQUFBLENBQUE7QUFBQSxRQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixRQUEvQixDQURBLENBQUE7ZUFFQSxNQUFNLENBQUMsZ0NBQVAsQ0FBQSxFQUhGO09BRmM7SUFBQSxDQTlDaEIsQ0FBQTs7QUFBQSwwQkFxREEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLE1BQUEsSUFBQyxDQUFBLG1CQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQW5CLENBQStCLElBQS9CLENBREEsQ0FBQTthQUVBLElBQUMsQ0FBQSxpQkFBRCxDQUFBLEVBSE07SUFBQSxDQXJEUixDQUFBOztBQUFBLDBCQTBEQSxVQUFBLEdBQVksU0FBQyxHQUFELEdBQUE7QUFFVixVQUFBLGtEQUFBO0FBQUEsTUFBQSxPQUFBLHdDQUFxQixDQUFFLE9BQWIsQ0FBcUIsbUJBQXJCLEVBQTBDLEVBQTFDLENBQTZDLENBQUMsSUFBOUMsQ0FBQSxVQUFWLENBQUE7QUFFQSxNQUFBLElBQUEsQ0FBQSxPQUFBO0FBQUEsY0FBQSxDQUFBO09BRkE7QUFBQSxNQUdBLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQWIsQ0FBcUIsR0FBRyxDQUFDLElBQXpCLENBSFAsQ0FBQTtBQUlBLE1BQUEsSUFBQSxDQUFBLEVBQWdCLENBQUMsVUFBSCxDQUFjLElBQWQsQ0FBZDtBQUFBLGNBQUEsQ0FBQTtPQUpBO0FBS0E7QUFBQSxXQUFBLDREQUFBOzRCQUFBO0FBQ0UsUUFBQSxJQUE4QixPQUFBLEtBQVcsSUFBSSxDQUFDLElBQUwsQ0FBQSxDQUF6QztBQUFBLGlCQUFXLElBQUEsS0FBQSxDQUFNLEtBQU4sRUFBYSxDQUFiLENBQVgsQ0FBQTtTQURGO0FBQUEsT0FQVTtJQUFBLENBMURaLENBQUE7O3VCQUFBOztLQUR3QixlQUwxQixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/alan/.dotfiles/.atom/packages/symbols-view/lib/symbols-view.coffee