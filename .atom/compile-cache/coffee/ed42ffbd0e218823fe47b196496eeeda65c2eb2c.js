(function() {
  var Point, Range, SCSSLint, Violation, XmlBase, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point;

  XmlBase = require('./xml-base');

  Violation = require('../violation');

  module.exports = SCSSLint = (function(_super) {
    __extends(SCSSLint, _super);

    function SCSSLint() {
      return SCSSLint.__super__.constructor.apply(this, arguments);
    }

    SCSSLint.canonicalName = 'SCSS-Lint';

    SCSSLint.prototype.buildCommand = function() {
      var command, userSCSSLintPath;
      command = [];
      userSCSSLintPath = atom.config.get('atom-lint.scss-lint.path');
      if (userSCSSLintPath != null) {
        command.push(userSCSSLintPath);
      } else {
        command.push('scss-lint');
      }
      command.push('--format', 'XML');
      command.push(this.filePath);
      return command;
    };

    SCSSLint.prototype.isValidExitCode = function(exitCode) {
      return exitCode === 0 || exitCode === 65;
    };

    SCSSLint.prototype.createViolationsFromXml = function(xml) {
      var element, _i, _len, _ref1, _results;
      if (xml.lint.file == null) {
        return [];
      }
      _ref1 = xml.lint.file[0].issue;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        element = _ref1[_i];
        _results.push(this.createViolationFromElement(element));
      }
      return _results;
    };

    SCSSLint.prototype.createViolationFromElement = function(element) {
      var bufferPoint, bufferRange, column;
      column = element.$.column;
      if (column == null) {
        column = 1;
      }
      bufferPoint = new Point(element.$.line - 1, column - 1);
      bufferRange = new Range(bufferPoint, bufferPoint);
      return new Violation(element.$.severity, bufferRange, element.$.reason);
    };

    return SCSSLint;

  })(XmlBase);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFpQixPQUFBLENBQVEsTUFBUixDQUFqQixFQUFDLGFBQUEsS0FBRCxFQUFRLGFBQUEsS0FBUixDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxZQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUVBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQUZaLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osK0JBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsUUFBQyxDQUFBLGFBQUQsR0FBaUIsV0FBakIsQ0FBQTs7QUFBQSx1QkFFQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osVUFBQSx5QkFBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLEVBQVYsQ0FBQTtBQUFBLE1BRUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDBCQUFoQixDQUZuQixDQUFBO0FBSUEsTUFBQSxJQUFHLHdCQUFIO0FBQ0UsUUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLGdCQUFiLENBQUEsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsV0FBYixDQUFBLENBSEY7T0FKQTtBQUFBLE1BU0EsT0FBTyxDQUFDLElBQVIsQ0FBYSxVQUFiLEVBQXlCLEtBQXpCLENBVEEsQ0FBQTtBQUFBLE1BVUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxJQUFDLENBQUEsUUFBZCxDQVZBLENBQUE7YUFXQSxRQVpZO0lBQUEsQ0FGZCxDQUFBOztBQUFBLHVCQWdCQSxlQUFBLEdBQWlCLFNBQUMsUUFBRCxHQUFBO2FBRWYsUUFBQSxLQUFZLENBQVosSUFBaUIsUUFBQSxLQUFZLEdBRmQ7SUFBQSxDQWhCakIsQ0FBQTs7QUFBQSx1QkFvQkEsdUJBQUEsR0FBeUIsU0FBQyxHQUFELEdBQUE7QUFDdkIsVUFBQSxrQ0FBQTtBQUFBLE1BQUEsSUFBaUIscUJBQWpCO0FBQUEsZUFBTyxFQUFQLENBQUE7T0FBQTtBQUNBO0FBQUE7V0FBQSw0Q0FBQTs0QkFBQTtBQUNFLHNCQUFBLElBQUMsQ0FBQSwwQkFBRCxDQUE0QixPQUE1QixFQUFBLENBREY7QUFBQTtzQkFGdUI7SUFBQSxDQXBCekIsQ0FBQTs7QUFBQSx1QkF5QkEsMEJBQUEsR0FBNEIsU0FBQyxPQUFELEdBQUE7QUFDMUIsVUFBQSxnQ0FBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBbkIsQ0FBQTs7UUFDQSxTQUFVO09BRFY7QUFBQSxNQUdBLFdBQUEsR0FBa0IsSUFBQSxLQUFBLENBQU0sT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFWLEdBQWlCLENBQXZCLEVBQTBCLE1BQUEsR0FBUyxDQUFuQyxDQUhsQixDQUFBO0FBQUEsTUFJQSxXQUFBLEdBQWtCLElBQUEsS0FBQSxDQUFNLFdBQU4sRUFBbUIsV0FBbkIsQ0FKbEIsQ0FBQTthQUtJLElBQUEsU0FBQSxDQUFVLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBcEIsRUFBOEIsV0FBOUIsRUFBMkMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFyRCxFQU5zQjtJQUFBLENBekI1QixDQUFBOztvQkFBQTs7S0FEcUIsUUFMdkIsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/alan/.dotfiles/.atom/packages/atom-lint/lib/linter/scss-lint.coffee