define(function (require) {
  var registerSuite = require('intern!object'),
      assert        = require('intern/chai!assert'),
      plugin        = require('intern/dojo/node!../index'),
      fs            = require('intern/dojo/node!fs'),
      gonzales      = require('intern/dojo/node!../node_modules/gonzales-pe');

  registerSuite({
    name: 'polish-no-js-styles',

    message: function () {
      assert.strictEqual(plugin.message, 'Classes beginning with ".js-" should not be styled. Only use them as Javascript hooks.');
    }
  });

  registerSuite({
    name: 'polish-no-js-styles CSS tests',
    test: function() {
      var deferred = this.async(3000),
          errors;

      fs.readFile('./tests/css.css', deferred.callback(function(error, stylesheet) {
        if (error) {
          throw error;
        }

        errors = plugin.test(gonzales.parse(stylesheet.toString('utf8'), { syntax : 'css' }));

        assert.strictEqual(errors.length, 4);
        assert.equal(errors[0].node.first('selector').toString().trim(), '.js-this-rule-will-fail');
        assert.equal(errors[1].node.first('selector').toString().trim(), '#js-this-fails-too');
        assert.equal(errors[2].node.first('selector').toString().trim(), '.this-rule-should-fail-too .js-this-fails');
        assert.equal(errors[3].node.first('selector').last('simpleSelector').toString().trim(), '.js-will-fail-too');
      }));
    }
  });

  registerSuite({
    name: 'polish-no-js-styles SCSS tests',
    test: function() {
      var deferred = this.async(3000),
          errors;

      fs.readFile('./tests/scss.scss', deferred.callback(function(error, stylesheet) {
        if (error) {
          throw error;
        }

        errors = plugin.test(gonzales.parse(stylesheet.toString('utf8'), { syntax : 'scss' }));

        assert.strictEqual(errors.length, 2);
        assert.equal(errors[0].node.first('selector').toString().trim(), '.js-this-rule-will-fail');
        assert.notEqual(errors[1].node.toString().indexOf('.js-this-fails'), -1, 'It should fail on the nested rule.');
      }));
    }
  });
});