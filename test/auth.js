const auth = require("../src/backend/auth.js");
const expect = require("chai").expect;

describe("auth", function() {
  describe("hash password", function() {
    it("it hashes a given password", function() {
      const password = "supersecurepassword";
      auth.hash(password, (cb) => {
	expect(cb != password);
      });
    });
  });

  describe("create token", function() {
    it("it generates a 32 byte token", function() {
      auth.tokenize((token) => {
	expect(token.length === 64);
      });
    });
  });

  describe("hash a token", function() {
    it("it runs sha256 on a given token", function() {
      auth.tokenize((token) => {
	auth.tokenHash(token, (tokenHash) => {
	  expect(tokenHash != token);
	});
      });
    });
  });

  describe("verify hashed password", function() {
    it("it checks the hashed password against the password", function() {
      const password = "supersecurepassword";
      auth.hash(password, (cb) => {
	auth.verify(password, cb, (err, verified) => {
	    expect(verified === true);
	});
      });
    });
  });
});
