'use strict';


class Item{
  constructor(type){
    this.type = type;

    switch(type){
    case 'autogrow':
      this.cost = 50000;
      this.image = '/img/autogrow.gif';
      break;
    }
  }

  // static findItemsById(itemIds, fn){
  //   // var itemsArray = [];
  //
  //   itemIds.forEach(itemId=>{
  //     itemId = Mongo.ObjectID(itemId);
  //
  //     items.findOne({_id:itemId}, (err, obj)=>{
  //       var item = _.create(Item.prototype, obj);
  //       // itemsArray.push(item);
  //       // console.log(itemsArray);
  //       fn(item);
  //     });
  //   });
  //
  // }


}

module.exports = Item; //exporting Class out
