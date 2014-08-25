(function() {
  var StyleguideView, createStyleguideView, deserializer, styleguideUri;

  StyleguideView = null;

  styleguideUri = 'atom://styleguide';

  createStyleguideView = function(state) {
    if (StyleguideView == null) {
      StyleguideView = require('./styleguide-view');
    }
    return new StyleguideView(state);
  };

  deserializer = {
    name: 'StyleguideView',
    deserialize: function(state) {
      return createStyleguideView(state);
    }
  };

  atom.deserializers.add(deserializer);

  module.exports = {
    activate: function() {
      atom.project.registerOpener(function(filePath) {
        if (filePath === styleguideUri) {
          return createStyleguideView({
            uri: styleguideUri
          });
        }
      });
      return atom.workspaceView.command('styleguide:show', function() {
        return atom.workspaceView.open(styleguideUri);
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlFQUFBOztBQUFBLEVBQUEsY0FBQSxHQUFpQixJQUFqQixDQUFBOztBQUFBLEVBQ0EsYUFBQSxHQUFnQixtQkFEaEIsQ0FBQTs7QUFBQSxFQUdBLG9CQUFBLEdBQXVCLFNBQUMsS0FBRCxHQUFBOztNQUNyQixpQkFBa0IsT0FBQSxDQUFRLG1CQUFSO0tBQWxCO1dBQ0ksSUFBQSxjQUFBLENBQWUsS0FBZixFQUZpQjtFQUFBLENBSHZCLENBQUE7O0FBQUEsRUFPQSxZQUFBLEdBQ0U7QUFBQSxJQUFBLElBQUEsRUFBTSxnQkFBTjtBQUFBLElBQ0EsV0FBQSxFQUFhLFNBQUMsS0FBRCxHQUFBO2FBQVcsb0JBQUEsQ0FBcUIsS0FBckIsRUFBWDtJQUFBLENBRGI7R0FSRixDQUFBOztBQUFBLEVBVUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFuQixDQUF1QixZQUF2QixDQVZBLENBQUE7O0FBQUEsRUFZQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBNEIsU0FBQyxRQUFELEdBQUE7QUFDMUIsUUFBQSxJQUE0QyxRQUFBLEtBQVksYUFBeEQ7aUJBQUEsb0JBQUEsQ0FBcUI7QUFBQSxZQUFBLEdBQUEsRUFBSyxhQUFMO1dBQXJCLEVBQUE7U0FEMEI7TUFBQSxDQUE1QixDQUFBLENBQUE7YUFHQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLGlCQUEzQixFQUE4QyxTQUFBLEdBQUE7ZUFBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQW5CLENBQXdCLGFBQXhCLEVBQUg7TUFBQSxDQUE5QyxFQUpRO0lBQUEsQ0FBVjtHQWJGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/alan/.dotfiles/.atom/packages/styleguide/lib/styleguide.coffee