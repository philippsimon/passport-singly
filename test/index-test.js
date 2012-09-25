var vows = require('vows');
var assert = require('assert');
var util = require('util');
var singly = require('passport-singly');

vows.describe('passport-singly').addBatch({
  'module': {
    'should report a version': function (x) {
      assert.isString(singly.version);
    }
  }
})['export'](module);
