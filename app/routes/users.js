'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js'); //bringing in User Class

exports.login = (req, res)=>{
  User.login(req.body.username, user=>{ //class method to find or create user
    res.render('users/dashboard', {user:user});
  });
};

exports.dashboard = (req, res)=>{
  var userId = req.params.userId;
  User.findByUserId(userId, (user)=>{
    res.render('users/dashboard', {user:user});
  });
};

exports.sell = (req, res)=>{
  var userId = req.params.userId;
  var woodQty = req.body.woodQty;

  User.findByUserId(userId, (user)=>{
    user.sell(woodQty);
    user.save(()=>{
      res.render('users/dashboard', {user:user});
    });
  });
};
