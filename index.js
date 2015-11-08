module.exports = {
  message: 'Classes beginning with ".js-" should not be styled. Only use them as Javascript hooks.',
  name: 'no-js-styles',
  test: function(ast){
    var errors = [];

    ast.traverseByType('ruleset', function (ruleset){
      var string = ruleset.toString();

      if (string.indexOf('.js-') !== -1 || string.indexOf('#js-') !== -1) {
        errors.push({
          node: ruleset
        });
      }
    });

    return errors;
  }
};