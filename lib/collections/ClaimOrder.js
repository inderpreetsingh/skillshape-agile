/* eslint-disable */
claimOrder  = "ClaimOrder";  // avoid typos, this string occurs many times.
//
ClaimOrder = new Mongo.Collection(claimOrder);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
 ClaimOrder.attachSchema(new SimpleSchema({
   name: {
     type: String,
     optional: true
   },schoolId: {
     type: String,
     optional: true
   },
   createdAt:{
     type: Date,
     optional: true
   },
   remoteIP:{
     type: String,
     optional: true
   }
 }));
if(Meteor.isServer){
  Meteor.startup(function () {
    ClaimOrder._ensureIndex({ "createdAt": 1 }, { expireAfterSeconds: 3600 });
  });
}
claimRequest  = "ClaimRequest";  // avoid typos, this string occurs many times.
//
ClaimRequest = new Mongo.Collection(claimRequest);
ClaimRequest.attachSchema(new SimpleSchema({
  userId: {
    type: String,
    optional: true
  },schoolId: {
    type: String,
    optional: true
  },
  currentUserId: {
    type: String,
    optional: true
  },
  schoolName:{
    type: String,
    optional: true
  },
  Status:{
    type: String,
    optional: true
  }
}));

if(Meteor.isServer){
  Meteor.publish(claimOrder, function (remoteIP) {
    remoteIP = this.connection.clientAddress
    return ClaimOrder.find({remoteIP:remoteIP})
  });
  Meteor.publish(claimRequest, function (userId) {
    return ClaimRequest.find({userId:userId,Status:"new"})
  });
  Meteor.methods({
    addClaimOrder: function(doc) {
      doc.remoteIP = this.connection.clientAddress;
      doc.createdAt = new Date();
      return ClaimOrder.insert(doc);
    },
    removeClaimOrder: function(claimOrders) {
      for(var i= 0 ; i < claimOrders.length; i++){
        ClaimOrder.remove({_id:claimOrders[i]._id});
      }
      return true
    },
    addClaimRequest:function(doc){
      this.unblock();
      cr = ClaimRequest.insert(doc)
      user = Meteor.users.findOne({_id:doc.userId})
      current_user =  Meteor.users.findOne({_id:doc.currentUserId})
      var fromEmail = "admin@techmeetups.com";
      if(current_user){
        var toEmail = current_user.emails[0].address;
        Email.send({
            from: fromEmail,
            to: toEmail,
            replyTo: fromEmail ,
            subject: "Your School claim by other user",
            text: "Hi ,\nWe get claim request from  another user about your school"+
            "\nhe claim  : "+Meteor.absoluteUrl()+"schoolAdmin/"+doc.schoolId+"\n"+
            "\nAdmin will contact you for further clarifications.\n"+
            "Thank you.\n"+
            "The skillshape Team.\n"+Meteor.absoluteUrl()+"\n"
            // + "http://www.graphical.io/assets/img/Graphical-IO.png"
        });
      }
      var toEmail = user.emails[0].address;
      Email.send({
          from: fromEmail,
          to: fromEmail,
          replyTo: fromEmail ,
          subject: "skillshape claim request",
          text: "Hi ,\nWe get claim request from : ("+toEmail+")"+
          "\nhe claim  : "+Meteor.absoluteUrl()+"schoolAdmin/"+doc.schoolId+"\n"+
          "Thank you.\n"+
          "The skillshape Team.\n"+Meteor.absoluteUrl()+"\n"
          // + "http://www.graphical.io/assets/img/Graphical-IO.png"
      });
      Email.send({
          from: fromEmail,
          to: toEmail,
          replyTo: fromEmail ,
          subject: "Thanks for claim request",
          text: "Hi ,"+toEmail+
          "\nYour claim Schools is  : "+Meteor.absoluteUrl()+"schoolAdmin/"+doc.schoolId+"\n"+
          "We will getback to you soon.\n"+
          "Thank you.\n"+
          "The skillshape Team.\n"+Meteor.absoluteUrl()+"\n"
          // + "http://www.graphical.io/assets/img/Graphical-IO.png"
      });
      return true;
    }
  });
}
