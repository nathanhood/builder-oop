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

  grow(){
    this.height += _.random(0,3);
    this.isHealthy = _.random(0, 200) !== 69;
  }

  getClass(){ //instance method. for dynamically adding class to jade file
    var classes = [];
    if(this.height === 0){
      classes.push('seed');
    }else if(this.height < 12){
      classes.push('sapling');
    }else if(this.height < 24){
      classes.push('treenager');
    }else{
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
