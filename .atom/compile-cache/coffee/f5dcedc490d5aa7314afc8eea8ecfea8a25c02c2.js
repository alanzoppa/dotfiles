(function() {
  var StepJumper;

  module.exports = StepJumper = (function() {
    function StepJumper(line) {
      var matchData;
      this.line = line;
      matchData = this.line.match(/^\s*(\w+)\s+(.*)/);
      if (matchData) {
        this.firstWord = matchData[1];
        this.restOfLine = matchData[2];
      }
    }

    StepJumper.prototype.stepTypeRegex = function() {
      return new RegExp("(Given|When|Then)\(.*\)");
    };

    StepJumper.prototype.checkMatch = function(_arg) {
      var filePath, match, matches, regex, _i, _len;
      filePath = _arg.filePath, matches = _arg.matches;
      for (_i = 0, _len = matches.length; _i < _len; _i++) {
        match = matches[_i];
        console.log("Searching in " + filePath);
        regex = match.matchText.match(/^\w+\(\/(.*)\/\)/)[1];
        if (this.restOfLine.match(new RegExp(regex))) {
          return [filePath, match.range[0][0]];
        }
      }
    };

    return StepJumper;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFVBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBRVMsSUFBQSxvQkFBRSxJQUFGLEdBQUE7QUFDWCxVQUFBLFNBQUE7QUFBQSxNQURZLElBQUMsQ0FBQSxPQUFBLElBQ2IsQ0FBQTtBQUFBLE1BQUEsU0FBQSxHQUFZLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLGtCQUFaLENBQVosQ0FBQTtBQUNBLE1BQUEsSUFBRyxTQUFIO0FBQ0UsUUFBQSxJQUFDLENBQUEsU0FBRCxHQUFhLFNBQVUsQ0FBQSxDQUFBLENBQXZCLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxVQUFELEdBQWMsU0FBVSxDQUFBLENBQUEsQ0FEeEIsQ0FERjtPQUZXO0lBQUEsQ0FBYjs7QUFBQSx5QkFNQSxhQUFBLEdBQWUsU0FBQSxHQUFBO2FBQ1QsSUFBQSxNQUFBLENBQU8seUJBQVAsRUFEUztJQUFBLENBTmYsQ0FBQTs7QUFBQSx5QkFTQSxVQUFBLEdBQVksU0FBQyxJQUFELEdBQUE7QUFDVixVQUFBLHlDQUFBO0FBQUEsTUFEWSxnQkFBQSxVQUFVLGVBQUEsT0FDdEIsQ0FBQTtBQUFBLFdBQUEsOENBQUE7NEJBQUE7QUFDRSxRQUFBLE9BQU8sQ0FBQyxHQUFSLENBQWEsZUFBQSxHQUFjLFFBQTNCLENBQUEsQ0FBQTtBQUFBLFFBQ0EsS0FBQSxHQUFRLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBaEIsQ0FBc0Isa0JBQXRCLENBQTBDLENBQUEsQ0FBQSxDQURsRCxDQUFBO0FBRUEsUUFBQSxJQUFHLElBQUMsQ0FBQSxVQUFVLENBQUMsS0FBWixDQUFzQixJQUFBLE1BQUEsQ0FBTyxLQUFQLENBQXRCLENBQUg7QUFDRSxpQkFBTyxDQUFDLFFBQUQsRUFBVyxLQUFLLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBMUIsQ0FBUCxDQURGO1NBSEY7QUFBQSxPQURVO0lBQUEsQ0FUWixDQUFBOztzQkFBQTs7TUFISixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/alan/.dotfiles/.atom/packages/cucumber-step/lib/step-jumper.coffee