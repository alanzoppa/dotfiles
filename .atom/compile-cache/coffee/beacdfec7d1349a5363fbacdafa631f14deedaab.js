(function() {
  var CodeManager, Controller, OutputView, Session;

  Session = require('./session');

  OutputView = require('./output-view');

  CodeManager = require('./code-manager');

  module.exports = Controller = (function() {
    function Controller(client, workspaceView, directory) {
      this.workspaceView = workspaceView;
      this.session = new Session(client, directory);
      this.codeManager = new CodeManager(workspaceView);
      this.outputView = new OutputView();
    }

    Controller.prototype.start = function() {
      this.outputView.appendTo(this.workspaceView);
      return this.workspaceView.command("nrepl:eval", (function(_this) {
        return function() {
          return _this.evalCurrentExpression();
        };
      })(this));
    };

    Controller.prototype.stop = function() {
      var _ref;
      this.outputView.detach();
      return (_ref = this.client) != null ? _ref.end() : void 0;
    };

    Controller.prototype.evalCurrentExpression = function() {
      var expression;
      expression = this.codeManager.currentExpressionWithNamespace();
      return this.session.evaluate(expression, (function(_this) {
        return function(err, values) {
          if (err) {
            return _this.outputView.showError(err);
          } else {
            return _this.outputView.showValues(values.slice(1));
          }
        };
      })(this));
    };

    return Controller;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRDQUFBOztBQUFBLEVBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBQVYsQ0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQURiLENBQUE7O0FBQUEsRUFFQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBRmQsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLG9CQUFDLE1BQUQsRUFBVSxhQUFWLEVBQXlCLFNBQXpCLEdBQUE7QUFDWCxNQURvQixJQUFDLENBQUEsZ0JBQUEsYUFDckIsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBZSxJQUFBLE9BQUEsQ0FBUSxNQUFSLEVBQWdCLFNBQWhCLENBQWYsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFdBQUQsR0FBbUIsSUFBQSxXQUFBLENBQVksYUFBWixDQURuQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsVUFBRCxHQUFrQixJQUFBLFVBQUEsQ0FBQSxDQUZsQixDQURXO0lBQUEsQ0FBYjs7QUFBQSx5QkFLQSxLQUFBLEdBQU8sU0FBQSxHQUFBO0FBQ0wsTUFBQSxJQUFDLENBQUEsVUFBVSxDQUFDLFFBQVosQ0FBcUIsSUFBQyxDQUFBLGFBQXRCLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUF1QixZQUF2QixFQUFxQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNuQyxLQUFDLENBQUEscUJBQUQsQ0FBQSxFQURtQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJDLEVBRks7SUFBQSxDQUxQLENBQUE7O0FBQUEseUJBVUEsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxNQUFaLENBQUEsQ0FBQSxDQUFBO2dEQUNPLENBQUUsR0FBVCxDQUFBLFdBRkk7SUFBQSxDQVZOLENBQUE7O0FBQUEseUJBY0EscUJBQUEsR0FBdUIsU0FBQSxHQUFBO0FBQ3JCLFVBQUEsVUFBQTtBQUFBLE1BQUEsVUFBQSxHQUFhLElBQUMsQ0FBQSxXQUFXLENBQUMsOEJBQWIsQ0FBQSxDQUFiLENBQUE7YUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFFBQVQsQ0FBa0IsVUFBbEIsRUFBOEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsR0FBRCxFQUFNLE1BQU4sR0FBQTtBQUM1QixVQUFBLElBQUcsR0FBSDttQkFDRSxLQUFDLENBQUEsVUFBVSxDQUFDLFNBQVosQ0FBc0IsR0FBdEIsRUFERjtXQUFBLE1BQUE7bUJBR0UsS0FBQyxDQUFBLFVBQVUsQ0FBQyxVQUFaLENBQXVCLE1BQU0sQ0FBQyxLQUFQLENBQWEsQ0FBYixDQUF2QixFQUhGO1dBRDRCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUIsRUFGcUI7SUFBQSxDQWR2QixDQUFBOztzQkFBQTs7TUFORixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/alan/.dotfiles/.atom/packages/nrepl/lib/controller.coffee