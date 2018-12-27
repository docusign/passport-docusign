/* global describe, it, before, expect */
/* jshint expr: true */

var Profile = require('../lib/profile')
  , fs = require('fs');


describe('Profile.parse', function () {

  describe('profile with an Organization Account', function () {
    var profile;

    before(function (done) {
      fs.readFile('test/fixtures/profile.json', 'utf8', function (err, data) {
        if (err) {
          return done(err);
        }
        profile = Profile.parse(data);
        done();
      });
    });

    it('should parse profile', function () {
      expect(profile.sub).to.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

      expect(profile.name).to.be.a('string');
      expect(profile.name).to.equal(profile.given_name + ' ' + profile.family_name);

      expect(profile.name).to.be.a('string');
      expect(profile.email).to.include('@');

      expect(profile.accounts).to.be.an('array');
    });
  });

});
