class BaseTags extends Mongo.Collection{
  insert(doc,cb){
  doc.createdAt=new Date();
   return super.insert(doc,cb);
  }
}


tags=new BaseTags("Tags");

  tags.allow({
    insert: function () {
        return true;
    },
    update: function () {
        return true;
    },
    remove: function () {
        return true;
    }
});


tags.attachSchema(new SimpleSchema({
   user_id: {
     type: String,
     optional: true
   },
    tag: {
     type: String,
     optional: true
   },
    createdBy: {
     type: String,
     optional: true
   },
    createdAt:{
         type: Date,
       optional: true
    },
    class: {
     type: String,
     optional: true
   },
    updaeddAt: {
     type: String,
     optional: true
   },
    updatedBy: {
     type: String,
     optional: true
   },
    _mig_: {
     type: Number,
     optional: true
   }
 }));

 
if(Meteor.isServer){

    Meteor.publish("tags",function(){
        return tags.find();
    })
}