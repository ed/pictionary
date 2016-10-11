const auth = require('./auth')
const uuid = require("node-uuid")
const assign = Object.assign

module.exports = {
  cookieMonster(cookies, users, next) {
    const a = cookies.substring(2);
    auth.tokenHash(a, (cb) => {
      const user = users.find(u => u.token === cb);
      next(null , { user, match: user.token === cb });
    });
  },

  login(req, res, username, password, users, next) {
    const user = users.find(u => u.username === username);
    if (!user) {
      const error = new Error ('user not found')
      next(error);
    } else {
      auth.verify(password, user.salt, user.password, (err, cb) => {
       if (err) next(err);
       auth.tokenize( (cb) => {
         const token = cb;
         auth.tokenHash(token, (cb) => {
           assign(user, { token: cb });
           next(null, token);
         });
       });
     });
    }
  },

  register(req, res, users, id, username, password, next) {
    const user = users.find(u => u.username === username);
    if (user) {
      const error = new Error ('username already exists ')
      next(error)
    } else {
      let obj = {
       username: username,
       id: id,
       uid: uuid.v4(),
     }
     auth.hash(password, (err, cb) => {
       assign(obj, { password: cb.key, salt: cb.salt});
       auth.tokenize((cb) => {
         const token = cb;
         auth.tokenHash(token, (cb) => {
           assign(obj, { token: cb });
           next(null, {token:token, user:obj});
         });
       });
     });
   }
 }
}
