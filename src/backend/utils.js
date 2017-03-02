const auth = require('./auth')
const uuid = require('node-uuid')
const assign = Object.assign
var parse = require('pg-connection-string').parse;

var pg = require('pg');
pg.defaults.ssl = true;
var pool = new pg.Pool(parse(process.env.DATABASE_URL));

module.exports = {
  cookieMonster(cookies, next) {
    if (cookies === null || cookies === undefined) {
      const err = new Error('Cookie not found');
      return next(err);
    }
    const a = cookies.substring(2);
    auth.tokenHash(a, (token) => {
      pool.query('SELECT * FROM USERS WHERE token = $1', [token], function(err,res) {
        if (err) throw err;
        if (res.rowCount < 1) {
          const error = new Error (`No user found with token ${token}`)
          next(error);
        }
        else {
          const user = res.rows[0];
          next(null, { user });
	}
      });
    });
  },

  login(req, res, username, password, next) {
    pool.query('SELECT * FROM USERS WHERE username = $1', [username], function(err,res) {
      if (err) throw err;
      if (res.rowCount < 1) {
        const error = new Error ('User not found');
        next(error);
      }
      else {
        const user = res.rows[0];
        auth.verify(password, user.password, (err, verified) => {
          if (err) return next(err);
          if (!verified) return next(new Error('Incorrect password'));
          auth.tokenize( (token) => {
            auth.tokenHash(token, (tokenHash) => {
              pool.query('UPDATE USERS SET token = $1 WHERE username = $2', [tokenHash, username], (err) => console.log(err));
              next(null, token);
            });
          });
        });
      }
    });
  },

  register(req, res, username, password, next) {
    pool.query('SELECT * FROM USERS WHERE username = $1', [username], function(err,res) {
      if (err) throw err;
      if (res.rowCount > 0) {
        const err = new Error('Username already in use');
        return next(err);
      }
      let obj = {
       username: username,
       uid: uuid.v4(),
      }
      auth.hash(password, (err, cb) => {
        assign(obj, { hash: cb });
        auth.tokenize( (token) => {
          auth.tokenHash(token, (tokenHash) => {
            pool.query('INSERT INTO USERS (USERNAME, HASH, TOKEN) VALUES ($1, $2, $3)', [obj.username, obj.hash, tokenHash], (err) => console.log(err));
            next(null, {token:token, user:obj});
          });
        });
      });
    });
  }
}
