(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Accounts = Package['accounts-base'].Accounts;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/houston_admin/lib/collections.coffee.js                                                            //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var root;                                                                                                      // 1
                                                                                                               //
root = typeof exports !== "undefined" && exports !== null ? exports : this;                                    // 1
                                                                                                               //
if (root.Houston == null) {                                                                                    //
  root.Houston = {};                                                                                           //
}                                                                                                              //
                                                                                                               //
if (Houston._collections == null) {                                                                            //
  Houston._collections = {};                                                                                   //
}                                                                                                              //
                                                                                                               //
Houston._collections.collections = new Meteor.Collection('houston_collections');                               // 1
                                                                                                               //
Houston._admins = new Meteor.Collection('houston_admins');                                                     // 1
                                                                                                               //
Houston._user_is_admin = function(id) {                                                                        // 1
  return (id != null) && Houston._admins.findOne({                                                             // 12
    user_id: id                                                                                                // 12
  });                                                                                                          //
};                                                                                                             // 11
                                                                                                               //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/houston_admin/lib/shared.coffee.js                                                                 //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var root;                                                                                                      // 1
                                                                                                               //
root = typeof exports !== "undefined" && exports !== null ? exports : this;                                    // 1
                                                                                                               //
if (root.Houston == null) {                                                                                    //
  root.Houston = {};                                                                                           //
}                                                                                                              //
                                                                                                               //
Houston._houstonize = function(name) {                                                                         // 1
  return "_houston_" + name;                                                                                   //
};                                                                                                             // 5
                                                                                                               //
Houston._custom_method_name = function(collection_name, method_name) {                                         // 1
  return Houston._houstonize(collection_name + "/" + method_name);                                             //
};                                                                                                             // 7
                                                                                                               //
Houston._MAX_DOCS_TO_EXPLORE = 100;                                                                            // 1
                                                                                                               //
Houston._get_fields_from_collection = function(collection) {                                                   // 1
  return Houston._get_fields(collection.find().fetch());                                                       //
};                                                                                                             // 13
                                                                                                               //
Houston._get_fields = function(documents, options) {                                                           // 1
  var document, find_fields, i, key, key_to_type, len, ref, results, value;                                    // 18
  if (options == null) {                                                                                       //
    options = {};                                                                                              //
  }                                                                                                            //
  key_to_type = options.exclude_id != null ? {} : {                                                            // 18
    _id: 'ObjectId'                                                                                            // 18
  };                                                                                                           //
  find_fields = function(document, prefix) {                                                                   // 18
    var full_path_key, key, ref, results, value;                                                               // 21
    if (prefix == null) {                                                                                      //
      prefix = '';                                                                                             //
    }                                                                                                          //
    ref = _.omit(document, '_id');                                                                             // 21
    results = [];                                                                                              // 21
    for (key in ref) {                                                                                         //
      value = ref[key];                                                                                        //
      if (typeof value === 'object') {                                                                         // 22
        if (value instanceof Date) {                                                                           // 25
          full_path_key = "" + prefix + key;                                                                   // 26
          results.push(key_to_type[full_path_key] = "Date");                                                   // 26
        } else {                                                                                               //
          results.push(find_fields(value, "" + prefix + key + "."));                                           //
        }                                                                                                      //
      } else if (typeof value !== 'function') {                                                                //
        full_path_key = "" + prefix + key;                                                                     // 33
        results.push(key_to_type[full_path_key] = typeof value);                                               // 33
      } else {                                                                                                 //
        results.push(void 0);                                                                                  //
      }                                                                                                        //
    }                                                                                                          // 21
    return results;                                                                                            //
  };                                                                                                           //
  ref = documents.slice(0, +Houston._MAX_DOCS_TO_EXPLORE + 1 || 9e9);                                          // 36
  for (i = 0, len = ref.length; i < len; i++) {                                                                // 36
    document = ref[i];                                                                                         //
    find_fields(document);                                                                                     // 37
  }                                                                                                            // 36
  results = [];                                                                                                // 39
  for (key in key_to_type) {                                                                                   //
    value = key_to_type[key];                                                                                  //
    results.push({                                                                                             // 39
      name: key,                                                                                               // 39
      type: value                                                                                              // 39
    });                                                                                                        //
  }                                                                                                            // 39
  return results;                                                                                              //
};                                                                                                             // 17
                                                                                                               //
Houston._get_field_names = function(documents) {                                                               // 1
  return _.pluck(Houston._get_fields(documents), 'name');                                                      //
};                                                                                                             // 41
                                                                                                               //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/houston_admin/lib/menu.coffee.js                                                                   //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var root;                                                                                                      // 1
                                                                                                               //
root = typeof exports !== "undefined" && exports !== null ? exports : this;                                    // 1
                                                                                                               //
if (root.Houston == null) {                                                                                    //
  root.Houston = {};                                                                                           //
}                                                                                                              //
                                                                                                               //
Houston.menu = function() {                                                                                    // 1
  var i, item, len;                                                                                            // 6
  for (i = 0, len = arguments.length; i < len; i++) {                                                          // 6
    item = arguments[i];                                                                                       //
    this.menu._add_menu_item(item);                                                                            // 6
  }                                                                                                            // 6
};                                                                                                             // 5
                                                                                                               //
Houston.menu.dependency = new Deps.Dependency;                                                                 // 1
                                                                                                               //
Houston.menu._menu_items = [];                                                                                 // 1
                                                                                                               //
Houston.menu._process_item = function(item) {                                                                  // 1
  if (item.type !== 'link' && item.type !== 'template') {                                                      // 14
    throw new Meteor.Error(400, 'Can\'t recognize type: ' + item);                                             // 15
  }                                                                                                            //
  if (item.type === 'link') {                                                                                  // 17
    item.path = item.use;                                                                                      // 18
  } else if (item.type === 'template') {                                                                       //
    item.path = Houston._ROOT_ROUTE + "/actions/" + item.use;                                                  // 20
  }                                                                                                            //
  return item;                                                                                                 // 22
};                                                                                                             // 13
                                                                                                               //
Houston.menu._get_menu_items = function() {                                                                    // 1
  var i, item, len, ref, results;                                                                              // 25
  this.dependency.depend();                                                                                    // 25
  ref = this._menu_items;                                                                                      // 26
  results = [];                                                                                                // 26
  for (i = 0, len = ref.length; i < len; i++) {                                                                //
    item = ref[i];                                                                                             //
    results.push(this._process_item(item));                                                                    // 26
  }                                                                                                            // 26
  return results;                                                                                              //
};                                                                                                             // 24
                                                                                                               //
Houston.menu._add_menu_item = function(item) {                                                                 // 1
  this._menu_items.push(item);                                                                                 // 29
  return this.dependency.changed();                                                                            //
};                                                                                                             // 28
                                                                                                               //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/houston_admin/server/publications.coffee.js                                                        //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var ADDED_COLLECTIONS, root, sync_collections;                                                                 // 1
                                                                                                               //
root = typeof exports !== "undefined" && exports !== null ? exports : this;                                    // 1
                                                                                                               //
Houston._HIDDEN_COLLECTIONS = {                                                                                // 1
  'users': Meteor.users,                                                                                       // 2
  'meteor_accounts_loginServiceConfiguration': void 0                                                          // 2
};                                                                                                             //
                                                                                                               //
ADDED_COLLECTIONS = {};                                                                                        // 1
                                                                                                               //
Houston._publish = function(name, func) {                                                                      // 1
  return Meteor.publish(Houston._houstonize(name), func);                                                      //
};                                                                                                             // 6
                                                                                                               //
Houston._setup_collection = function(collection) {                                                             // 1
  var c, count, fields, name;                                                                                  // 10
  name = collection._name;                                                                                     // 10
  if (name in ADDED_COLLECTIONS) {                                                                             // 11
    return;                                                                                                    // 11
  }                                                                                                            //
  Houston._setup_collection_methods(collection);                                                               // 10
  Houston._publish(name, function(sort, filter, limit, unknown_arg) {                                          // 10
    var e;                                                                                                     // 16
    check(sort, Match.Optional(Object));                                                                       // 16
    check(filter, Match.Optional(Object));                                                                     // 16
    check(limit, Match.Optional(Number));                                                                      // 16
    check(unknown_arg, Match.Any);                                                                             // 16
    if (!Houston._user_is_admin(this.userId)) {                                                                // 20
      this.ready();                                                                                            // 21
      return;                                                                                                  // 22
    }                                                                                                          //
    try {                                                                                                      // 23
      return collection.find(filter, {                                                                         //
        sort: sort,                                                                                            // 24
        limit: limit                                                                                           // 24
      });                                                                                                      //
    } catch (_error) {                                                                                         //
      e = _error;                                                                                              // 26
      return console.log(e);                                                                                   //
    }                                                                                                          //
  });                                                                                                          //
  collection.find().observe({                                                                                  // 10
    _suppress_initial: true,                                                                                   // 29
    added: function(document) {                                                                                // 29
      return Houston._collections.collections.update({                                                         //
        name: name                                                                                             // 31
      }, {                                                                                                     //
        $inc: {                                                                                                // 32
          count: 1                                                                                             // 32
        },                                                                                                     //
        $addToSet: {                                                                                           // 32
          fields: {                                                                                            // 33
            $each: Houston._get_fields([document])                                                             // 33
          }                                                                                                    //
        }                                                                                                      //
      });                                                                                                      //
    },                                                                                                         //
    changed: function(document) {                                                                              // 29
      return Houston._collections.collections.update({                                                         //
        name: name                                                                                             // 35
      }, {                                                                                                     //
        $addToSet: {                                                                                           // 36
          fields: {                                                                                            // 36
            $each: Houston._get_fields([document])                                                             // 36
          }                                                                                                    //
        }                                                                                                      //
      });                                                                                                      //
    },                                                                                                         //
    removed: function(document) {                                                                              // 29
      return Houston._collections.collections.update({                                                         //
        name: name                                                                                             // 38
      }, {                                                                                                     //
        $inc: {                                                                                                // 38
          count: -1                                                                                            // 38
        }                                                                                                      //
      });                                                                                                      //
    }                                                                                                          //
  });                                                                                                          //
  fields = Houston._get_fields_from_collection(collection);                                                    // 10
  c = Houston._collections.collections.findOne({                                                               // 10
    name: name                                                                                                 // 41
  });                                                                                                          //
  count = collection.find().count();                                                                           // 10
  if (c) {                                                                                                     // 43
    Houston._collections.collections.update(c._id, {                                                           // 44
      $set: {                                                                                                  // 44
        count: count,                                                                                          // 44
        fields: fields                                                                                         // 44
      }                                                                                                        //
    });                                                                                                        //
  } else {                                                                                                     //
    Houston._collections.collections.insert({                                                                  // 46
      name: name,                                                                                              // 46
      count: count,                                                                                            // 46
      fields: fields                                                                                           // 46
    });                                                                                                        //
  }                                                                                                            //
  return ADDED_COLLECTIONS[name] = collection;                                                                 //
};                                                                                                             // 9
                                                                                                               //
sync_collections = function() {                                                                                // 1
  var _sync_collections, bound_sync_collections, collection, collections, i, len, mongo_driver, ref, ref1;     // 50
  Houston._admins.findOne();                                                                                   // 50
  collections = {};                                                                                            // 50
  ref1 = (ref = Mongo.Collection.getAll()) != null ? ref : [];                                                 // 53
  for (i = 0, len = ref1.length; i < len; i++) {                                                               // 53
    collection = ref1[i];                                                                                      //
    collections[collection.name] = collection.instance;                                                        // 54
  }                                                                                                            // 53
  _sync_collections = function(meh, collections_db) {                                                          // 50
    var col, collection_names;                                                                                 // 57
    collection_names = (function() {                                                                           // 57
      var j, len1, results;                                                                                    //
      results = [];                                                                                            // 57
      for (j = 0, len1 = collections_db.length; j < len1; j++) {                                               //
        col = collections_db[j];                                                                               //
        if ((col.collectionName.indexOf("system.")) !== 0 && (col.collectionName.indexOf("houston_")) !== 0) {
          results.push(col.collectionName);                                                                    // 57
        }                                                                                                      //
      }                                                                                                        // 57
      return results;                                                                                          //
    })();                                                                                                      //
    return collection_names.forEach(function(name) {                                                           //
      if (!(name in ADDED_COLLECTIONS || name in Houston._HIDDEN_COLLECTIONS)) {                               // 62
        if (collections[name] != null) {                                                                       // 63
          return Houston._setup_collection(collections[name]);                                                 //
        }                                                                                                      //
      }                                                                                                        //
    });                                                                                                        //
  };                                                                                                           //
  bound_sync_collections = Meteor.bindEnvironment(_sync_collections, function(e) {                             // 50
    return console.log("Failed while syncing collections for reason: " + e);                                   //
  });                                                                                                          //
  mongo_driver = (typeof MongoInternals !== "undefined" && MongoInternals !== null ? MongoInternals.defaultRemoteCollectionDriver() : void 0) || Meteor._RemoteCollectionDriver;
  return mongo_driver.mongo.db.collections(bound_sync_collections);                                            //
};                                                                                                             // 49
                                                                                                               //
Meteor.methods({                                                                                               // 1
  _houston_make_admin: function(user_id) {                                                                     // 73
    check(user_id, String);                                                                                    // 74
    if (Houston._admins.findOne({                                                                              // 76
      'user_id': {                                                                                             // 76
        $exists: true                                                                                          // 76
      }                                                                                                        //
    })) {                                                                                                      //
      return;                                                                                                  // 76
    }                                                                                                          //
    Houston._admins.insert({                                                                                   // 74
      user_id: user_id                                                                                         // 77
    });                                                                                                        //
    Houston._admins.insert({                                                                                   // 74
      exists: true                                                                                             // 78
    });                                                                                                        //
    sync_collections();                                                                                        // 74
    return true;                                                                                               // 80
  }                                                                                                            //
});                                                                                                            //
                                                                                                               //
Houston._publish('collections', function() {                                                                   // 1
  if (!Houston._user_is_admin(this.userId)) {                                                                  // 84
    this.ready();                                                                                              // 85
    return;                                                                                                    // 86
  }                                                                                                            //
  return Houston._collections.collections.find();                                                              //
});                                                                                                            // 83
                                                                                                               //
Houston._publish('admin_user', function() {                                                                    // 1
  if (!Houston._user_is_admin(this.userId)) {                                                                  // 91
    return Houston._admins.find({                                                                              // 92
      exists: true                                                                                             // 92
    });                                                                                                        //
  }                                                                                                            //
  return Houston._admins.find({});                                                                             // 93
});                                                                                                            // 90
                                                                                                               //
Meteor.startup(function() {                                                                                    // 1
  sync_collections();                                                                                          // 96
  if (Houston._admins.find().count() > 0 && !Houston._admins.findOne({                                         // 97
    exists: true                                                                                               // 97
  })) {                                                                                                        //
    return Houston._admins.insert({                                                                            //
      exists: true                                                                                             // 98
    });                                                                                                        //
  }                                                                                                            //
});                                                                                                            // 95
                                                                                                               //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/houston_admin/server/exports.coffee.js                                                             //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var root;                                                                                                      // 2
                                                                                                               //
root = typeof exports !== "undefined" && exports !== null ? exports : this;                                    // 2
                                                                                                               //
Houston.add_collection = function(collection) {                                                                // 2
  return Houston._setup_collection(collection);                                                                //
};                                                                                                             // 6
                                                                                                               //
Houston.hide_collection = function(collection) {                                                               // 2
  var col;                                                                                                     // 12
  Houston._HIDDEN_COLLECTIONS[collection._name] = collection;                                                  // 12
  col = Houston._collections.collections.findOne({                                                             // 12
    name: collection._name                                                                                     // 13
  });                                                                                                          //
  if (col != null) {                                                                                           // 14
    return Houston._collections.collections.remove(col);                                                       //
  }                                                                                                            //
};                                                                                                             // 11
                                                                                                               //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/houston_admin/server/methods.coffee.js                                                             //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var require_admin;                                                                                             // 2
                                                                                                               //
require_admin = function(func) {                                                                               // 2
  return function() {                                                                                          //
    if (Houston._user_is_admin(this.userId)) {                                                                 // 3
      return func.apply(this, arguments);                                                                      //
    }                                                                                                          //
  };                                                                                                           //
};                                                                                                             // 2
                                                                                                               //
Houston.methods = function(collection, raw_methods) {                                                          // 2
  var collection_name, func, func_name, method_names, methods;                                                 // 6
  collection_name = collection.name || collection._name || collection;                                         // 6
  method_names = _(raw_methods).keys();                                                                        // 6
  Houston._collections.collections.update({                                                                    // 6
    name: collection_name                                                                                      // 8
  }, {                                                                                                         //
    $set: {                                                                                                    // 8
      method_names: method_names                                                                               // 8
    }                                                                                                          //
  });                                                                                                          //
  methods = {};                                                                                                // 6
  for (func_name in raw_methods) {                                                                             // 11
    func = raw_methods[func_name];                                                                             //
    methods[Houston._custom_method_name(collection_name, func_name)] = require_admin(func);                    // 12
  }                                                                                                            // 11
  return Meteor.methods(methods);                                                                              //
};                                                                                                             // 5
                                                                                                               //
Houston._setup_collection_methods = function(collection) {                                                     // 2
  var methods, name;                                                                                           // 17
  name = collection._name;                                                                                     // 17
  methods = {};                                                                                                // 17
  methods[Houston._houstonize(name + "_insert")] = require_admin(function(doc) {                               // 17
    check(doc, Object);                                                                                        // 20
    return collection.insert(doc);                                                                             //
  });                                                                                                          //
  methods[Houston._houstonize(name + "_update")] = require_admin(function(id, update_dict) {                   // 17
    check(id, Match.Any);                                                                                      // 24
    check(update_dict, Object);                                                                                // 24
    if (collection.findOne(id)) {                                                                              // 26
      collection.update(id, update_dict);                                                                      // 27
    } else {                                                                                                   //
      id = collection.findOne(new Meteor.Collection.ObjectID(id));                                             // 29
      collection.update(id, update_dict);                                                                      // 29
    }                                                                                                          //
    return collection._name + " " + id + " saved successfully";                                                //
  });                                                                                                          //
  methods[Houston._houstonize(name + "_delete")] = require_admin(function(id) {                                // 17
    check(id, Match.Any);                                                                                      // 35
    if (collection.findOne(id)) {                                                                              // 36
      return collection.remove(id);                                                                            //
    } else {                                                                                                   //
      id = collection.findOne(new Meteor.Collection.ObjectID(id));                                             // 39
      return collection.remove(id);                                                                            //
    }                                                                                                          //
  });                                                                                                          //
  methods[Houston._houstonize(name + "_deleteAll")] = require_admin(function() {                               // 17
    return collection.remove({});                                                                              //
  });                                                                                                          //
  return Meteor.methods(methods);                                                                              //
};                                                                                                             // 16
                                                                                                               //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['houston:admin'] = {};

})();

//# sourceMappingURL=houston_admin.js.map
