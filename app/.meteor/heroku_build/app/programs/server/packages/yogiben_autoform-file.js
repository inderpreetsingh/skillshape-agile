(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
// packages/yogiben_autoform-file/packages/yogiben_autoform-file.js          //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////
                                                                             //
(function () {

////////////////////////////////////////////////////////////////////////////
//                                                                        //
// packages/yogiben:autoform-file/lib/server/publish.coffee.js            //
//                                                                        //
////////////////////////////////////////////////////////////////////////////
                                                                          //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('autoformFileDoc', function(collectionName, docId) {
  var collection;
  check(collectionName, String);
  check(docId, String);
  collection = FS._collections[collectionName] || global[collectionName];
  if (collection) {
    return collection.find({
      _id: docId,
      owner: this.userId
    });
  }
});
////////////////////////////////////////////////////////////////////////////

}).call(this);

///////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['yogiben:autoform-file'] = {};

})();

//# sourceMappingURL=yogiben_autoform-file.js.map
