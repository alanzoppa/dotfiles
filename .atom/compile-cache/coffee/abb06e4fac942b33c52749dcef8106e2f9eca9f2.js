(function() {
  module.exports = {
    activate: function() {
      atom.workspaceView.command('symbols-view:toggle-file-symbols', (function(_this) {
        return function() {
          return _this.createFileView().toggle();
        };
      })(this));
      atom.workspaceView.command('symbols-view:toggle-project-symbols', (function(_this) {
        return function() {
          return _this.createProjectView().toggle();
        };
      })(this));
      return atom.workspaceView.command('symbols-view:go-to-declaration', (function(_this) {
        return function() {
          return _this.createGoToView().toggle();
        };
      })(this));
    },
    deactivate: function() {
      if (this.fileView != null) {
        this.fileView.destroy();
        this.fileView = null;
      }
      if (this.projectView != null) {
        this.projectView.destroy();
        this.projectView = null;
      }
      if (this.goToView != null) {
        this.goToView.destroy();
        return this.goToView = null;
      }
    },
    createFileView: function() {
      var FileView;
      if (this.fileView == null) {
        FileView = require('./file-view');
        this.fileView = new FileView();
      }
      return this.fileView;
    },
    createProjectView: function() {
      var ProjectView;
      if (this.projectView == null) {
        ProjectView = require('./project-view');
        this.projectView = new ProjectView();
      }
      return this.projectView;
    },
    createGoToView: function() {
      var GoToView;
      if (this.goToView == null) {
        GoToView = require('./go-to-view');
        this.goToView = new GoToView();
      }
      return this.goToView;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIsa0NBQTNCLEVBQStELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQzdELEtBQUMsQ0FBQSxjQUFELENBQUEsQ0FBaUIsQ0FBQyxNQUFsQixDQUFBLEVBRDZEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBL0QsQ0FBQSxDQUFBO0FBQUEsTUFHQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLHFDQUEzQixFQUFrRSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNoRSxLQUFDLENBQUEsaUJBQUQsQ0FBQSxDQUFvQixDQUFDLE1BQXJCLENBQUEsRUFEZ0U7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsRSxDQUhBLENBQUE7YUFNQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLGdDQUEzQixFQUE2RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUMzRCxLQUFDLENBQUEsY0FBRCxDQUFBLENBQWlCLENBQUMsTUFBbEIsQ0FBQSxFQUQyRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdELEVBUFE7SUFBQSxDQUFWO0FBQUEsSUFVQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFHLHFCQUFIO0FBQ0UsUUFBQSxJQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFEWixDQURGO09BQUE7QUFJQSxNQUFBLElBQUcsd0JBQUg7QUFDRSxRQUFBLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQURmLENBREY7T0FKQTtBQVFBLE1BQUEsSUFBRyxxQkFBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxPQUFWLENBQUEsQ0FBQSxDQUFBO2VBQ0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUZkO09BVFU7SUFBQSxDQVZaO0FBQUEsSUF1QkEsY0FBQSxFQUFnQixTQUFBLEdBQUE7QUFDZCxVQUFBLFFBQUE7QUFBQSxNQUFBLElBQU8scUJBQVA7QUFDRSxRQUFBLFFBQUEsR0FBWSxPQUFBLENBQVEsYUFBUixDQUFaLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsUUFBQSxDQUFBLENBRGhCLENBREY7T0FBQTthQUdBLElBQUMsQ0FBQSxTQUphO0lBQUEsQ0F2QmhCO0FBQUEsSUE2QkEsaUJBQUEsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLFVBQUEsV0FBQTtBQUFBLE1BQUEsSUFBTyx3QkFBUDtBQUNFLFFBQUEsV0FBQSxHQUFlLE9BQUEsQ0FBUSxnQkFBUixDQUFmLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxXQUFELEdBQW1CLElBQUEsV0FBQSxDQUFBLENBRG5CLENBREY7T0FBQTthQUdBLElBQUMsQ0FBQSxZQUppQjtJQUFBLENBN0JwQjtBQUFBLElBbUNBLGNBQUEsRUFBZ0IsU0FBQSxHQUFBO0FBQ2QsVUFBQSxRQUFBO0FBQUEsTUFBQSxJQUFPLHFCQUFQO0FBQ0UsUUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGNBQVIsQ0FBWCxDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsUUFBRCxHQUFnQixJQUFBLFFBQUEsQ0FBQSxDQURoQixDQURGO09BQUE7YUFHQSxJQUFDLENBQUEsU0FKYTtJQUFBLENBbkNoQjtHQURGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/alan/.dotfiles/.atom/packages/symbols-view/lib/main.coffee