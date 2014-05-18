'use strict';

var trees = global.nss.db.collection('trees');
var Mongo = require('mongodb');
var _ = require('lodash');

class Tree{
  constructor(userId){
    this.userId = userId;
    this.height = 0;
    this.isHealthy = true;
    this.isChopped = false;
  }

  save(fn){
    trees.save(this, ()=>fn());
  }


  chop(user){
    var wood = this.height / 2;
    user.wood += wood;

    this.isHealthy = false;
    this.isChopped = true;
    this.height = 0;
  }


  grow(){
    if(!this.isAdult){
      this.height += _.random(0,2);
    }else if(this.isAdult){
      var max = this.height * 0.10;
      this.height += _.random(0,max);
    }

    var min = this.isAdult ? 200 - ((this.height/12)*0.10) : 200;
    min = min < 10 ? 10 : min;

    var rnd = _.random(0, min, true);
    this.isHealthy = rnd > 1;
  }



  get isGrowable(){
    return this.isHealthy && !this.isBeanStalk;
  }

  get isBeanStalk(){
    return (this.height / 12) >= 10000;
  }

  get isAdult(){
    return this.height >= 48;
  }

  get isChoppable(){
    return this.isAdult && this.isHealthy && !this.isBeanStalk;
  }

  get classes(){ //instance method. for dynamically adding class to jade file
    var classes = [];
    if(this.height === 0){
      classes.push('seed');
    }else if(this.height < 24){
      classes.push('sapling');
    }else if(!this.isAdult){
      classes.push('treenager');
    }else if(this.isAdult){
      classes.push('adult');
    }

    if(this.isChopped){
      _(classes).pull('seed');
      classes.push('chopped');
    }

    if(!this.isHealthy){
      classes.push('dead');
    }else{
      classes.push('alive');
    }

    if(this.isBeanStalk){
      classes.push('beanstalk');
    }

    return classes.join(' ');
  }


  static findByTreeId(treeId, fn){
    treeId = Mongo.ObjectID(treeId);
    trees.findOne({_id:treeId}, (err, obj)=>{
      var tree = _.create(Tree.prototype, obj);
      fn(tree);
    });
  }

  static findAllByUserId(userId, fn){ //class method
    userId = Mongo.ObjectID(userId);
    trees.find({userId:userId}).toArray((err, objs)=>{
      var forest = objs.map(o=>_.create(Tree.prototype, o));//this turns these objects into Tree objects
      fn(forest);
    });
  }

  static plant(userId, fn){ //class method
    userId = Mongo.ObjectID(userId);
    var tree = new Tree(userId);
    trees.save(tree, ()=>{
      fn(tree);
    });
  }
}

module.exports = Tree; //exporting Class out
