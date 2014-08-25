(function() {
  var Client, Controller;

  Controller = require('./controller');

  Client = require('nrepl.js').Client;

  module.exports = {
    controller: null,
    activate: function(state) {
      this.controller = new Controller(new Client(), atom.workspaceView, atom.project.getRootDirectory());
      return this.controller.start();
    },
    deactivate: function() {
      return this.controller.stop();
    },
    serialize: function() {
      return {};
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtCQUFBOztBQUFBLEVBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBQWIsQ0FBQTs7QUFBQSxFQUNDLFNBQVUsT0FBQSxDQUFRLFVBQVIsRUFBVixNQURELENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxVQUFBLEVBQVksSUFBWjtBQUFBLElBRUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsVUFBRCxHQUFrQixJQUFBLFVBQUEsQ0FDWixJQUFBLE1BQUEsQ0FBQSxDQURZLEVBRWhCLElBQUksQ0FBQyxhQUZXLEVBR2hCLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWIsQ0FBQSxDQUhnQixDQUFsQixDQUFBO2FBSUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxLQUFaLENBQUEsRUFMUTtJQUFBLENBRlY7QUFBQSxJQVNBLFVBQUEsRUFBWSxTQUFBLEdBQUE7YUFDVixJQUFDLENBQUEsVUFBVSxDQUFDLElBQVosQ0FBQSxFQURVO0lBQUEsQ0FUWjtBQUFBLElBWUEsU0FBQSxFQUFXLFNBQUEsR0FBQTthQUNULEdBRFM7SUFBQSxDQVpYO0dBSkYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/alan/.dotfiles/.atom/packages/nrepl/lib/nrepl.coffee