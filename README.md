# Passport-Singly

[Passport](http://passportjs.org/) strategy for authenticating with
[Singly](http://www.singly.com/) using the OAuth 2.0 API.

This module lets you authenticate using Singly in your Node.js applications.
By plugging into Passport, Singly authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Installation

    $ npm install passport-singly

## Usage

#### Configure Strategy

The Singly authentication strategy authenticates users using a Singly
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a app ID, app secret, and callback URL.

    passport.use(new SinglyStrategy({
        clientID: SINGLY_APP_ID,
        clientSecret: SINGLY_APP_SECRET,
        callbackURL: "http://localhost:3000/auth/singly/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ singlyId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'singly'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application (not that the ordering of these two routes is important):

    app.get('/auth/singly/callback', passport.authenticate('singly', {
      failureRedirect: '/login',
      successReturnToOrRedirect: '/'
    }));

    app.get('/auth/singly/:service', passport.authenticate('singly'));

#### Extended Permissions

If you need extended permissions from the user, the permissions can be requested
via the `scope` option to `passport.authenticate()`.

For example, this authorization specifies Facebook as the service and requests
permission to the user's statuses and checkins:

    app.get('/auth/singly', passport.authenticate('singly', {
      service: 'facebook',
      scope: ['user_status', 'user_checkins']
    }));

## Examples

For a complete, working example, refer to the [login example](https://github.com/Singly/passport-singly/tree/master/examples/login).

## Tests

    $ npm install --dev
    $ make test

[![Build Status](https://secure.travis-ci.org/Singly/passport-singly.png)](http://travis-ci.org/Singly/passport-singly)
