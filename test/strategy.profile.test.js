/* global describe, it, before, expect */
/* jshint expr: true */

var DocusignStrategy = require('../lib/strategy');


describe('Strategy#userProfile', function () {

  describe('fetched from default endpoint', function () {
    var strategy = new DocusignStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    }, function () {
    });

    strategy._oauth2.get = function (url, accessToken, callback) {
      if (url !== 'https://account-d.docusign.com/oauth/userinfo') {
        return callback(new Error('incorrect url argument'));
      }
      if (accessToken !== 'token') {
        return callback(new Error('incorrect token argument'));
      }

      var body = '{"sub": "50d89ab1-dad5-4a0a-b410-92ee3110b970","accounts":[{"account_id": "fe0b61a3-3b9b-46d4-b7be-4592af32aa9b","is_default": true,"account_name": "World Wide Co", "base_uri": "https:\/\/demo.docusign.net"}],"name": "Susan Smart","given_name": "Susan","family_name": "Smart","email": "susan.smart@example.com"}';
      callback(null, body, undefined);
    };


    var profile;

    before(function (done) {
      strategy.userProfile('token', function (err, p) {
        if (err) {
          return done(err);
        }
        profile = p;
        done();
      });
    });

    it('should parse profile', function () {
      expect(profile.provider).to.equal('docusign');

      expect(profile.sub).to.equal('50d89ab1-dad5-4a0a-b410-92ee3110b970');
      expect(profile.name).to.equal('Susan Smart');
      expect(profile.family_name).to.equal('Smart');
      expect(profile.given_name).to.equal('Susan');
      expect(profile.email).to.equal('susan.smart@example.com');
      expect(profile.accounts).to.have.length(1);
      expect(profile.accounts[0].account_id).to.equal('fe0b61a3-3b9b-46d4-b7be-4592af32aa9b');
      expect(profile.accounts[0].is_default).to.equal(true);
      expect(profile.accounts[0].account_name).to.equal('World Wide Co');
      expect(profile.accounts[0].base_uri).to.equal('https://demo.docusign.net');
      expect(profile.photos).to.be.undefined;
    });

    it('should set raw property', function () {
      expect(profile._raw).to.be.a('string');
    });

    it('should set json property', function () {
      expect(profile._json).to.be.an('object');
    });
  }); // fetched from default endpoint

  describe('error caused by invalid token', function () {
    var strategy = new DocusignStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    }, function () {
    });

    strategy._oauth2.get = function (url, accessToken, callback) {
      var body = '{"error":{"errorCode":"PARTNER_AUTHENTICATION_FAILED","message":"The specified Integrator Key was not found or is disabled. An Integrator key was not specified."}}';
      callback({statusCode: 400, data: body});
    };

    var err, profile;
    before(function (done) {
      strategy.userProfile('token', function (e, p) {
        err = e;
        profile = p;
        done();
      });
    });

    it('should error', function () {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('DocusignAPIError');
      expect(err.message).to.equal('The specified Integrator Key was not found or is disabled. An Integrator key was not specified.');
      expect(err.errorCode).to.equal('PARTNER_AUTHENTICATION_FAILED');
      expect(err.subcode).to.be.undefined;
    });
  }); // error caused by invalid token

  describe('error caused by malformed response', function () {
    var strategy = new DocusignStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    }, function () {
    });

    strategy._oauth2.get = function (url, accessToken, callback) {
      var body = 'Hello, world.';
      callback(null, body, undefined);
    };


    var err, profile;

    before(function (done) {
      strategy.userProfile('token', function (e, p) {
        err = e;
        profile = p;
        done();
      });
    });

    it('should error', function () {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('Failed to parse user profile');
    });
  }); // error caused by malformed response

  describe('internal error', function () {
    var strategy = new DocusignStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    }, function () {
    });

    strategy._oauth2.get = function (url, accessToken, callback) {
      return callback(new Error('something went wrong'));
    };


    var err, profile;

    before(function (done) {
      strategy.userProfile('wrong-token', function (e, p) {
        err = e;
        profile = p;
        done();
      });
    });

    it('should error', function () {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('InternalOAuthError');
      expect(err.message).to.equal('Failed to fetch user profile');
      expect(err.oauthError).to.be.an.instanceOf(Error);
      expect(err.oauthError.message).to.equal('something went wrong');
    });

    it('should not load profile', function () {
      expect(profile).to.be.undefined;
    });
  }); // internal error
});
