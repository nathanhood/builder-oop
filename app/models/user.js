'use strict';

var users = global.nss.db.collection('users');
var Mongo = require('mongodb');
var _ = require('lodash');

class User{
  constructor(username){
    this.username = username;
    this.wood = 0;
    this.cash = 0;
    this.items = [];
  }

  sell(woodQty){
    if(woodQty <= this.wood){
      this.wood -= woodQty;
      this.cash += Math.floor(woodQty / 5 * 100) / 100;
    }
  }

  save(fn){
    users.save(this, ()=>fn());
  }

  purchase(item){
    if(item.cost <= this.cash){
      this.cash -= item.cost;
      this.items.push(item);
    }
  }


  get isAutoGrowAvailable(){
    var isPresent = _(this.items).any({'type': 'autogrow'});
    return this.cash >= 50000 && !isPresent;
  }

  get isAutoSeedAvailable(){
    var isPresent = _(this.items).any({'type': 'autoseed'});
    return this.cash >= 75000 && !isPresent;
  }

  get isAutoRootAvailable(){
    var isPresent = _(this.items).any({'type': 'autoroot'});
    return this.cash >= 75000 && !isPresent;
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
        user = _.create(User.prototype, user);
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
