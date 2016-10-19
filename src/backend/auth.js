const crypto = require('crypto')

module.exports = {
  hash(password, cb) {
    const salt = crypto.randomBytes(32);
    console.log(salt.toString('hex'), password)
    crypto.pbkdf2(password, salt.toString('hex'), 100000, 512, 'sha512', (err, key) => {
      if (err) cb(err);
      cb(null, {key: key.toString('hex'), salt: salt.toString('hex')});
    });
  },

  tokenize(cb) {
    cb(crypto.randomBytes(32).toString('hex'));
  },

  tokenHash(token, cb) {
    cb(crypto.createHash('sha256').update(token).digest('hex'));
  },

  verify(password, salt, hash, cb) {
    crypto.pbkdf2(password, salt, 100000, 512, 'sha512', (err, key) => {
      if (err) cb(err);
      cb(null, key.toString('hex') === hash);
    });
  },
}
