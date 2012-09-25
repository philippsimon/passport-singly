/**
 * Module dependencies.
 */
var util = require('util');

var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var InternalOAuthError = require('passport-oauth').InternalOAuthError;

/**
 * `Strategy` constructor.
 *
 * The Singly authentication strategy authenticates requests by delegating to
 * Singly using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Singly application's App ID
 *   - `clientSecret`  your Singly application's App Secret
 *   - `callbackURL`   URL to which Singly will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new SinglyStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/singly/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};

  options.authorizationURL = options.authorizationURL || 'https://api.singly.com/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://api.singly.com/oauth/access_token';

  options.scopeSeparator = options.scopeSeparator || ',';

  OAuth2Strategy.call(this, options, verify);

  this.name = 'singly';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Return extra Singly-specific parameters to be included in the authorization
 * request.
 *
 * Options:
 *  - `service`  The service to authenticate against, { `facebook`, `twitter`, `instagram` }.
 *
 * @param {Object} options
 * @return {Object}
 * @api protected
 */
Strategy.prototype.authorizationParams = function(options) {
  var params = {};
  var service = options.service;

  if (service) {
    params.service = service;
  }

  return params;
};

/**
 * Retrieve user profile from Singly.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `singly`
 *   - `id`               the user's Singly ID
 *   - `username`         the user's Singly username (same as their ID)
 *   - `displayName`      the user's full name
 *   - `profileUrl`       the URL of the profile for the user on Singly
 *   - `emails`           the proxied or contact email address granted by the user
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.getProtectedResource('https://api.singly.com/profile', accessToken, function(err, body, res) {
    if (err) {
      return done(new InternalOAuthError('failed to fetch user profile', err));
    }

    try {
      var json = JSON.parse(body);

      var profile = { provider: 'singly' };

      profile.id = json.id;
      profile.username = json.id;
      profile.displayName = json.name;
      profile.profileUrl = json.url;
      profile.emails = [{ value: json.email }];

      profile._raw = body;
      profile._json = json;

      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
