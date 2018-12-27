The Official DocuSign Passport package

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]

[Passport](http://passportjs.org/) strategy for authenticating with [DocuSign](http://www.docusign.com/)
using the OAuth 2.0 API.

This module lets you authenticate using DocuSign in your Node.js applications.
By plugging into Passport, DocuSign authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Requirements

Node 0.8 or later.

## Install

    $ npm install passport-docusign

## Usage

#### Register your Application

Before using `passport-docusign`, you must register an application with
DocuSign.  If you have not already done so, a new application can be created at
[DocuSign Developers](https://www.docusign.com/developer-center).

#### Configure Strategy

The DocuSign authentication strategy authenticates users using a DocuSign
account and OAuth 2.0 tokens.  The app ID and secret obtained when creating an
application are supplied as options when creating the strategy.  The strategy
also requires a `verify` callback, which receives the access token and optional
refresh token, as well as `profile` which contains the authenticated user's
DocuSign profile.  The `verify` callback must call `cb` providing a user to
complete authentication.

```js
passport.use(new DocusignStrategy({
    clientID: DOCUSIGN_INTEGRATOR_KEY,
    clientSecret: DOCUSIGN_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/docusign/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ email: profile.email }, function (err, user) {
      return cb(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'docusign'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.get('/auth/docusign',
  passport.authenticate('docusign'));

app.get('/auth/docusign/callback',
  passport.authenticate('docusign', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```

## Examples

See https://github.com/docusign/docusign-code-examples/blob/master/node/NodeSDKSamples.js#L32.

## FAQ

##### How do I use passport-docusign in production?

All you need to do is turn the 'production' flag to true.

```js
app.get('/auth/docusign',
  passport.authenticate('docusign', { production: true }));
```

## Contributing

#### Tests

The test suite is located in the `test/` directory.  All new features are
expected to have corresponding test cases.  Ensure that the complete test suite
passes by executing:

```bash
$ make test
```

#### Coverage

The test suite covers 100% of the code base.  All new feature development is
expected to maintain that level.  Coverage reports can be viewed by executing:

```bash
$ make test-cov
$ make view-cov
```

## License

[The MIT License](http://opensource.org/licenses/MIT)

[npm-image]: https://img.shields.io/npm/v/passport-docusign.svg?style=flat
[npm-url]: https://npmjs.org/package/passport-docusign
[downloads-image]: https://img.shields.io/npm/dm/passport-docusign.svg?style=flat
[downloads-url]: https://npmjs.org/package/passport-docusign
[travis-image]: https://img.shields.io/travis/docusign/passport-docusign.svg?style=flat
[travis-url]: https://travis-ci.org/docusign/passport-docusign
