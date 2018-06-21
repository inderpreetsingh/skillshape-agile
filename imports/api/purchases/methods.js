import Purchases from "./fields";
Meteor.methods({
  addPurchase: function(payload) {
    console.log("in purchase methods");
    Purchases.insert(payload);
  }
});
