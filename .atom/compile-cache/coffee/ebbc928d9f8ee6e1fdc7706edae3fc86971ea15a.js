(function() {
  var FileView, SymbolsView, TagGenerator,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SymbolsView = require('./symbols-view');

  TagGenerator = require('./tag-generator');

  module.exports = FileView = (function(_super) {
    __extends(FileView, _super);

    function FileView() {
      return FileView.__super__.constructor.apply(this, arguments);
    }

    FileView.prototype.initialize = function() {
      FileView.__super__.initialize.apply(this, arguments);
      this.cachedTags = {};
      return atom.project.eachBuffer((function(_this) {
        return function(buffer) {
          _this.subscribe(buffer, 'reloaded saved destroyed path-changed', function() {
            return delete _this.cachedTags[buffer.getPath()];
          });
          return _this.subscribe(buffer, 'destroyed', function() {
            return _this.unsubscribe(buffer);
          });
        };
      })(this));
    };

    FileView.prototype.toggle = function() {
      var filePath;
      if (this.hasParent()) {
        return this.cancel();
      } else if (filePath = this.getPath()) {
        this.populate(filePath);
        return this.attach();
      }
    };

    FileView.prototype.getPath = function() {
      var _ref;
      return (_ref = atom.workspace.getActiveEditor()) != null ? _ref.getPath() : void 0;
    };

    FileView.prototype.populate = function(filePath) {
      var tags;
      this.list.empty();
      this.setLoading('Generating symbols\u2026');
      if (tags = this.cachedTags[filePath]) {
        this.maxItem = Infinity;
        return this.setItems(tags);
      } else {
        return this.generateTags(filePath);
      }
    };

    FileView.prototype.generateTags = function(filePath) {
      return new TagGenerator(filePath).generate().done((function(_this) {
        return function(tags) {
          _this.cachedTags[filePath] = tags;
          _this.maxItem = Infinity;
          return _this.setItems(tags);
        };
      })(this));
    };

    return FileView;

  })(SymbolsView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1DQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBQWQsQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FEZixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLCtCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx1QkFBQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSwwQ0FBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxFQUZkLENBQUE7YUFHQSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQWIsQ0FBd0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO0FBQ3RCLFVBQUEsS0FBQyxDQUFBLFNBQUQsQ0FBVyxNQUFYLEVBQW1CLHVDQUFuQixFQUE0RCxTQUFBLEdBQUE7bUJBQzFELE1BQUEsQ0FBQSxLQUFRLENBQUEsVUFBVyxDQUFBLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBQSxFQUR1QztVQUFBLENBQTVELENBQUEsQ0FBQTtpQkFFQSxLQUFDLENBQUEsU0FBRCxDQUFXLE1BQVgsRUFBbUIsV0FBbkIsRUFBZ0MsU0FBQSxHQUFBO21CQUM5QixLQUFDLENBQUEsV0FBRCxDQUFhLE1BQWIsRUFEOEI7VUFBQSxDQUFoQyxFQUhzQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhCLEVBSlU7SUFBQSxDQUFaLENBQUE7O0FBQUEsdUJBVUEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFVBQUEsUUFBQTtBQUFBLE1BQUEsSUFBRyxJQUFDLENBQUEsU0FBRCxDQUFBLENBQUg7ZUFDRSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBREY7T0FBQSxNQUVLLElBQUcsUUFBQSxHQUFXLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBZDtBQUNILFFBQUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWLENBQUEsQ0FBQTtlQUNBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFGRztPQUhDO0lBQUEsQ0FWUixDQUFBOztBQUFBLHVCQWlCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQUcsVUFBQSxJQUFBO3FFQUFnQyxDQUFFLE9BQWxDLENBQUEsV0FBSDtJQUFBLENBakJULENBQUE7O0FBQUEsdUJBbUJBLFFBQUEsR0FBVSxTQUFDLFFBQUQsR0FBQTtBQUNSLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsVUFBRCxDQUFZLDBCQUFaLENBREEsQ0FBQTtBQUVBLE1BQUEsSUFBRyxJQUFBLEdBQU8sSUFBQyxDQUFBLFVBQVcsQ0FBQSxRQUFBLENBQXRCO0FBQ0UsUUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVgsQ0FBQTtlQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBVixFQUZGO09BQUEsTUFBQTtlQUlFLElBQUMsQ0FBQSxZQUFELENBQWMsUUFBZCxFQUpGO09BSFE7SUFBQSxDQW5CVixDQUFBOztBQUFBLHVCQTRCQSxZQUFBLEdBQWMsU0FBQyxRQUFELEdBQUE7YUFDUixJQUFBLFlBQUEsQ0FBYSxRQUFiLENBQXNCLENBQUMsUUFBdkIsQ0FBQSxDQUFpQyxDQUFDLElBQWxDLENBQXVDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtBQUN6QyxVQUFBLEtBQUMsQ0FBQSxVQUFXLENBQUEsUUFBQSxDQUFaLEdBQXdCLElBQXhCLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxPQUFELEdBQVcsUUFEWCxDQUFBO2lCQUVBLEtBQUMsQ0FBQSxRQUFELENBQVUsSUFBVixFQUh5QztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZDLEVBRFE7SUFBQSxDQTVCZCxDQUFBOztvQkFBQTs7S0FEcUIsWUFKdkIsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/alan/.dotfiles/.atom/packages/symbols-view/lib/file-view.coffee