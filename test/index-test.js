var vows = require('vows');
var assert = require('assert');
var singly = require('passport-singly');

vows.describe('passport-singly').addBatch({
  'module': {
    'should report a version': function () {
      assert.isString(singly.version);
    }
  }
})['export'](module);
