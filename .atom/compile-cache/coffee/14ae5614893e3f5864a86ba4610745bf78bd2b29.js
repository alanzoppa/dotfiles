(function() {
  var StepJumper;

  StepJumper = require('./step-jumper');

  module.exports = {
    cucumberStepView: null,
    activate: function(state) {
      return atom.workspaceView.command("cucumber-step:jump-to-step", (function(_this) {
        return function() {
          var currentLine, options, stepJumper;
          currentLine = atom.workspace.getActiveEditor().getCursor().getCurrentBufferLine();
          stepJumper = new StepJumper(currentLine);
          if (!stepJumper.firstWord) {
            return;
          }
          options = {
            paths: ["features/step_definitions/**/*.rb"]
          };
          return atom.project.scan(stepJumper.stepTypeRegex(), options, function(match) {
            var file, foundMatch, line;
            if (foundMatch = stepJumper.checkMatch(match)) {
              file = foundMatch[0], line = foundMatch[1];
              console.log("Found match at " + file + ":" + line);
              return atom.workspace.open(file).done(function(editor) {
                return editor.setCursorBufferPosition([line, 0]);
              });
            }
          });
        };
      })(this));
    },
    deactivate: function() {
      return this.cucumberStepView.destroy();
    },
    serialize: function() {
      return {
        cucumberStepViewState: this.cucumberStepView.serialize()
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFVBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FBYixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsZ0JBQUEsRUFBa0IsSUFBbEI7QUFBQSxJQUVBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTthQUNSLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIsNEJBQTNCLEVBQXlELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDdkQsY0FBQSxnQ0FBQTtBQUFBLFVBQUEsV0FBQSxHQUFjLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZixDQUFBLENBQWdDLENBQUMsU0FBakMsQ0FBQSxDQUE0QyxDQUFDLG9CQUE3QyxDQUFBLENBQWQsQ0FBQTtBQUFBLFVBQ0EsVUFBQSxHQUFpQixJQUFBLFVBQUEsQ0FBVyxXQUFYLENBRGpCLENBQUE7QUFFQSxVQUFBLElBQUEsQ0FBQSxVQUF3QixDQUFDLFNBQXpCO0FBQUEsa0JBQUEsQ0FBQTtXQUZBO0FBQUEsVUFHQSxPQUFBLEdBQ0U7QUFBQSxZQUFBLEtBQUEsRUFBTyxDQUFDLG1DQUFELENBQVA7V0FKRixDQUFBO2lCQUtBLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBYixDQUFrQixVQUFVLENBQUMsYUFBWCxDQUFBLENBQWxCLEVBQThDLE9BQTlDLEVBQXVELFNBQUMsS0FBRCxHQUFBO0FBQ3JELGdCQUFBLHNCQUFBO0FBQUEsWUFBQSxJQUFHLFVBQUEsR0FBYSxVQUFVLENBQUMsVUFBWCxDQUFzQixLQUF0QixDQUFoQjtBQUNFLGNBQUMsb0JBQUQsRUFBTyxvQkFBUCxDQUFBO0FBQUEsY0FDQSxPQUFPLENBQUMsR0FBUixDQUFhLGlCQUFBLEdBQWdCLElBQWhCLEdBQXNCLEdBQXRCLEdBQXdCLElBQXJDLENBREEsQ0FBQTtxQkFFQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsSUFBcEIsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixTQUFDLE1BQUQsR0FBQTt1QkFBWSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxJQUFELEVBQU8sQ0FBUCxDQUEvQixFQUFaO2NBQUEsQ0FBL0IsRUFIRjthQURxRDtVQUFBLENBQXZELEVBTnVEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekQsRUFEUTtJQUFBLENBRlY7QUFBQSxJQWdCQSxVQUFBLEVBQVksU0FBQSxHQUFBO2FBQ1YsSUFBQyxDQUFBLGdCQUFnQixDQUFDLE9BQWxCLENBQUEsRUFEVTtJQUFBLENBaEJaO0FBQUEsSUFtQkEsU0FBQSxFQUFXLFNBQUEsR0FBQTthQUNUO0FBQUEsUUFBQSxxQkFBQSxFQUF1QixJQUFDLENBQUEsZ0JBQWdCLENBQUMsU0FBbEIsQ0FBQSxDQUF2QjtRQURTO0lBQUEsQ0FuQlg7R0FIRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/alan/.dotfiles/.atom/packages/cucumber-step/lib/cucumber-step.coffee