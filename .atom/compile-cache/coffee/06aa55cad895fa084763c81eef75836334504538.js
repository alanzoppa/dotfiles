(function() {
  var BufferedProcess, Point, Q, TagGenerator, path, _ref;

  _ref = require('atom'), BufferedProcess = _ref.BufferedProcess, Point = _ref.Point;

  Q = require('q');

  path = require('path');

  module.exports = TagGenerator = (function() {
    function TagGenerator(path) {
      this.path = path;
    }

    TagGenerator.prototype.parseTagLine = function(line) {
      var sections;
      sections = line.split('\t');
      if (sections.length > 3) {
        return {
          position: new Point(parseInt(sections[2]) - 1),
          name: sections[0]
        };
      } else {
        return null;
      }
    };

    TagGenerator.prototype.generate = function() {
      var args, command, defaultCtagsFile, deferred, exit, stdout, tags;
      deferred = Q.defer();
      tags = [];
      command = path.resolve(__dirname, '..', 'vendor', "ctags-" + process.platform);
      defaultCtagsFile = require.resolve('./.ctags');
      args = ["--options=" + defaultCtagsFile, '--fields=+KS', '-nf', '-', this.path];
      stdout = (function(_this) {
        return function(lines) {
          var line, tag, _i, _len, _ref1, _results;
          _ref1 = lines.split('\n');
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            line = _ref1[_i];
            tag = _this.parseTagLine(line);
            if (tag) {
              _results.push(tags.push(tag));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
      })(this);
      exit = function() {
        return deferred.resolve(tags);
      };
      new BufferedProcess({
        command: command,
        args: args,
        stdout: stdout,
        exit: exit
      });
      return deferred.promise;
    };

    return TagGenerator;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1EQUFBOztBQUFBLEVBQUEsT0FBMkIsT0FBQSxDQUFRLE1BQVIsQ0FBM0IsRUFBQyx1QkFBQSxlQUFELEVBQWtCLGFBQUEsS0FBbEIsQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsR0FBUixDQURKLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsc0JBQUUsSUFBRixHQUFBO0FBQVMsTUFBUixJQUFDLENBQUEsT0FBQSxJQUFPLENBQVQ7SUFBQSxDQUFiOztBQUFBLDJCQUVBLFlBQUEsR0FBYyxTQUFDLElBQUQsR0FBQTtBQUNaLFVBQUEsUUFBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBWCxDQUFYLENBQUE7QUFDQSxNQUFBLElBQUcsUUFBUSxDQUFDLE1BQVQsR0FBa0IsQ0FBckI7ZUFDRTtBQUFBLFVBQUEsUUFBQSxFQUFjLElBQUEsS0FBQSxDQUFNLFFBQUEsQ0FBUyxRQUFTLENBQUEsQ0FBQSxDQUFsQixDQUFBLEdBQXdCLENBQTlCLENBQWQ7QUFBQSxVQUNBLElBQUEsRUFBTSxRQUFTLENBQUEsQ0FBQSxDQURmO1VBREY7T0FBQSxNQUFBO2VBSUUsS0FKRjtPQUZZO0lBQUEsQ0FGZCxDQUFBOztBQUFBLDJCQVVBLFFBQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixVQUFBLDZEQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsQ0FBQyxDQUFDLEtBQUYsQ0FBQSxDQUFYLENBQUE7QUFBQSxNQUNBLElBQUEsR0FBTyxFQURQLENBQUE7QUFBQSxNQUVBLE9BQUEsR0FBVSxJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWIsRUFBd0IsSUFBeEIsRUFBOEIsUUFBOUIsRUFBeUMsUUFBQSxHQUFPLE9BQU8sQ0FBQyxRQUF4RCxDQUZWLENBQUE7QUFBQSxNQUdBLGdCQUFBLEdBQW1CLE9BQU8sQ0FBQyxPQUFSLENBQWdCLFVBQWhCLENBSG5CLENBQUE7QUFBQSxNQUlBLElBQUEsR0FBTyxDQUFFLFlBQUEsR0FBVyxnQkFBYixFQUFrQyxjQUFsQyxFQUFrRCxLQUFsRCxFQUF5RCxHQUF6RCxFQUE4RCxJQUFDLENBQUEsSUFBL0QsQ0FKUCxDQUFBO0FBQUEsTUFLQSxNQUFBLEdBQVMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxHQUFBO0FBQ1AsY0FBQSxvQ0FBQTtBQUFBO0FBQUE7ZUFBQSw0Q0FBQTs2QkFBQTtBQUNFLFlBQUEsR0FBQSxHQUFNLEtBQUMsQ0FBQSxZQUFELENBQWMsSUFBZCxDQUFOLENBQUE7QUFDQSxZQUFBLElBQWtCLEdBQWxCOzRCQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsR0FBVixHQUFBO2FBQUEsTUFBQTtvQ0FBQTthQUZGO0FBQUE7MEJBRE87UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUxULENBQUE7QUFBQSxNQVNBLElBQUEsR0FBTyxTQUFBLEdBQUE7ZUFDTCxRQUFRLENBQUMsT0FBVCxDQUFpQixJQUFqQixFQURLO01BQUEsQ0FUUCxDQUFBO0FBQUEsTUFZSSxJQUFBLGVBQUEsQ0FBZ0I7QUFBQSxRQUFDLFNBQUEsT0FBRDtBQUFBLFFBQVUsTUFBQSxJQUFWO0FBQUEsUUFBZ0IsUUFBQSxNQUFoQjtBQUFBLFFBQXdCLE1BQUEsSUFBeEI7T0FBaEIsQ0FaSixDQUFBO2FBY0EsUUFBUSxDQUFDLFFBZkQ7SUFBQSxDQVZWLENBQUE7O3dCQUFBOztNQU5GLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/alan/.dotfiles/.atom/packages/symbols-view/lib/tag-generator.coffee