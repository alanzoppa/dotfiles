(function() {
  var Session, fs, getPort, path;

  fs = require('fs');

  path = require('path');

  module.exports = Session = (function() {
    function Session(client, directory) {
      this.client = client;
      this.directory = directory;
    }

    Session.prototype.evaluate = function(input, fn) {
      return this.connect(null, (function(_this) {
        return function(err) {
          if (err) {
            return fn(err);
          } else {
            return _this.client["eval"](input, fn);
          }
        };
      })(this));
    };

    Session.prototype.connect = function(port, fn) {
      if (this.client.isConnected()) {
        return fn();
      } else {
        return getPort(this, (function(_this) {
          return function(port) {
            var error;
            if (port) {
              return _this.client.connect(port, fn);
            } else {
              error = new Error("Could not find nrepl port file.");
              error.type = "Connection Error";
              return fn(error);
            }
          };
        })(this));
      }
    };

    return Session;

  })();

  getPort = function(self, fn) {
    var portFilePath;
    portFilePath = path.join(self.directory.path, "target", "repl", "repl-port");
    return fs.exists(portFilePath, function(result) {
      if (result) {
        return fs.readFile(portFilePath, function(err, content) {
          return fn(content && parseInt(content));
        });
      } else {
        return fn(null);
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBCQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxpQkFBRSxNQUFGLEVBQVcsU0FBWCxHQUFBO0FBQXVCLE1BQXRCLElBQUMsQ0FBQSxTQUFBLE1BQXFCLENBQUE7QUFBQSxNQUFiLElBQUMsQ0FBQSxZQUFBLFNBQVksQ0FBdkI7SUFBQSxDQUFiOztBQUFBLHNCQUVBLFFBQUEsR0FBVSxTQUFDLEtBQUQsRUFBUSxFQUFSLEdBQUE7YUFDUixJQUFDLENBQUEsT0FBRCxDQUFTLElBQVQsRUFBZSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxHQUFELEdBQUE7QUFDYixVQUFBLElBQUcsR0FBSDttQkFDRSxFQUFBLENBQUcsR0FBSCxFQURGO1dBQUEsTUFBQTttQkFHRSxLQUFDLENBQUEsTUFBTSxDQUFDLE1BQUQsQ0FBUCxDQUFhLEtBQWIsRUFBb0IsRUFBcEIsRUFIRjtXQURhO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZixFQURRO0lBQUEsQ0FGVixDQUFBOztBQUFBLHNCQVNBLE9BQUEsR0FBUyxTQUFDLElBQUQsRUFBTyxFQUFQLEdBQUE7QUFDUCxNQUFBLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFSLENBQUEsQ0FBSDtlQUNFLEVBQUEsQ0FBQSxFQURGO09BQUEsTUFBQTtlQUdFLE9BQUEsQ0FBUSxJQUFSLEVBQWMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLElBQUQsR0FBQTtBQUNaLGdCQUFBLEtBQUE7QUFBQSxZQUFBLElBQUcsSUFBSDtxQkFDRSxLQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBZ0IsSUFBaEIsRUFBc0IsRUFBdEIsRUFERjthQUFBLE1BQUE7QUFHRSxjQUFBLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBTSxpQ0FBTixDQUFaLENBQUE7QUFBQSxjQUNBLEtBQUssQ0FBQyxJQUFOLEdBQWEsa0JBRGIsQ0FBQTtxQkFFQSxFQUFBLENBQUcsS0FBSCxFQUxGO2FBRFk7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFkLEVBSEY7T0FETztJQUFBLENBVFQsQ0FBQTs7bUJBQUE7O01BTEYsQ0FBQTs7QUFBQSxFQTBCQSxPQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sRUFBUCxHQUFBO0FBQ1IsUUFBQSxZQUFBO0FBQUEsSUFBQSxZQUFBLEdBQWUsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQXpCLEVBQStCLFFBQS9CLEVBQXlDLE1BQXpDLEVBQWlELFdBQWpELENBQWYsQ0FBQTtXQUVBLEVBQUUsQ0FBQyxNQUFILENBQVUsWUFBVixFQUF3QixTQUFDLE1BQUQsR0FBQTtBQUN0QixNQUFBLElBQUcsTUFBSDtlQUNFLEVBQUUsQ0FBQyxRQUFILENBQVksWUFBWixFQUEwQixTQUFDLEdBQUQsRUFBTSxPQUFOLEdBQUE7aUJBQ3hCLEVBQUEsQ0FBRyxPQUFBLElBQVksUUFBQSxDQUFTLE9BQVQsQ0FBZixFQUR3QjtRQUFBLENBQTFCLEVBREY7T0FBQSxNQUFBO2VBSUUsRUFBQSxDQUFHLElBQUgsRUFKRjtPQURzQjtJQUFBLENBQXhCLEVBSFE7RUFBQSxDQTFCVixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/alan/.dotfiles/.atom/packages/nrepl/lib/session.coffee