(function() {
  var OutputView, View, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  _ = require('underscore');

  module.exports = OutputView = (function(_super) {
    __extends(OutputView, _super);

    function OutputView() {
      return OutputView.__super__.constructor.apply(this, arguments);
    }

    OutputView.content = function() {
      return this.div({
        id: 'nrepl-output',
        "class": 'overlay from-top',
        click: 'hide'
      }, (function(_this) {
        return function() {
          _this.ol({
            outlet: 'messages'
          });
          return _this.span({
            outlet: 'valueList',
            "class": 'message'
          });
        };
      })(this));
    };

    OutputView.prototype.initialize = function() {
      return this.hide();
    };

    OutputView.prototype.showError = function(error) {
      this.show();
      this.valueList.empty();
      return this.valueList.append(View.render(function() {
        return this.li({
          "class": 'text-error'
        }, error.type + " - " + error.message);
      }));
    };

    OutputView.prototype.showValues = function(values) {
      var value, _i, _len, _results;
      this.show();
      this.valueList.empty();
      _results = [];
      for (_i = 0, _len = values.length; _i < _len; _i++) {
        value = values[_i];
        _results.push(this.valueList.append(View.render(function() {
          return this.li({
            "class": 'block'
          }, value);
        })));
      }
      return _results;
    };

    return OutputView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxNQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxZQUFSLENBREosQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixpQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxVQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLEVBQUEsRUFBSSxjQUFKO0FBQUEsUUFBb0IsT0FBQSxFQUFPLGtCQUEzQjtBQUFBLFFBQStDLEtBQUEsRUFBTyxNQUF0RDtPQUFMLEVBQW1FLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDakUsVUFBQSxLQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsWUFBQSxNQUFBLEVBQVEsVUFBUjtXQUFKLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsWUFBQSxNQUFBLEVBQVEsV0FBUjtBQUFBLFlBQXFCLE9BQUEsRUFBTyxTQUE1QjtXQUFOLEVBRmlFO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkUsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSx5QkFLQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQ1YsSUFBQyxDQUFBLElBQUQsQ0FBQSxFQURVO0lBQUEsQ0FMWixDQUFBOztBQUFBLHlCQVFBLFNBQUEsR0FBVyxTQUFDLEtBQUQsR0FBQTtBQUNULE1BQUEsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxTQUFTLENBQUMsS0FBWCxDQUFBLENBREEsQ0FBQTthQUVBLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxDQUFrQixJQUFJLENBQUMsTUFBTCxDQUFZLFNBQUEsR0FBQTtlQUM1QixJQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsVUFBQSxPQUFBLEVBQU8sWUFBUDtTQUFKLEVBQXlCLEtBQUssQ0FBQyxJQUFOLEdBQWEsS0FBYixHQUFxQixLQUFLLENBQUMsT0FBcEQsRUFENEI7TUFBQSxDQUFaLENBQWxCLEVBSFM7SUFBQSxDQVJYLENBQUE7O0FBQUEseUJBY0EsVUFBQSxHQUFZLFNBQUMsTUFBRCxHQUFBO0FBQ1YsVUFBQSx5QkFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxTQUFTLENBQUMsS0FBWCxDQUFBLENBREEsQ0FBQTtBQUVBO1dBQUEsNkNBQUE7MkJBQUE7QUFDRSxzQkFBQSxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBa0IsSUFBSSxDQUFDLE1BQUwsQ0FBWSxTQUFBLEdBQUE7aUJBQzVCLElBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxZQUFBLE9BQUEsRUFBTyxPQUFQO1dBQUosRUFBb0IsS0FBcEIsRUFENEI7UUFBQSxDQUFaLENBQWxCLEVBQUEsQ0FERjtBQUFBO3NCQUhVO0lBQUEsQ0FkWixDQUFBOztzQkFBQTs7S0FEdUIsS0FKekIsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/alan/.dotfiles/.atom/packages/nrepl/lib/output-view.coffee