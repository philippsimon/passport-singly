var vows = require('vows');
var assert = require('assert');
var url = require('url');

var SinglyStrategy = require('passport-singly/strategy');

vows.describe('SinglyStrategy').addBatch({
  'strategy': {
    topic: function () {
      return new SinglyStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function () {});
    },

    'should be named singly': function (strategy) {
      assert.equal(strategy.name, 'singly');
    }
  },

  'strategy when redirecting for authorization': {
    topic: function () {
      var strategy = new SinglyStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      });

      return strategy;
    },

    'in the normal case': {
      topic: function (strategy) {
        var mockRequest = {
          param: function () {}
        };

        // Stub strategy.redirect()
        var self = this;

        strategy.redirect = function (location) {
          self.callback(null, location);
        };

        strategy.authenticate(mockRequest);
      },

      'does not set authorization param': function (err, location) {
        var params = url.parse(location, true).query;

        assert.isUndefined(params.display);
      }
    }
  },

  'strategy when loading user profile': {
    topic: function () {
      var strategy = new SinglyStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function () {});

      // mock
      strategy._oauth2.getProtectedResource = function (url, accessToken, callback) {
        var body = '{"id":"b680d5b0551d6368851295e8ab276818","name":"Beau Gunderson","url":"http:\\/\\/www.beaugunderson.com\\/","email":"beau\\u0040beaugunderson.com"}';

        callback(null, body, undefined);
      };

      return strategy;
    },

    'when told to load user profile': {
      topic: function (strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }

        process.nextTick(function () {
          strategy.userProfile('access-token', done);
        });
      },

      'should not error' : function (err, req) {
        assert.isNull(err);
        assert.isNotNull(req);
      },

      'should load profile' : function (err, profile) {
        assert.equal(profile.provider, 'singly');
        assert.equal(profile.id, 'b680d5b0551d6368851295e8ab276818');
        assert.equal(profile.username, 'b680d5b0551d6368851295e8ab276818');
        assert.equal(profile.displayName, 'Beau Gunderson');
        assert.equal(profile.profileUrl, 'http://www.beaugunderson.com/');
        assert.lengthOf(profile.emails, 1);
        assert.equal(profile.emails[0].value, 'beau@beaugunderson.com');
      },

      'should set raw property' : function (err, profile) {
        assert.isString(profile._raw);
      },

      'should set json property' : function (err, profile) {
        assert.isObject(profile._json);
      }
    }
  },

  'strategy when loading user profile and encountering an error': {
    topic: function () {
      var strategy = new SinglyStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function () {});

      // mock
      strategy._oauth2.getProtectedResource = function (url, accessToken,
        callback) {
        callback(new Error('something-went-wrong'));
      };

      return strategy;
    },

    'when told to load user profile': {
      topic: function (strategy) {
        var self = this;

        function done(err, profile) {
          self.callback(err, profile);
        }

        process.nextTick(function () {
          strategy.userProfile('access-token', done);
        });
      },

      'should error' : function (err, req) {
        assert.isNotNull(err);
        assert.isNotNull(req);
      },

      'should wrap error in InternalOAuthError' : function (err, req) {
        assert.equal(err.constructor.name, 'InternalOAuthError');
        assert.isNotNull(req);
      },

      'should not load profile' : function (err, profile) {
        assert.isUndefined(profile);
      }
    }
  }
})['export'](module);
