// CompanyImages = new FS.Collection("company_images", {
//   stores: [new FS.Store.GridFS("company_images", {})]
// });
// CompanyImages.allow({
//   insert: function(userId, doc) {
//     return true;
//   },
//   update: function(userId, doc, fieldNames, modifier) {
//     return true;
//   },
//   download: function(userId) {
//     return true;
//   },
//   remove: function (userId, parties) {
//     return true;
//   }
// });
// //

// company  = "Company";  // avoid typos, this string occurs many times.
// //
// Company = new Mongo.Collection(company);
// Company.before.insert(function (userId, doc)
// {
//   doc.created_at = new Date();
//   if (doc.user_id == '' || doc.user_id == undefined){
//     doc.user_id = Meteor.userId() ;
//   }
// });
// if (Meteor.isServer) {
// Meteor.methods({
//   /**
//    * Invoked by AutoForm to add a new Company record.
//    * @param doc The Company document.
//    */
//    setCompanyAsBase:function(company_id){
//      console.log(company_id);
//      access_key = Meteor.user().profile.access_key;
//      companys = Company.find({access_key:access_key}).fetch();
//      for(var c =0; c < companys.length;c++ ){
//        company = companys[c]
//        console.log(Company.update({_id:company._id,user_id:Meteor.userId()},{$set:{base_company:false}}));
//      }
//      Company.update({access_key:access_key,_id:company_id}, {$set:{base_company:true}});
//    },
//   addCompany: function(doc) {
//     check(doc, Company.simpleSchema());
//     url = Meteor.absoluteUrl("api/company?user_id="+Meteor.userId());
//     var result = HTTP.post(url,{data:doc})
//     return result;
//     // Company.insert(doc);
//   },
//   /**
//    *
//    * Invoked by AutoForm to update a Company record.
//    * @param doc The Company document.
//    * @param docID It's ID.
//    */
//   editCompany: function(doc, docID) {
//     check(doc, Company.simpleSchema());
//     url = Meteor.absoluteUrl("api/company?user_id="+Meteor.userId()+"&company_id="+docID);
//     var result = HTTP.put(url,{data:doc})
//     return result;
//   //  Company.update({_id: docID}, doc);
//   },
//   deleteComapny:function(id){
//     Company.remove({_id:id});
//     return true;
//   }
// });
// //
// // Publish the entire Collection.  Subscription performed in the router.

//   Meteor.publish(company, function (user_id) {
//     if(user_id == undefined){
//       return[];
//     }
//     var user = Meteor.users.findOne({_id:user_id});
//     company_id = user.profile.company_id
//     access_key = user.profile.access_key
//     return Company.find({$or:[{user_id:user_id},{_id:company_id},{access_key:access_key}]});
//   });
//   Meteor.publish("CompanyShow", function (user_id,id) {
//     return Company.find({user_id:user_id,_id:id});
//   });
//   Meteor.publish('CompanyImages', function(user_id) {
//     if(user_id == undefined){
//       return[];
//     }
//     var user = Meteor.users.findOne({_id:user_id});
//     company_id = user.profile.company_id
//     company = Company.find({$or:[{user_id:user_id},{_id:company_id}]}).fetch()[0];
//     if(company){
//       return CompanyImages.find({$or:[{"metadata.admin_id":user_id},{"metadata.company_id":company_id}]});
//     }else{
//       return [];
//     }
//   });
// }
// /**
//  * Create the schema for Company
//  * See: https://github.com/aldeed/meteor-autoform#common-questions
//  * See: https://github.com/aldeed/meteor-autoform#affieldinput
//  */
//  Company.attachSchema(new SimpleSchema({
//   name: {
//     label: "Name",
//     type: String,
//     optional: false,
//     autoform: {
//       placeholder: "Enter Company Name"
//     }
//   },
//   url: {
//     label: "URL",
//     type: String,
//     optional: false,
//     autoform: {
//       placeholder: "URL of your website (http://...)"
//     }
//   },
//   zip_post_code: {
//     label: "Post/Zip Code",
//     optional: true,
//     type: String,
//     autoform: {
//       placeholder: "Post/Zip Code"
//     }
//   },
//   address: {
//     label: "Address",
//     type: String,
//     optional: true,
//     autoform: {
//       placeholder: "Enter your Business Address"
//     }
//   },
//   created_at : {
//    type: Date,
//    optional: true,
//    autoform: {
//      placeholder: ""
//    }
//   },
//   location:{
//    type: String,
//    optional: true,
//    autoform: {
//      placeholder: "Enter Location"
//    }
//  },
//  industry:{
//   type: String,
//   optional: true,
//   autoform: {
//     placeholder: "Choose an Industry"
//   }
// },
// expertise:{
//  type: String,
//  optional: true,
//  autoform: {
//    placeholder: "Choose an Expertise"
//  }
// },
// logo:{
//  type: String,
//  optional: true,
//  autoform:{
//    afFieldInput:{
//        type: 'fileUpload',
//        collection: 'CompanyImages'
//      },
//      placeholder: "Enter URL of your Logo"
//   }
// },
// description:{
//  type: String,
//  optional: true,
//  autoform: {
//    placeholder: "Enter some Description"
//  }
// },
// radius:{
//  type: Number,
//  optional: true,
//  autoform: {
//    placeholder: "Business Radius in miles"
//  }
// },
// user_id:{
//  type: String,
//  optional: true,
//  autoform: {
//    placeholder: "user_id"
//  }
// },
// base_company :{
//   type: Boolean,
//   optional: true
// },
// access_key :{
//   type: String,
//   optional: true
// }
// }));

// // company = new Meteor.Pagination(Company, {
// //   itemTemplate: "Company",
// //   route: "/company/list/",
// //   homeRoute: '/company/list/',
// //   // router: false,
// //   routerTemplate: "ListCompany",
// //   routerLayout: "Layout",
// //   divWrapper: false,
// //   sort: {
// //     id: 1
// //   },
// //   templateName: "ListCompany",
// //   perPage:5,
// //   auth: function(skip, sub) {
// //     var currrentUser = sub.userId;
// //      if (!currrentUser) { return []; }
// //     if(currrentUser){
// //       var user = Meteor.users.findOne({_id:currrentUser});
// //       company_id = user.profile.company_id;
// //       access_key = user.profile.access_key;
// //       //Custom queries:
// //        var customOwnerFilters = {$or:[{user_id:currrentUser},{_id:company_id},{access_key:access_key}]}
// //        //Edit custom settings if required:
// //        var customSettings = {};
// //       //  customSettings.fields = {address: 1}; //This is the only field that will be shown
// //        customSettings.filters = customOwnerFilters
// //
// //        //Leave this part untouched:
// //        var fields = customSettings.fields || this.fields
// //            , sort = customSettings.sort || this.sort //Since I haven't supplied this field, the Pagination sort I've configured above will be used (=2)
// //            , perPage = customSettings.perPage || this.perPage //Same as the line above
// //            , _filters = _.extend({}, customSettings.filters, this.filters)
// //            , _options = { fields: fields, sort: sort, limit: perPage, skip: skip };
// //        return [ _filters, _options ];
// //     }
// //   }
// // });
