'use strict';

var mongoose = require('mongoose');
var moment = require('moment');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;

if(!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET');
}

var userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: true },
  biography: { type: String, required: true },
  etc: { type: String, required: true }
});

// IT'S MIDDLEWARE!!
userSchema.statics.isLoggedIn = function(req, res, next) {
  var token = req.cookies.accessToken;

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if(err) return res.status(401).send({error: 'Must be authenticated.'});

    User
      .findById(payload._id)
      .select({password: false})
      .exec((err, user) => {
        if(err || !user) {
          return res.clearCookie('accessToken').status(400).send(err || {error: 'User not found.'});
        }

        req.user = user;
        next();
      })
  });
};

userSchema.statics.register = function(userObj, cb) {

  User.findOne({username: userObj.username}, (err, dbUser) => {
    if(err || dbUser) return cb(err || { error: 'Username not available.' })

    bcrypt.hash(userObj.password, 12, (err, hash) => {
      if(err) return cb(err);

      var user = new User({
        username: userObj.username,
        password: hash,
        image: userObj.image,
        biography: userObj.biography,
        etc: userObj.etc
      });
      user.save(cb);
    });
  });
  // this.create(userObj, cb);
};

userSchema.statics.authenticate = function(userObj, cb) {

  // if user is found, and password is good, create a token
  this.findOne({username: userObj.username}, (err, dbUser) => {
    if(err || !dbUser) return cb(err || { error: 'Login failed. Username or password incorrect.' });

    bcrypt.compare(userObj.password, dbUser.password, (err, isGood) => {
     if(err || !isGood) return cb(err || { error: 'Login failed. Username or password incorrect.' });
     var token = dbUser.makeToken();
     cb(null, token);
   });
  });
};

userSchema.methods.makeToken = function() {
  var token = jwt.sign({
    _id: this._id,
    exp: moment().add(1, 'day').unix(), // in seconds
    username: this.username }, JWT_SECRET);
  return token;
};

var User = mongoose.model('User', userSchema);

module.exports = User;
