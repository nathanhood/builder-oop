'use strict';

var users = global.nss.db.collection('users');
var Mongo = require('mongodb');
var _ = require('lodash');

class User{
  constructor(username){
    this.username = username;
    this.wood = 0;
    this.cash = 0;
  }

  sell(woodQty){
    if(this.wood > 0){
      this.wood -= woodQty;
      this.cash += Math.floor(woodQty / 5 * 100) / 100;
    }
  }

  save(fn){
    users.save(this, ()=>fn());
  }

  static findByUserId(userId, fn){
    userId = Mongo.ObjectID(userId);
    users.findOne({_id:userId}, (err, obj)=>{
      var user = _.create(User.prototype, obj);
      fn(user);
    });
  }

  static login(username, fn){ //class method. username and fn fed from users.js
    username = username.trim().toLowerCase();
    users.findOne({username:username}, (err, user)=>{
      if(user){
        fn(user);
      }else{
        user = new User(username);
        users.save(user, (err, u)=>{
          fn(user);
        });
      }
    });
  }
}

module.exports = User; //exporting Class out
