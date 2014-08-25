(function() {
  var CodeManager, DEFAULT_NAMESPACE, currentExpressionRange, expressionInRange, namespaceCall, namespaceForRange, _;

  _ = require('underscore');

  DEFAULT_NAMESPACE = "user";

  module.exports = CodeManager = (function() {
    function CodeManager(workspaceView) {
      this.workspaceView = workspaceView;
    }

    CodeManager.prototype.currentExpressionWithNamespace = function() {
      var editor, expression, namespace, range;
      editor = this.workspaceView.getActiveView().editor;
      range = currentExpressionRange(editor);
      expression = expressionInRange(range, editor);
      namespace = namespaceForRange(range, editor);
      return [namespaceCall(namespace), expression].join("\n");
    };

    return CodeManager;

  })();

  namespaceForRange = function(range, editor) {
    var buffer, charIndex, matches, _ref;
    buffer = editor.getBuffer();
    charIndex = buffer.characterIndexForPosition(range.start);
    matches = buffer.matchesInCharacterRange(/\(ns\s+([\w\.-]+)/g, 0, charIndex);
    return ((_ref = _.last(matches)) != null ? _ref[1] : void 0) || DEFAULT_NAMESPACE;
  };

  currentExpressionRange = function(editor) {
    return editor.getSelectedBufferRange();
  };

  expressionInRange = function(range, editor) {
    return editor.getTextInRange(range);
  };

  namespaceCall = function(namespace) {
    return "(ns " + namespace + ")";
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhHQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxZQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLGlCQUFBLEdBQW9CLE1BRHBCLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxxQkFBRSxhQUFGLEdBQUE7QUFBa0IsTUFBakIsSUFBQyxDQUFBLGdCQUFBLGFBQWdCLENBQWxCO0lBQUEsQ0FBYjs7QUFBQSwwQkFFQSw4QkFBQSxHQUFnQyxTQUFBLEdBQUE7QUFDOUIsVUFBQSxvQ0FBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxhQUFhLENBQUMsYUFBZixDQUFBLENBQThCLENBQUMsTUFBeEMsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxHQUFRLHNCQUFBLENBQXVCLE1BQXZCLENBRFIsQ0FBQTtBQUFBLE1BRUEsVUFBQSxHQUFhLGlCQUFBLENBQWtCLEtBQWxCLEVBQXlCLE1BQXpCLENBRmIsQ0FBQTtBQUFBLE1BR0EsU0FBQSxHQUFZLGlCQUFBLENBQWtCLEtBQWxCLEVBQXlCLE1BQXpCLENBSFosQ0FBQTthQUlBLENBQUMsYUFBQSxDQUFjLFNBQWQsQ0FBRCxFQUEyQixVQUEzQixDQUFzQyxDQUFDLElBQXZDLENBQTRDLElBQTVDLEVBTDhCO0lBQUEsQ0FGaEMsQ0FBQTs7dUJBQUE7O01BTEYsQ0FBQTs7QUFBQSxFQWNBLGlCQUFBLEdBQW9CLFNBQUMsS0FBRCxFQUFRLE1BQVIsR0FBQTtBQUNsQixRQUFBLGdDQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVMsTUFBTSxDQUFDLFNBQVAsQ0FBQSxDQUFULENBQUE7QUFBQSxJQUNBLFNBQUEsR0FBWSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsS0FBSyxDQUFDLEtBQXZDLENBRFosQ0FBQTtBQUFBLElBRUEsT0FBQSxHQUFVLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixvQkFBL0IsRUFBcUQsQ0FBckQsRUFBd0QsU0FBeEQsQ0FGVixDQUFBO21EQUdpQixDQUFBLENBQUEsV0FBakIsSUFBdUIsa0JBSkw7RUFBQSxDQWRwQixDQUFBOztBQUFBLEVBb0JBLHNCQUFBLEdBQXlCLFNBQUMsTUFBRCxHQUFBO1dBQ3ZCLE1BQU0sQ0FBQyxzQkFBUCxDQUFBLEVBRHVCO0VBQUEsQ0FwQnpCLENBQUE7O0FBQUEsRUF1QkEsaUJBQUEsR0FBb0IsU0FBQyxLQUFELEVBQVEsTUFBUixHQUFBO1dBQ2xCLE1BQU0sQ0FBQyxjQUFQLENBQXNCLEtBQXRCLEVBRGtCO0VBQUEsQ0F2QnBCLENBQUE7O0FBQUEsRUEwQkEsYUFBQSxHQUFnQixTQUFDLFNBQUQsR0FBQTtXQUNiLE1BQUEsR0FBSyxTQUFMLEdBQWdCLElBREg7RUFBQSxDQTFCaEIsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/alan/.dotfiles/.atom/packages/nrepl/lib/code-manager.coffee