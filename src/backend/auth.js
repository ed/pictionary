const sodium = require('sodium').api;

module.exports = {
  hash(password, cb) {
    const b = Buffer.from(password);
    cb(sodium.crypto_pwhash_str(b, sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE));
  },

  tokenize(cb) {
    cb(sodium.randombytes_random().toString(16));
  },

  tokenHash(token, cb) {
    const key = Buffer.allocUnsafe(sodium.crypto_hash_sha256_BYTES);
    const b = Buffer.from(token);
    cb(sodium.crypto_hash_sha256(b, key).toString('hex'));
  },

  verify(password, hash, cb) {
    const b = Buffer.from(password);
    cb(null, sodium.crypto_pwhash_str_verify(hash, b));
  },

};
