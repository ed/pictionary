const auth = require('./auth')
const uuid = require('node-uuid')
const assign = Object.assign
var parse = require('pg-connection-string').parse;

var pg = require('pg');
pg.defaults.ssl = true;
var pool = new pg.Pool(parse(process.env.DATABASE_URL))
pool.connect(function(err, client, done) {
  if (err) {
    console.log(JSON.stringify(err))
    throw err;
  }
  console.log('Connected to postgres! Getting schemas...');
  client
    //.query('INSERT INTO USERS (USERNAME, PASSWORD, SALT) VALUES ($1,$2,$3)', ['eugene','afdsfg','fsdfsd'])
    .query('SELECT * FROM USERS')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
  });

module.exports = {
  cookieMonster(cookies, next) {
    if (cookies === null) {
      const err = new Error('cookie not found');
      return next(err);
    }
    const a = cookies.substring(2);
    auth.tokenHash(a, (token) => {
      pool.query('SELECT * FROM USERS WHERE token = $1', [token], function(err,res) {
        if (err) throw err;
        if (res.rowCount < 1) {
          const error = new Error (`no user found with token ${token}`)
          next(error);
        }
        else {
          const user = res.rows[0];
          next(null , { user });
        }
      });
    });
  },

  login(req, res, username, password, next) {
    pool.query('SELECT * FROM USERS WHERE username = $1', [username], function(err,res) {
      if (err) throw err;
      if (res.rowCount < 1) {
        const error = new Error ('user not found')
        next(error);
      } 
      else {
        const user = res.rows[0];
        auth.verify(password, user.salt, user.password, (err, cb) => {
         if (err) next(err);
         auth.tokenize( (cb) => {
           const token = cb;
           auth.tokenHash(token, (cb) => {
             pool.query('UPDATE USERS SET token = $1 WHERE username = $2', [cb, username], (err) => console.log(err));
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
        const err = new Error('username already taken');
        return next(err);
      }
      let obj = {
       username: username,
       uid: uuid.v4(),
      }
      auth.hash(password, (err, cb) => {
        assign(obj, { password: cb.key, salt: cb.salt});
        auth.tokenize((cb) => {
          const token = cb;
          auth.tokenHash(token, (cb) => {
            pool.query('INSERT INTO USERS (USERNAME, PASSWORD, SALT, TOKEN) VALUES ($1, $2, $3, $4)', [obj.username, obj.password, obj.salt, cb], (err) => console.log(err));
            next(null, {token:token, user:obj});
          });
        });
      });
    });
  }
}
