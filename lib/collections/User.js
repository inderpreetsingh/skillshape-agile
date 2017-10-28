Images = new FS.Collection("images", {
  stores: [new FS.Store.GridFS("images", {})]
});
Images.allow({
  insert: function(userId, doc) {
    return true;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return true;
  },
  download: function(userId) {
    return true;
  },
  remove: function (userId, parties) {
    return true;
  }
});

Schema = {};
Schema.UserProfile = new SimpleSchema({
   firstName: {
     optional: true,
       type: String,
   },
   lastName: {
     optional: true,
       type: String
   },
   nickame:{
     optional: true,
     type: String
   },
   url: {
     optional: true,
     type: String
   },
   phone: {
     optional: true,
     type: Number
   },
   pic: {
     optional: true,
     type: String
   },
   dob:{
     optional: true,
     type: String
   },
   address:{
     optional: true,
     type: String
   },
   gender:{
     optional: true,
     type: String
   },
   desc: {
     optional: true,
       type: String
   },
   expertise: {
     optional: true,
     type: String
   },
   state :{
     optional: true,
     type: String
   },
   user_type:{
     optional: true,
     type: String,
     allowedValues: ['C', 'P','S','T']
   },
   company_id:{
     optional: true,
     type: String
   },
   role:{
     optional: true,
     type: String
   },
   access_key :{
     type: String,
     optional: true
   },
   is_demo_user :{
     type: Boolean,
     optional: true
   },
   acess_type:{
     type:String,
     optional: true
   },
   classIds:{
     type:[String],
     optional: true
   },
   schoolId:{
     type:String,
     optional: true
   }
});
Schema.User = new SimpleSchema({
    username: {
        type: String,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    emails: {
        type: Array,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    "emails.$": {
        type: Object
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    // Use this registered_emails field if you are using splendido:meteor-accounts-emails-field / splendido:meteor-accounts-meld
    registered_emails: {
        type: Array,
        optional: true
    },
    'registered_emails.$': {
        type: Object,
        blackbox: true
    },
    createdAt: {
        type: Date,
        optional: true
    },
    profile: {
        type: Schema.UserProfile,
        optional: true
    },
    // Make sure this services field is in your schema if you're using any of the accounts packages
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    // Add `roles` to your schema if you use the meteor-roles package.
    // Option 1: Object type
    // If you specify that type as Object, you must also specify the
    // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
    // Example:
    // Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);
    // You can't mix and match adding with and without a group since
    // you will fail validation in some cases.
    roles: {
        type: Object,
        optional: true,
        blackbox: true
    },
    // Option 2: [String] type
    // If you are sure you will never need to use role groups, then
    // you can specify [String] as the type
    roles: {
        type: Array,
        optional: true
    },
    'roles.$': {
        type: String
    },
    // In order to avoid an 'Exception in setInterval callback' from Meteor
    heartbeat: {
        type: Date,
        optional: true
    }
});
Meteor.users.attachSchema(Schema.User);

Meteor.users.before.insert(function (userId, doc)
{
  doc.createdAt = new Date();
});
if (Meteor.isServer) {

Meteor.methods({
  /**
   * Invoked by AutoForm to update a User record.
   * @param doc The User document.
   * @param docID It's ID.
   */
   editUser: function(doc, docID,role_name) {
     console.log(doc);
     user = Meteor.users.findOne({_id:docID});
     if(role_name){
       if(user && user.roles){
         for(var i = 0 ; i < user.roles.length ;i++){
           console.log(user.roles[i])
           Roles.removeUsersFromRoles(docID, user.roles[i])
         }
       }
       Roles.addUsersToRoles(docID,role_name)
     }
     if(doc){
       console.log("----------");
       console.log(doc);
       console.log("----------");
       Meteor.users.update({_id: docID},{$set:doc});
     }
        // check(doc, Meteor.users.simpleSchema());

    return true;
  },
  addUser: function(doc) {
    console.log(doc);
  //  doc = _.extend({}, doc, {password: Math.random().toString(36).slice(2), login: false,email:doc.email,auto_created:true});
    doc = _.extend({}, doc, {password: "password", login: false,email:doc.email,auto_created:true});
  //  check(doc, Meteor.users.simpleSchema());
    console.log(doc);
   doc.profile['role']='Normal'
   console.log(doc);
   var user_id = Accounts.createUser(doc)
   Accounts.sendVerificationEmail(user_id, doc.email);
  //  Roles.addUsersToRoles(user_id, ['Normal']);
  //  Meteor.users.update({_id: docID}, doc);
},
 deleteUser:function(id){
   Meteor.users.remove(id)
 },
 setAdmin:function(user_id){
   Meteor.users.update({_id: user_id}, {$set:{"profile.role":"Admin"}});
  //  Roles.addUsersToRoles(user_id, ['Admin']);
 },
 setNormal:function(user_id){
   Meteor.users.update({_id: user_id}, {$set:{"profile.role":"Normal"}});
  //  Roles.addUsersToRoles(user_id, ['Normal']);
},
createUserFromAdmin:function(email,password){
  user_id = Accounts.createUser({email:email,password:password})
  Accounts.sendVerificationEmail(user_id, email);
  return user_id;
 },
 checkUserByEmail : function(email){
   console.log(email);
   var user = Meteor.users.findOne({"emails.address": email});
   console.log(user);
   if(user){
     return user;
   }else{
     return false;
   }
 }
});


  Meteor.publish("User", function (user_id) {
    if(user_id == undefined){
      return [];
    }
    company_id_list =[]
    var user = Meteor.users.findOne({_id:user_id});
    var access_key = user.profile.access_key;
    // company_id = user.profile.company_id
    // if( company_id){
    //   company_id_list.push(company_id)
    // }
    // company_list = Company.find({user_id:user_id}).fetch();
    // company_list.map(function(doc){
    //   company_id_list.push(doc._id)
    // });
    return Meteor.users.find({})//.find({$or:[{_id:user_id},{"profile.access_key":access_key}]});
  });
  Meteor.publish("UserShow", function (user_id,id) {
    return Meteor.users.find({_id:user_id});
  });
  Meteor.publish('images', function(admin_id) {
    return Images.find({$or:[{"metadata.admin_id":admin_id},{"metadata.company_id":admin_id}]})
  });
  Meteor.publish(null, function (){
    return Meteor.roles.find({})
  })
}


// users = new Meteor.Pagination(Meteor.users, {
//   itemTemplate: "User",
//   route: "/users/",
//   homeRoute: '/users/',
//   // router: "iron-router",
//   routerTemplate: "ListUser",
//   routerLayout: "Layout",
//   divWrapper: false,
//   sort: {
//     id: 1
//   },
//   templateName: "ListUser",
//   perPage:5,
//   auth: function(skip, sub) {
//     var user_id = sub.userId;
//     if (!user_id) { return []; }
//     company_id_list =[]
//     var user = Meteor.users.findOne({_id:user_id});
//     access_key = user.profile.access_key;
//     var customOwnerFilters = {}
//     // var customOwnerFilters = {"profile.access_key":access_key}
//     //Edit custom settings if required:
//     var customSettings = {};
//    //  customSettings.fields = {address: 1}; //This is the only field that will be shown
//     customSettings.filters = customOwnerFilters
//     //Leave this part untouched:
//     var fields = customSettings.fields || this.fields
//         , sort = customSettings.sort || this.sort //Since I haven't supplied this field, the Pagination sort I've configured above will be used (=2)
//         , perPage = customSettings.perPage || this.perPage //Same as the line above
//         , _filters = _.extend({}, customSettings.filters, this.filters)
//         , _options = { fields: fields, sort: sort, limit: perPage, skip: skip };
//     return [ _filters, _options ];
//   }
// });
