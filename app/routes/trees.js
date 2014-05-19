'use strict';

var traceur = require('traceur');
var _ = require('lodash');
var Tree = traceur.require(__dirname + '/../models/tree.js'); //bringing in User Class
var User = traceur.require(__dirname + '/../models/user.js');
var users = global.nss.db.collection('users');

exports.plant = (req, res)=>{
  Tree.findAllByUserId(req.body.userId, forest=>{
    var totalTrees = _.size(forest);

    if(totalTrees <= 55){
      Tree.plant(req.body.userId, tree=>{
        res.render('trees/tree', {tree:tree});
      });
    }
  });
};


exports.forest = (req, res)=>{
  Tree.findAllByUserId(req.query.userId, forest=>{
    res.render('trees/forest', {trees:forest});
  });
};

exports.grow = (req, res)=>{
  Tree.findByTreeId(req.params.treeId, tree=>{
    tree.grow();
    tree.save(()=>{
      res.render('trees/tree', {tree:tree});
    });
  });
};

exports.autoRoot = (req, res)=>{
  Tree.removeDeadOrStump(req.params.userId, ()=>{
    Tree.findAllByUserId(req.params.userId, forest=>{
      res.render('trees/forest', {trees:forest});
    });
  });
};

exports.autoGrow = (req, res)=>{
  Tree.findByTreeId(req.params.treeId, tree=>{
    User.findByUserId(tree.userId, user=>{
      var treeHeight = tree.height / 12;
      if(treeHeight < req.body.chopHeight){
        tree.grow();
        tree.save(()=>{
          res.render('trees/tree', {tree:tree});
        });
      }else if(treeHeight >= req.body.chopHeight){
        tree.chop(user);
        user.save(()=>{
          tree.save(()=>{
            res.render('trees/tree', {tree:tree});
          });
        });
      }
    });
  });
};


exports.chop = (req, res)=>{
  Tree.findByTreeId(req.params.treeId, tree=>{
    users.findOne({_id:tree.userId}, (err, user)=>{

      tree.chop(user);
      users.save(user, ()=>{
        tree.save(()=>{
          res.render('trees/tree', {tree:tree});
        });
      });
    });
  });
};
