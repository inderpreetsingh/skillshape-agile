(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var Tracker = Package.deps.Tracker;
var Deps = Package.deps.Deps;
var _ = Package.underscore._;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var EJSON = Package.ejson.EJSON;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var Log = Package.logging.Log;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var Blaze = Package.ui.Blaze;
var UI = Package.ui.UI;
var Handlebars = Package.ui.Handlebars;
var Spacebars = Package.spacebars.Spacebars;
var Random = Package.random.Random;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/alethes_pages/lib/pages.coffee.js                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Pages,                                                                                                            // 1
  slice = [].slice,                                                                                                   //
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                                                                      //
this.__Pages = Pages = (function() {                                                                                  // 1
  Pages.prototype.settings = {                                                                                        // 3
    dataMargin: [true, Number, 3],                                                                                    // 7
    divWrapper: [true, Match.OneOf(Match.Optional(String), Match.Optional(Boolean)), "pagesCont"],                    // 7
    fields: [true, Object, {}],                                                                                       // 7
    filters: [true, Object, {}],                                                                                      // 7
    itemTemplate: [true, String, "_pagesItemDefault"],                                                                // 7
    navShowEdges: [true, Boolean, false],                                                                             // 7
    navShowFirst: [true, Boolean, true],                                                                              // 7
    navShowLast: [true, Boolean, true],                                                                               // 7
    resetOnReload: [true, Boolean, false],                                                                            // 7
    paginationMargin: [true, Number, 3],                                                                              // 7
    perPage: [true, Number, 10],                                                                                      // 7
    route: [true, String, "/page/"],                                                                                  // 7
    router: [true, Match.Optional(String), void 0],                                                                   // 7
    routerTemplate: [true, String, "pages"],                                                                          // 7
    routerLayout: [true, Match.Optional(String), void 0],                                                             // 7
    sort: [true, Object, {}],                                                                                         // 7
    auth: [false, Match.Optional(Function), void 0],                                                                  // 7
    availableSettings: [false, Object, {}],                                                                           // 7
    fastRender: [false, Boolean, false],                                                                              // 7
    homeRoute: [false, Match.OneOf(String, Array, Boolean), "/"],                                                     // 7
    infinite: [false, Boolean, false],                                                                                // 7
    infiniteItemsLimit: [false, Number, Infinity],                                                                    // 7
    infiniteTrigger: [false, Number, .9],                                                                             // 7
    infiniteRateLimit: [false, Number, 1],                                                                            // 7
    infiniteStep: [false, Number, 10],                                                                                // 7
    initPage: [false, Number, 1],                                                                                     // 7
    maxSubscriptions: [false, Number, 20],                                                                            // 7
    navTemplate: [false, String, "_pagesNavCont"],                                                                    // 7
    onDeniedSetting: [                                                                                                // 7
      false, Function, function(k, v, e) {                                                                            //
        return typeof console !== "undefined" && console !== null ? console.log("Changing " + k + " not allowed.") : void 0;
      }                                                                                                               //
    ],                                                                                                                //
    pageCountFrequency: [false, Number, 10000],                                                                       // 7
    pageSizeLimit: [false, Number, 60],                                                                               // 7
    pageTemplate: [false, String, "_pagesPageCont"],                                                                  // 7
    rateLimit: [false, Number, 1],                                                                                    // 7
    routeSettings: [false, Match.Optional(Function), void 0],                                                         // 7
    scrollBoxSelector: [String, void 0],                                                                              // 7
    table: [false, Match.OneOf(Boolean, Object), false],                                                              // 7
    tableItemTemplate: [false, String, "_pagesTableItem"],                                                            // 7
    tableTemplate: [false, String, "_pagesTable"],                                                                    // 7
    templateName: [false, Match.Optional(String), void 0]                                                             // 7
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype._nInstances = 0;                                                                                    // 3
                                                                                                                      //
  Pages.prototype.collections = {};                                                                                   // 3
                                                                                                                      //
  Pages.prototype.instances = {};                                                                                     // 3
                                                                                                                      //
  Pages.prototype.methods = {                                                                                         // 3
    "CountPages": function(sub) {                                                                                     // 62
      var n;                                                                                                          // 63
      n = sub.get("nPublishedPages");                                                                                 // 63
      if (n != null) {                                                                                                // 64
        return n;                                                                                                     // 64
      }                                                                                                               //
      n = Math.ceil(this.Collection.find({                                                                            // 63
        $and: [sub.get("filters"), sub.get("realFilters") || {}]                                                      // 67
      }).count() / (sub.get("perPage")));                                                                             //
      return n || 1;                                                                                                  //
    },                                                                                                                //
    "Set": function(k, v, sub) {                                                                                      // 62
      var _k, _v, changes;                                                                                            // 75
      if (this.settings[k] == null) {                                                                                 // 75
        this.error("invalid-option", "Invalid option name: " + k + ".");                                              // 76
      }                                                                                                               //
      check(k, String);                                                                                               // 75
      check(v, this.settings[k][1]);                                                                                  // 75
      check(sub, Match.Where(function(sub) {                                                                          // 75
        var ref;                                                                                                      // 80
        return ((ref = sub.connection) != null ? ref.id : void 0) != null;                                            //
      }));                                                                                                            //
      if (!this.availableSettings[k] || (_.isFunction(this.availableSettings[k]) && !this.availableSettings[k](v, sub))) {
        this.error("forbidden-option", "Changing " + k + " not allowed.");                                            // 83
      }                                                                                                               //
      changes = 0;                                                                                                    // 75
      if (v != null) {                                                                                                // 86
        changes = this._set(k, v, {                                                                                   // 87
          cid: sub.connection.id                                                                                      // 87
        });                                                                                                           //
      } else if (!_.isString(k)) {                                                                                    //
        for (_k in k) {                                                                                               // 89
          _v = k[_k];                                                                                                 //
          changes += this.set(_k, _v, {                                                                               // 90
            cid: sub.connection.id                                                                                    // 90
          });                                                                                                         //
        }                                                                                                             // 89
      }                                                                                                               //
      return changes;                                                                                                 //
    },                                                                                                                //
    "Unsubscribe": function() {                                                                                       // 62
      var cid, k, ref, sub, subs;                                                                                     // 94
      cid = arguments[arguments.length - 1].connection.id;                                                            // 94
      subs = {};                                                                                                      // 94
      ref = this.subscriptions;                                                                                       // 96
      for (k in ref) {                                                                                                // 96
        sub = ref[k];                                                                                                 //
        if (k === "length" || k === "order") {                                                                        // 97
          continue;                                                                                                   // 97
        }                                                                                                             //
        if (sub.connection.id === cid) {                                                                              // 98
          sub.stop();                                                                                                 // 99
          delete this.subscriptions[k];                                                                               // 99
        }                                                                                                             //
      }                                                                                                               // 96
      this.subscriptions.length = 0;                                                                                  // 94
      return true;                                                                                                    //
    }                                                                                                                 //
  };                                                                                                                  //
                                                                                                                      //
  function Pages(collection, settings) {                                                                              // 104
    if (settings == null) {                                                                                           //
      settings = {};                                                                                                  //
    }                                                                                                                 //
    if (!(this instanceof Meteor.Pagination)) {                                                                       // 105
      throw new Meteor.Error("missing-new", "The Meteor.Pagination instance has to be initiated with `new`");         // 106
    }                                                                                                                 //
    this.init = this.beforeFirstReady = true;                                                                         // 105
    if (this.debug == null) {                                                                                         //
      this.debug = ((typeof PAGES_DEBUG !== "undefined" && PAGES_DEBUG !== null) && PAGES_DEBUG) || (typeof process !== "undefined" && process !== null ? process.env.PAGES_DEBUG : void 0);
    }                                                                                                                 //
    this.subscriptions = {                                                                                            // 105
      length: 0,                                                                                                      // 112
      order: []                                                                                                       // 112
    };                                                                                                                //
    this.userSettings = {};                                                                                           // 105
    this._currentPage = 1;                                                                                            // 105
    this.setCollection(collection);                                                                                   // 105
    this.setInitial(settings);                                                                                        // 105
    this.setDefaults();                                                                                               // 105
    this.setRouter();                                                                                                 // 105
    this[(Meteor.isServer ? "server" : "client") + "Init"]();                                                         // 105
    this.registerInstance();                                                                                          // 105
    this;                                                                                                             // 105
  }                                                                                                                   //
                                                                                                                      //
  Pages.prototype.error = function(code, msg) {                                                                       // 3
    if (code == null) {                                                                                               // 127
      msg = code;                                                                                                     // 127
    }                                                                                                                 //
    throw new Meteor.Error(code, msg);                                                                                // 128
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.serverInit = function() {                                                                           // 3
    var self;                                                                                                         // 133
    this.setMethods();                                                                                                // 133
    self = this;                                                                                                      // 133
    Meteor.onConnection((function(_this) {                                                                            // 133
      return function(connection) {                                                                                   //
        return connection.onClose(function() {                                                                        //
          return delete _this.userSettings[connection.id];                                                            //
        });                                                                                                           //
      };                                                                                                              //
    })(this));                                                                                                        //
    return Meteor.publish(this.id, function(page) {                                                                   //
      return self.publish.call(self, page, this);                                                                     //
    });                                                                                                               //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.clientInit = function() {                                                                           // 3
    this.requested = {};                                                                                              // 150
    this.received = {};                                                                                               // 150
    this.queue = [];                                                                                                  // 150
    this.nextPageCount = this.now();                                                                                  // 150
    this.groundDB = Package["ground:db"] != null;                                                                     // 150
    if (this.infinite) {                                                                                              // 155
      this.sess("limit", 10);                                                                                         // 156
      this.lastOffsetHeight = 0;                                                                                      // 156
    }                                                                                                                 //
    if (this.maxSubscriptions < 1) {                                                                                  // 158
      this.maxSubscriptions = 1;                                                                                      // 159
    }                                                                                                                 //
    this.setTemplates();                                                                                              // 150
    Tracker.autorun((function(_this) {                                                                                // 150
      return function() {                                                                                             //
        Meteor.status();                                                                                              // 163
        if (typeof Meteor.userId === "function") {                                                                    //
          Meteor.userId();                                                                                            //
        }                                                                                                             //
        _this.countPages();                                                                                           // 163
        return _this.reload();                                                                                        //
      };                                                                                                              //
    })(this));                                                                                                        //
    if (this.templateName == null) {                                                                                  //
      this.templateName = this.name;                                                                                  //
    }                                                                                                                 //
    return Template[this.templateName].onRendered((function(_this) {                                                  //
      return function() {                                                                                             //
        if (_this.infinite) {                                                                                         // 169
          return _this.setInfiniteTrigger();                                                                          //
        }                                                                                                             //
      };                                                                                                              //
    })(this));                                                                                                        //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.reload = _.throttle(function() {                                                                    // 3
    this.unsubscribe();                                                                                               // 175
    return this.countPages((function(_this) {                                                                         //
      return function(total) {                                                                                        //
        var p;                                                                                                        // 177
        p = _this.currentPage();                                                                                      // 177
        if ((p == null) || _this.resetOnReload || p > total) {                                                        // 178
          p = 1;                                                                                                      // 178
        }                                                                                                             //
        _this.sess("currentPage", false);                                                                             // 177
        return _this.sess("currentPage", p);                                                                          //
      };                                                                                                              //
    })(this));                                                                                                        //
  }, 1000, {                                                                                                          //
    trailing: false                                                                                                   // 181
  });                                                                                                                 //
                                                                                                                      //
  Pages.prototype.unsubscribe = function(page, cid) {                                                                 // 3
    var k, ref, ref1, sub;                                                                                            // 184
    if (this.beforeFirstReady) {                                                                                      // 184
      return;                                                                                                         // 184
    }                                                                                                                 //
    if (page == null) {                                                                                               // 186
      ref = this.subscriptions;                                                                                       // 187
      for (k in ref) {                                                                                                // 187
        sub = ref[k];                                                                                                 //
        if (k === "length" || k === "order") {                                                                        // 188
          continue;                                                                                                   // 188
        }                                                                                                             //
        sub.stop();                                                                                                   // 188
        delete this.subscriptions[k];                                                                                 // 188
      }                                                                                                               // 187
      this.subscriptions.length = 0;                                                                                  // 187
      this.initPage = null;                                                                                           // 187
      this.requested = {};                                                                                            // 187
      this.received = {};                                                                                             // 187
      this.queue = [];                                                                                                // 187
    } else if (Meteor.isServer) {                                                                                     //
      check(cid, String);                                                                                             // 197
      if ((ref1 = this.subscriptions[cid]) != null ? ref1[page] : void 0) {                                           // 198
        this.subscriptions[cid][page].stop();                                                                         // 199
        delete this.subscriptions[cid][page];                                                                         // 199
        this.subscriptions.length--;                                                                                  // 199
      }                                                                                                               //
    } else if (this.subscriptions[page]) {                                                                            //
      this.subscriptions[page].stop();                                                                                // 204
      delete this.subscriptions[page];                                                                                // 204
      delete this.requested[page];                                                                                    // 204
      delete this.received[page];                                                                                     // 204
      this.subscriptions.order = _.without(this.subscriptions.order, Number(page));                                   // 204
      this.subscriptions.length--;                                                                                    // 204
    }                                                                                                                 //
    return true;                                                                                                      //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.setDefaults = function() {                                                                          // 3
    var k, ref, results, v;                                                                                           // 213
    ref = this.settings;                                                                                              // 213
    results = [];                                                                                                     // 213
    for (k in ref) {                                                                                                  //
      v = ref[k];                                                                                                     //
      if (v[2] != null) {                                                                                             // 214
        results.push(this[k] != null ? this[k] : this[k] = v[2]);                                                     //
      } else {                                                                                                        //
        results.push(void 0);                                                                                         //
      }                                                                                                               //
    }                                                                                                                 // 213
    return results;                                                                                                   //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.syncSettings = function(cb) {                                                                       // 3
    var S, k, ref, v;                                                                                                 // 218
    S = {};                                                                                                           // 218
    ref = this.settings;                                                                                              // 219
    for (k in ref) {                                                                                                  // 219
      v = ref[k];                                                                                                     //
      if (v[0]) {                                                                                                     // 220
        S[k] = this[k];                                                                                               // 221
      }                                                                                                               //
    }                                                                                                                 // 219
    return this.set(S, cb != null ? {                                                                                 //
      cb: cb.bind(this)                                                                                               // 222
    } : null);                                                                                                        //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.setMethods = function() {                                                                           // 3
    var f, n, nm, ref, self;                                                                                          // 227
    nm = {};                                                                                                          // 227
    self = this;                                                                                                      // 227
    ref = this.methods;                                                                                               // 229
    for (n in ref) {                                                                                                  // 229
      f = ref[n];                                                                                                     //
      nm[this.getMethodName(n)] = (function(f) {                                                                      // 230
        return function() {                                                                                           //
          var arg, k, r, v;                                                                                           // 232
          arg = (function() {                                                                                         // 232
            var results;                                                                                              //
            results = [];                                                                                             // 232
            for (k in arguments) {                                                                                    //
              v = arguments[k];                                                                                       //
              results.push(v);                                                                                        // 232
            }                                                                                                         // 232
            return results;                                                                                           //
          }).apply(this, arguments);                                                                                  //
          arg.push(this);                                                                                             // 232
          this.get = _.bind((function(self, k) {                                                                      // 232
            return self.get(k, this.connection.id);                                                                   //
          }), this, self);                                                                                            //
          r = f.apply(self, arg);                                                                                     // 232
          return r;                                                                                                   //
        };                                                                                                            //
      })(f);                                                                                                          //
    }                                                                                                                 // 229
    return Meteor.methods(nm);                                                                                        //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.getMethodName = function(name) {                                                                    // 3
    return this.id + "/" + name;                                                                                      //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.call = function() {                                                                                 // 3
    var args, last;                                                                                                   // 250
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                     // 250
    check(args, Array);                                                                                               // 250
    if (args.length < 1) {                                                                                            // 251
      this.error("method-name-missing", "Method name not provided in a method call.");                                // 252
    }                                                                                                                 //
    args[0] = this.getMethodName(args[0]);                                                                            // 250
    last = args.length - 1;                                                                                           // 250
    if (_.isFunction(args[last])) {                                                                                   // 255
      args[last] = args[last].bind(this);                                                                             // 256
    }                                                                                                                 //
    return Meteor.call.apply(this, args);                                                                             //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.sess = function(k, v) {                                                                             // 3
    if (typeof Session === "undefined" || Session === null) {                                                         // 262
      return;                                                                                                         // 262
    }                                                                                                                 //
    k = this.id + "." + k;                                                                                            // 262
    if (arguments.length === 2) {                                                                                     // 264
      return Session.set(k, v);                                                                                       //
    } else {                                                                                                          //
      return Session.get(k);                                                                                          //
    }                                                                                                                 //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.get = function(setting, connectionId) {                                                             // 3
    var ref, ref1;                                                                                                    // 275
    return (ref = (ref1 = this.userSettings[connectionId]) != null ? ref1[setting] : void 0) != null ? ref : this[setting];
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.set = function() {                                                                                  // 3
    var _k, _v, ch, k, opts;                                                                                          // 280
    k = arguments[0], opts = 2 <= arguments.length ? slice.call(arguments, 1) : [];                                   // 280
    ch = 0;                                                                                                           // 280
    switch (opts.length) {                                                                                            // 281
      case 0:                                                                                                         // 281
        if (_.isObject(k)) {                                                                                          // 284
          for (_k in k) {                                                                                             // 285
            _v = k[_k];                                                                                               //
            ch += this._set(_k, _v);                                                                                  // 286
          }                                                                                                           // 285
        }                                                                                                             //
        break;                                                                                                        // 282
      case 1:                                                                                                         // 281
        if (_.isObject(k)) {                                                                                          // 288
          if (_.isFunction(opts[0])) {                                                                                // 291
            opts[0] = {                                                                                               // 292
              cb: opts[0]                                                                                             // 292
            };                                                                                                        //
          }                                                                                                           //
          for (_k in k) {                                                                                             // 293
            _v = k[_k];                                                                                               //
            ch += this._set(_k, _v, opts[0]);                                                                         // 294
          }                                                                                                           // 293
        } else {                                                                                                      //
          check(k, String);                                                                                           // 297
          ch = this._set(k, opts[0]);                                                                                 // 297
        }                                                                                                             //
        break;                                                                                                        // 287
      case 2:                                                                                                         // 281
        if (_.isFunction(opts[1])) {                                                                                  // 301
          opts[1] = {                                                                                                 // 302
            cb: opts[1]                                                                                               // 302
          };                                                                                                          //
        }                                                                                                             //
        ch = this._set(k, opts[0], opts[1]);                                                                          // 301
        break;                                                                                                        // 299
      case 3:                                                                                                         // 281
        check(opts[1], Object);                                                                                       // 305
        check(opts[2], Function);                                                                                     // 305
        opts[2] = {                                                                                                   // 305
          cb: opts[2]                                                                                                 // 307
        };                                                                                                            //
        ch = this._set(k, opts[1], opts[2]);                                                                          // 305
    }                                                                                                                 // 281
    if (Meteor.isClient && ch) {                                                                                      // 309
      this.reload();                                                                                                  // 310
    }                                                                                                                 //
    return ch;                                                                                                        //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.setInitial = function(settings) {                                                                   // 3
    this.setInitDone = false;                                                                                         // 314
    this.set(settings);                                                                                               // 314
    return this.setInitDone = true;                                                                                   //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.sanitizeRegex = function(v) {                                                                       // 3
    var lis;                                                                                                          // 321
    if (_.isRegExp(v)) {                                                                                              // 321
      v = v.toString();                                                                                               // 322
      lis = v.lastIndexOf("/");                                                                                       // 322
      v = {                                                                                                           // 322
        $regex: v.slice(1, lis),                                                                                      // 324
        $options: v.slice(1 + lis)                                                                                    // 324
      };                                                                                                              //
    }                                                                                                                 //
    return v;                                                                                                         //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.sanitizeRegexObj = function(obj) {                                                                  // 3
    var k, v;                                                                                                         // 330
    if (_.isRegExp(obj)) {                                                                                            // 330
      return this.sanitizeRegex(obj);                                                                                 // 331
    }                                                                                                                 //
    for (k in obj) {                                                                                                  // 332
      v = obj[k];                                                                                                     //
      if (_.isRegExp(v)) {                                                                                            // 333
        obj[k] = this.sanitizeRegex(v);                                                                               // 334
      } else if ("object" === typeof v) {                                                                             //
        obj[k] = this.sanitizeRegexObj(v);                                                                            // 336
      }                                                                                                               //
    }                                                                                                                 // 332
    return obj;                                                                                                       //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype._set = function(k, v, opts) {                                                                       // 3
    var base, ch, name1, oldV, ref, ref1, ref2;                                                                       // 342
    if (opts == null) {                                                                                               //
      opts = {};                                                                                                      //
    }                                                                                                                 //
    check(k, String);                                                                                                 // 342
    ch = 1;                                                                                                           // 342
    if (Meteor.isServer || (this[k] == null) || ((ref = this.settings[k]) != null ? ref[0] : void 0) || opts.init) {  // 348
      if ((((ref1 = this.settings[k]) != null ? ref1[1] : void 0) != null) && ((ref2 = this.settings[k]) != null ? ref2[1] : void 0) !== true) {
        check(v, this.settings[k][1]);                                                                                // 352
      }                                                                                                               //
      this.sanitizeRegexObj(v);                                                                                       // 351
      oldV = this.get(k, opts != null ? opts.cid : void 0);                                                           // 351
      if (this.valuesEqual(v, oldV)) {                                                                                // 360
        return 0;                                                                                                     // 360
      }                                                                                                               //
      if (Meteor.isClient) {                                                                                          // 362
        this[k] = v;                                                                                                  // 363
        if (this.setInitDone) {                                                                                       // 364
          this.call("Set", k, v, function(e, r) {                                                                     // 366
            if (e) {                                                                                                  // 367
              this[k] = oldV;                                                                                         // 368
              return this.onDeniedSetting.call(this, k, v, e);                                                        // 369
            }                                                                                                         //
            return typeof opts.cb === "function" ? opts.cb(ch) : void 0;                                              //
          });                                                                                                         //
        }                                                                                                             //
      } else {                                                                                                        //
        if (opts.cid) {                                                                                               // 374
          if (ch != null) {                                                                                           // 375
            if ((base = this.userSettings)[name1 = opts.cid] == null) {                                               //
              base[name1] = {};                                                                                       //
            }                                                                                                         //
            this.userSettings[opts.cid][k] = v;                                                                       // 376
          }                                                                                                           //
        } else {                                                                                                      //
          this[k] = v;                                                                                                // 379
        }                                                                                                             //
        if (typeof opts.cb === "function") {                                                                          //
          opts.cb(ch);                                                                                                //
        }                                                                                                             //
      }                                                                                                               //
    } else {                                                                                                          //
      this.onDeniedSetting.call(this, k, v);                                                                          // 383
    }                                                                                                                 //
    return ch;                                                                                                        //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.valuesEqual = function(v1, v2) {                                                                    // 3
    if (_.isFunction(v1)) {                                                                                           // 387
      return _.isFunction(v2) && v1.toString() === v2.toString();                                                     //
    } else {                                                                                                          //
      return _.isEqual(v1, v2);                                                                                       //
    }                                                                                                                 //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.setId = function(name) {                                                                            // 3
    var n;                                                                                                            // 395
    if (this.templateName) {                                                                                          // 395
      name = this.templateName;                                                                                       // 396
    }                                                                                                                 //
    while (name in Pages.prototype.instances) {                                                                       // 397
      n = name.match(/[0-9]+$/);                                                                                      // 398
      if (n != null) {                                                                                                // 399
        name = name.slice(0, name.length - n[0].length) + (parseInt(n) + 1);                                          // 400
      } else {                                                                                                        //
        name = name + "2";                                                                                            // 402
      }                                                                                                               //
    }                                                                                                                 //
    this.id = "pages_" + name;                                                                                        // 395
    return this.name = name;                                                                                          //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.registerInstance = function() {                                                                     // 3
    Pages.prototype._nInstances++;                                                                                    // 409
    return Pages.prototype.instances[this.name] = this;                                                               //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.setCollection = function(collection) {                                                              // 3
    var e;                                                                                                            // 415
    if (typeof collection === "object") {                                                                             // 415
      Pages.prototype.collections[collection._name] = collection;                                                     // 416
      this.Collection = collection;                                                                                   // 416
    } else {                                                                                                          //
      try {                                                                                                           // 419
        this.Collection = new Mongo.Collection(collection);                                                           // 420
        Pages.prototype.collections[collection] = this.Collection;                                                    // 420
      } catch (_error) {                                                                                              //
        e = _error;                                                                                                   // 423
        this.Collection = Pages.prototype.collections[collection];                                                    // 423
        this.Collection instanceof Mongo.Collection || this.error("collection-inaccessible", "The '" + collection + "' collection was created outside of <Meteor.Pagination>. Pass the collection object instead of the collection's name to the <Meteor.Pagination> constructor.");
      }                                                                                                               //
    }                                                                                                                 //
    return this.setId(this.Collection._name);                                                                         //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.linkTo = function(page) {                                                                           // 3
    var params, ref;                                                                                                  // 435
    if ((ref = Router.current()) != null ? ref.params : void 0) {                                                     // 435
      params = Router.current().params;                                                                               // 436
      params.page = page;                                                                                             // 436
      return Router.routes[this.name + "_page"].path(params);                                                         //
    }                                                                                                                 //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.setRouter = function() {                                                                            // 3
    var init, l, pr, ref, self, t;                                                                                    // 441
    if (this.router === "iron-router") {                                                                              // 441
      if (this.route.indexOf(":page") === -1) {                                                                       // 442
        if (this.route[0] !== "/") {                                                                                  // 443
          this.route = "/" + this.route;                                                                              // 444
        }                                                                                                             //
        if (this.route[this.route.length - 1] !== "/") {                                                              // 445
          this.route += "/";                                                                                          // 446
        }                                                                                                             //
        pr = this.route = this.route + ":page";                                                                       // 443
      }                                                                                                               //
      t = this.routerTemplate;                                                                                        // 442
      l = (ref = this.routerLayout) != null ? ref : void 0;                                                           // 442
      self = this;                                                                                                    // 442
      init = true;                                                                                                    // 442
      Router.map(function() {                                                                                         // 442
        var hr, j, k, len, ref1, results;                                                                             // 454
        if (!self.infinite) {                                                                                         // 454
          this.route(self.name + "_page", {                                                                           // 458
            path: pr,                                                                                                 // 459
            template: t,                                                                                              // 459
            layoutTemplate: l,                                                                                        // 459
            onBeforeAction: function() {                                                                              // 459
              var page;                                                                                               // 463
              page = parseInt(this.params.page);                                                                      // 463
              if (self.init) {                                                                                        // 464
                self.sess("oldPage", page);                                                                           // 465
                self.sess("currentPage", page);                                                                       // 465
              }                                                                                                       //
              if (self.routeSettings != null) {                                                                       // 467
                self.routeSettings(this);                                                                             // 468
              }                                                                                                       //
              Tracker.nonreactive((function(_this) {                                                                  // 463
                return function() {                                                                                   //
                  return self.onNavClick(page);                                                                       //
                };                                                                                                    //
              })(this));                                                                                              //
              return this.next();                                                                                     //
            }                                                                                                         //
          });                                                                                                         //
        }                                                                                                             //
        if (self.homeRoute) {                                                                                         // 475
          if (_.isString(self.homeRoute)) {                                                                           // 476
            self.homeRoute = [self.homeRoute];                                                                        // 477
          }                                                                                                           //
          ref1 = self.homeRoute;                                                                                      // 478
          results = [];                                                                                               // 478
          for (k = j = 0, len = ref1.length; j < len; k = ++j) {                                                      //
            hr = ref1[k];                                                                                             //
            results.push(this.route(self.name + "_home" + k, {                                                        // 479
              path: hr,                                                                                               // 480
              template: t,                                                                                            // 480
              layoutTemplate: l,                                                                                      // 480
              onBeforeAction: function() {                                                                            // 480
                if (self.routeSettings != null) {                                                                     // 484
                  self.routeSettings(this);                                                                           // 485
                }                                                                                                     //
                if (self.init) {                                                                                      // 486
                  self.sess("oldPage", 1);                                                                            // 487
                  self.sess("currentPage", 1);                                                                        // 487
                }                                                                                                     //
                return this.next();                                                                                   //
              }                                                                                                       //
            }));                                                                                                      //
          }                                                                                                           // 478
          return results;                                                                                             //
        }                                                                                                             //
      });                                                                                                             //
      if (Meteor.isServer && this.fastRender) {                                                                       // 493
        self = this;                                                                                                  // 494
        FastRender.route(pr, function(params) {                                                                       // 494
          return this.subscribe(self.id, parseInt(params.page));                                                      //
        });                                                                                                           //
        return FastRender.route(this.homeRoute, function() {                                                          //
          return this.subscribe(self.id, 1);                                                                          //
        });                                                                                                           //
      }                                                                                                               //
    }                                                                                                                 //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.isEmpty = function() {                                                                              // 3
    return this.isReady() && this.Collection.find(_.object([["_" + this.id + "_i", 0]])).count() === 0;               //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.setPerPage = function() {                                                                           // 3
    return this.perPage = this.pageSizeLimit < this.perPage ? this.pageSizeLimit : this.perPage;                      //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.setTemplates = function() {                                                                         // 3
    var helpers, i, j, len, name, ref, tn;                                                                            // 507
    name = this.templateName || this.name;                                                                            // 507
    if (this.table && this.itemTemplate === "_pagesItemDefault") {                                                    // 508
      this.itemTemplate = this.tableItemTemplate;                                                                     // 509
    }                                                                                                                 //
    ref = [this.navTemplate, this.pageTemplate, this.itemTemplate, this.tableTemplate];                               // 511
    for (j = 0, len = ref.length; j < len; j++) {                                                                     // 511
      i = ref[j];                                                                                                     //
      tn = this.id + i;                                                                                               // 512
      Template[tn] = new Blaze.Template("Template." + tn, Template[i].renderFunction);                                // 512
      Template[tn].__eventMaps = Template[tn].__eventMaps.concat(Template[i].__eventMaps);                            // 512
      helpers = {                                                                                                     // 512
        pagesData: this                                                                                               // 515
      };                                                                                                              //
      _.each(Template[i].__helpers, (function(_this) {                                                                // 512
        return function(helper, name) {                                                                               //
          if (name[0] === " ") {                                                                                      // 517
            return helpers[name.slice(1)] = _.bind(helper, _this);                                                    //
          }                                                                                                           //
        };                                                                                                            //
      })(this));                                                                                                      //
      Template[tn].helpers(helpers);                                                                                  // 512
    }                                                                                                                 // 511
    return Template[name].helpers({                                                                                   //
      pagesData: this,                                                                                                // 524
      pagesNav: Template[this.id + this.navTemplate],                                                                 // 524
      pages: Template[this.id + this.pageTemplate]                                                                    // 524
    });                                                                                                               //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.countPages = _.throttle(function(cb) {                                                              // 3
    var n, ref;                                                                                                       // 532
    if (!Meteor.status().connected && (Package["ground:db"] != null)) {                                               // 532
      n = ((ref = this.Collection.findOne({}, {                                                                       // 533
        sort: _.object([["_" + this.id + "_p", -1]])                                                                  //
      })) != null ? ref["_" + this.id + "_p"] : void 0) || 0;                                                         //
      this.setTotalPages(n);                                                                                          // 533
      return typeof cb === "function" ? cb(n) : void 0;                                                               //
    } else {                                                                                                          //
      return this.call("CountPages", (function(_this) {                                                               //
        return function(e, r) {                                                                                       //
          var now;                                                                                                    // 538
          if (e != null) {                                                                                            // 538
            throw e;                                                                                                  // 538
          }                                                                                                           //
          _this.setTotalPages(r);                                                                                     // 538
          now = _this.now();                                                                                          // 538
          if (_this.nextPageCount < now) {                                                                            // 541
            _this.nextPageCount = now + _this.pageCountFrequency;                                                     // 542
            setTimeout(_.bind(_this.countPages, _this), _this.pageCountFrequency);                                    // 542
          }                                                                                                           //
          return typeof cb === "function" ? cb(r) : void 0;                                                           //
        };                                                                                                            //
      })(this));                                                                                                      //
    }                                                                                                                 //
  }, 1000);                                                                                                           //
                                                                                                                      //
  Pages.prototype.setTotalPages = function(n) {                                                                       // 3
    this.sess("totalPages", n);                                                                                       // 548
    if (this.sess("currentPage") > n) {                                                                               // 549
      return this.sess("currentPage", 1);                                                                             //
    }                                                                                                                 //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.enforceSubscriptionLimit = function(cid) {                                                          // 3
    var ref;                                                                                                          // 555
    if (Meteor.isServer) {                                                                                            // 555
      check(cid, String);                                                                                             // 556
      if (((ref = this.subscriptions[cid]) != null ? ref.length : void 0) >= this.maxSubscriptions) {                 // 557
        return this.error("subscription-limit-reached", "Subscription limit reached. Unable to open a new subscription.");
      }                                                                                                               //
    } else {                                                                                                          //
      while (this.subscriptions.length >= this.maxSubscriptions) {                                                    // 560
        this.unsubscribe(this.subscriptions.order[0]);                                                                // 561
      }                                                                                                               //
      return true;                                                                                                    //
    }                                                                                                                 //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.publish = function(page, sub) {                                                                     // 3
    var base, c, cid, get, handle, handle2, init, n, name1, query, self, set;                                         // 571
    check(page, Number);                                                                                              // 571
    check(sub, Match.Where(function(s) {                                                                              // 571
      return s.ready != null;                                                                                         //
    }));                                                                                                              //
    cid = sub.connection.id;                                                                                          // 571
    init = true;                                                                                                      // 571
    if ((base = this.subscriptions)[name1 = sub.connection.id] == null) {                                             //
      base[name1] = {                                                                                                 //
        length: 0                                                                                                     // 579
      };                                                                                                              //
    }                                                                                                                 //
    this.enforceSubscriptionLimit(cid);                                                                               // 571
    get = sub.get = _.bind((function(cid, k) {                                                                        // 571
      return this.get(k, cid);                                                                                        //
    }), this, cid);                                                                                                   //
    set = sub.set = _.bind((function(cid, k, v) {                                                                     // 571
      return this.set(k, v, {                                                                                         //
        cid: cid                                                                                                      // 587
      });                                                                                                             //
    }), this, cid);                                                                                                   //
    query = _.bind((function(sub, get, set) {                                                                         // 571
      var c, filters, options, r, ref, ref1, skip;                                                                    // 591
      if ((ref = this.userSettings[cid]) != null) {                                                                   //
        delete ref.realFilters;                                                                                       //
      }                                                                                                               //
      if ((ref1 = this.userSettings[cid]) != null) {                                                                  //
        delete ref1.nPublishedPages;                                                                                  //
      }                                                                                                               //
      this.setPerPage();                                                                                              // 591
      skip = (page - 1) * get("perPage");                                                                             // 591
      if (skip < 0) {                                                                                                 // 597
        skip = 0;                                                                                                     // 597
      }                                                                                                               //
      filters = get("filters");                                                                                       // 591
      options = {                                                                                                     // 591
        sort: get("sort"),                                                                                            // 602
        fields: get("fields"),                                                                                        // 602
        skip: skip,                                                                                                   // 602
        limit: get("perPage")                                                                                         // 602
      };                                                                                                              //
      if (this.auth != null) {                                                                                        // 609
        r = this.auth.call(this, skip, sub);                                                                          // 610
        if (!r) {                                                                                                     // 611
          set("nPublishedPages", 0);                                                                                  // 612
          sub.ready();                                                                                                // 612
          return this.ready();                                                                                        // 614
        } else if (_.isNumber(r)) {                                                                                   //
          set("nPublishedPages", r);                                                                                  // 616
          if (page > r) {                                                                                             // 617
            sub.ready();                                                                                              // 618
            return this.ready();                                                                                      // 619
          }                                                                                                           //
        } else if (_.isArray(r) && r.length === 2) {                                                                  //
          if (_.isFunction(r[0].fetch)) {                                                                             // 621
            c = r;                                                                                                    // 622
          } else {                                                                                                    //
            filters = r[0];                                                                                           // 624
            options = r[1];                                                                                           // 624
          }                                                                                                           //
        } else if (_.isFunction(r.fetch)) {                                                                           //
          c = r;                                                                                                      // 627
        }                                                                                                             //
      }                                                                                                               //
      if (!EJSON.equals({}, filters) && !EJSON.equals(get("filters"), filters)) {                                     // 629
        set("realFilters", filters);                                                                                  // 630
      }                                                                                                               //
      return c || this.Collection.find(filters, options);                                                             //
    }), this, sub, get, set);                                                                                         //
    c = query();                                                                                                      // 571
    self = this;                                                                                                      // 571
    handle = c.observe({                                                                                              // 571
      addedAt: _.bind((function(sub, query, doc, at) {                                                                // 653
        var id;                                                                                                       // 654
        if (init) {                                                                                                   // 654
          return;                                                                                                     // 654
        }                                                                                                             //
        doc["_" + this.id + "_p"] = page;                                                                             // 654
        doc["_" + this.id + "_i"] = at;                                                                               // 654
        id = doc._id;                                                                                                 // 654
        delete doc._id;                                                                                               // 654
        return query().forEach((function(_this) {                                                                     //
          return function(o, i) {                                                                                     //
            if (i === at) {                                                                                           // 662
              return sub.added(_this.Collection._name, id, doc);                                                      //
            } else {                                                                                                  //
              return sub.changed(_this.Collection._name, o._id, _.object([["_" + _this.id + "_i", i]]));              //
            }                                                                                                         //
          };                                                                                                          //
        })(this));                                                                                                    //
      }), this, sub, query)                                                                                           //
    });                                                                                                               //
    handle2 = c.observeChanges({                                                                                      // 571
      movedBefore: _.bind((function(sub, query, id, before) {                                                         // 671
        return query().forEach((function(_this) {                                                                     //
          return function(o, i) {                                                                                     //
            return sub.changed(_this.Collection._name, o._id, _.object([["_" + _this.id + "_i", i]]));                //
          };                                                                                                          //
        })(this));                                                                                                    //
      }), this, sub, query),                                                                                          //
      changed: _.bind((function(sub, query, id, fields) {                                                             // 671
        var e;                                                                                                        // 679
        try {                                                                                                         // 679
          return sub.changed(this.Collection._name, id, fields);                                                      //
        } catch (_error) {                                                                                            //
          e = _error;                                                                                                 // 681
        }                                                                                                             //
      }), this, sub, query),                                                                                          //
      removed: _.bind((function(sub, query, id) {                                                                     // 671
        var e;                                                                                                        // 686
        try {                                                                                                         // 686
          sub.removed(this.Collection._name, id);                                                                     // 687
          return query().forEach((function(_this) {                                                                   //
            return function(o, i) {                                                                                   //
              return sub.changed(_this.Collection._name, o._id, _.object([["_" + _this.id + "_i", i]]));              //
            };                                                                                                        //
          })(this));                                                                                                  //
        } catch (_error) {                                                                                            //
          e = _error;                                                                                                 // 690
        }                                                                                                             //
      }), this, sub, query)                                                                                           //
    });                                                                                                               //
    n = 0;                                                                                                            // 571
    c.forEach((function(_this) {                                                                                      // 571
      return function(doc, index, cursor) {                                                                           //
        n++;                                                                                                          // 697
        doc["_" + _this.id + "_p"] = page;                                                                            // 697
        doc["_" + _this.id + "_i"] = index;                                                                           // 697
        return sub.added(_this.Collection._name, doc._id, doc);                                                       //
      };                                                                                                              //
    })(this));                                                                                                        //
    init = false;                                                                                                     // 571
    sub.onStop(_.bind((function(page) {                                                                               // 571
      delete this.subscriptions[sub.connection.id][page];                                                             // 706
      this.subscriptions[sub.connection.id].length--;                                                                 // 706
      handle.stop();                                                                                                  // 706
      return handle2.stop();                                                                                          //
    }), this, page));                                                                                                 //
    this.subscriptions[sub.connection.id][page] = sub;                                                                // 571
    this.subscriptions[sub.connection.id].length++;                                                                   // 571
    return sub.ready();                                                                                               //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.loading = function(p) {                                                                             // 3
    if (!this.fastRender && p === this.currentPage()) {                                                               // 718
      return this.sess("ready", false);                                                                               //
    }                                                                                                                 //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.now = function() {                                                                                  // 3
    return (new Date()).getTime();                                                                                    //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.log = function() {                                                                                  // 3
    var a, i, j, len;                                                                                                 // 725
    a = ["Pages: " + this.name + " -"];                                                                               // 725
    for (j = 0, len = arguments.length; j < len; j++) {                                                               // 726
      i = arguments[j];                                                                                               //
      a.push(i);                                                                                                      // 727
    }                                                                                                                 // 726
    return this.debug && console.log.apply(console, a);                                                               //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.logRequest = function(p) {                                                                          // 3
    this.timeLastRequest = this.now();                                                                                // 731
    this.requesting = p;                                                                                              // 731
    return this.requested[p] = 1;                                                                                     //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.logResponse = function(p) {                                                                         // 3
    delete this.requested[p];                                                                                         // 736
    return this.received[p] = 1;                                                                                      //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.clearQueue = function() {                                                                           // 3
    return this.queue = [];                                                                                           //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.neighbors = function(page) {                                                                        // 3
    var d, j, maxMargin, n, np, pp, ref;                                                                              // 743
    n = [];                                                                                                           // 743
    if (this.dataMargin === 0 || this.maxSubscriptions < 2) {                                                         // 744
      return n;                                                                                                       // 745
    }                                                                                                                 //
    maxMargin = Math.floor((this.maxSubscriptions - 1) / 2);                                                          // 743
    for (d = j = 1, ref = _.min([maxMargin, this.dataMargin]); 1 <= ref ? j <= ref : j >= ref; d = 1 <= ref ? ++j : --j) {
      np = page + d;                                                                                                  // 748
      if (np <= this.sess("totalPages")) {                                                                            // 749
        n.push(np);                                                                                                   // 750
      }                                                                                                               //
      pp = page - d;                                                                                                  // 748
      if (pp > 0) {                                                                                                   // 752
        n.push(pp);                                                                                                   // 753
      }                                                                                                               //
    }                                                                                                                 // 747
    return n;                                                                                                         //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.queueNeighbors = function(page) {                                                                   // 3
    var j, len, p, ref, results;                                                                                      // 757
    ref = this.neighbors(page);                                                                                       // 757
    results = [];                                                                                                     // 757
    for (j = 0, len = ref.length; j < len; j++) {                                                                     //
      p = ref[j];                                                                                                     //
      if (!this.received[p] && !this.requested[p] && indexOf.call(this.queue, p) < 0) {                               // 758
        results.push(this.queue.push(p));                                                                             //
      } else {                                                                                                        //
        results.push(void 0);                                                                                         //
      }                                                                                                               //
    }                                                                                                                 // 757
    return results;                                                                                                   //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.paginationNavItem = function(label, page, disabled, active) {                                       // 3
    if (active == null) {                                                                                             //
      active = false;                                                                                                 //
    }                                                                                                                 //
    return {                                                                                                          //
      p: label,                                                                                                       // 761
      n: page,                                                                                                        // 761
      active: active ? "active" : "",                                                                                 // 761
      disabled: disabled ? "disabled" : ""                                                                            // 761
    };                                                                                                                //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.navigationNeighbors = function() {                                                                  // 3
    var from, i, j, k, len, m, n, p, page, ref, ref1, to, total;                                                      // 767
    page = this.currentPage();                                                                                        // 767
    total = this.sess("totalPages");                                                                                  // 767
    from = page - this.paginationMargin;                                                                              // 767
    to = page + this.paginationMargin;                                                                                // 767
    if (from < 1) {                                                                                                   // 771
      to += 1 - from;                                                                                                 // 772
      from = 1;                                                                                                       // 772
    }                                                                                                                 //
    if (to > total) {                                                                                                 // 774
      from -= to - total;                                                                                             // 775
      to = total;                                                                                                     // 775
    }                                                                                                                 //
    if (from < 1) {                                                                                                   // 777
      from = 1;                                                                                                       // 777
    }                                                                                                                 //
    if (to > total) {                                                                                                 // 778
      to = total;                                                                                                     // 778
    }                                                                                                                 //
    n = [];                                                                                                           // 767
    if (this.navShowFirst || this.navShowEdges) {                                                                     // 780
      n.push(this.paginationNavItem("«", 1, page === 1));                                                             // 781
    }                                                                                                                 //
    n.push(this.paginationNavItem("<", page - 1, page === 1));                                                        // 767
    for (p = j = ref = from, ref1 = to; ref <= ref1 ? j <= ref1 : j >= ref1; p = ref <= ref1 ? ++j : --j) {           // 783
      n.push(this.paginationNavItem(p, p, page > total, p === page));                                                 // 784
    }                                                                                                                 // 783
    n.push(this.paginationNavItem(">", page + 1, page >= total));                                                     // 767
    if (this.navShowLast || this.navShowEdges) {                                                                      // 786
      n.push(this.paginationNavItem("»", total, page >= total));                                                      // 787
    }                                                                                                                 //
    for (k = m = 0, len = n.length; m < len; k = ++m) {                                                               // 788
      i = n[k];                                                                                                       //
      n[k]['_p'] = this;                                                                                              // 789
    }                                                                                                                 // 788
    return n;                                                                                                         //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.onNavClick = function(n) {                                                                          // 3
    if (n <= this.sess("totalPages") && n > 0) {                                                                      // 793
      Tracker.nonreactive((function(_this) {                                                                          // 794
        return function() {                                                                                           //
          var cp;                                                                                                     // 795
          cp = _this.sess("currentPage");                                                                             // 795
          if (_this.received[cp]) {                                                                                   // 796
            return _this.sess("oldPage", cp);                                                                         //
          }                                                                                                           //
        };                                                                                                            //
      })(this));                                                                                                      //
      return this.sess("currentPage", n);                                                                             //
    }                                                                                                                 //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.setInfiniteTrigger = function() {                                                                   // 3
    this.scrollBoxSelector = this.scrollBoxSelector || window;                                                        // 801
    this.scrollBox = $(this.scrollBoxSelector);                                                                       // 801
    return this.scrollBox.scroll(_.bind(_.throttle(function() {                                                       //
      var l, oh, t;                                                                                                   // 805
      t = this.infiniteTrigger;                                                                                       // 805
      oh = this.scrollBox[0].scrollHeight;                                                                            // 805
      if ((this.lastOffsetHeight != null) && this.lastOffsetHeight > oh) {                                            // 807
        return;                                                                                                       // 807
      }                                                                                                               //
      this.lastOffsetHeight = oh;                                                                                     // 805
      if (t > 1) {                                                                                                    // 809
        l = oh - t;                                                                                                   // 810
      } else if (t > 0) {                                                                                             //
        l = oh * t;                                                                                                   // 812
      } else {                                                                                                        //
        return;                                                                                                       // 814
      }                                                                                                               //
      if (this.scrollBox.scrollTop() + this.scrollBox[0].offsetHeight >= l) {                                         // 816
        return this.sess("limit", this.sess("limit") + this.infiniteStep);                                            //
                                                                                                                      // 819
        /*                                                                                                            // 819
        if @lastPage < @sess "totalPages"                                                                             //
          console.log "i want page #{@lastPage + 1}"                                                                  //
          @sess("currentPage", @lastPage + 1)                                                                         //
         */                                                                                                           //
      }                                                                                                               //
    }, this.infiniteRateLimit * 1000), this));                                                                        //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.checkQueue = _.throttle(function() {                                                                // 3
    var cp, i, k, neighbors, ref, results, results1, v;                                                               // 830
    cp = this.currentPage();                                                                                          // 830
    neighbors = this.neighbors(cp);                                                                                   // 830
    if (!this.received[cp]) {                                                                                         // 836
      this.clearQueue();                                                                                              // 838
      this.requestPage(cp);                                                                                           // 838
      cp = String(cp);                                                                                                // 838
      ref = this.requested;                                                                                           // 841
      results = [];                                                                                                   // 841
      for (k in ref) {                                                                                                //
        v = ref[k];                                                                                                   //
        if (k !== cp) {                                                                                               // 842
          if (this.subscriptions[k] != null) {                                                                        // 843
            this.subscriptions[k].stop();                                                                             // 844
            delete this.subscriptions[k];                                                                             // 844
            this.subscriptions.length--;                                                                              // 844
          }                                                                                                           //
          results.push(delete this.requested[k]);                                                                     // 843
        } else {                                                                                                      //
          results.push(void 0);                                                                                       //
        }                                                                                                             //
      }                                                                                                               // 841
      return results;                                                                                                 //
    } else if (this.queue.length) {                                                                                   //
      results1 = [];                                                                                                  // 853
      while (this.queue.length > 0) {                                                                                 //
        i = this.queue.shift();                                                                                       // 854
        if (indexOf.call(neighbors, i) >= 0) {                                                                        // 855
          this.requestPage(i);                                                                                        // 857
          break;                                                                                                      // 858
        } else {                                                                                                      //
          results1.push(void 0);                                                                                      //
        }                                                                                                             //
      }                                                                                                               //
      return results1;                                                                                                //
    }                                                                                                                 //
  }, 500);                                                                                                            //
                                                                                                                      //
  Pages.prototype.currentPage = function() {                                                                          // 3
    if (Meteor.isClient && (this.sess("currentPage") != null)) {                                                      // 862
      return this.sess("currentPage");                                                                                //
    } else {                                                                                                          //
      return this._currentPage;                                                                                       //
    }                                                                                                                 //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.isReady = function() {                                                                              // 3
    return this.sess("ready");                                                                                        //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.ready = function(p) {                                                                               // 3
    if (p === true || p === this.currentPage() && (typeof Session !== "undefined" && Session !== null)) {             // 871
      return this.sess("ready", true);                                                                                //
    }                                                                                                                 //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.checkInitPage = function() {                                                                        // 3
    var ref, ref1, ref2;                                                                                              // 875
    if (this.init && !this.initPage) {                                                                                // 875
      if (this.router) {                                                                                              // 876
        if ((ref = Router.current()) != null) {                                                                       //
          if ((ref1 = ref.route) != null) {                                                                           //
            ref1.getName();                                                                                           //
          }                                                                                                           //
        }                                                                                                             //
        try {                                                                                                         // 878
          this.initPage = parseInt((ref2 = Router.current().route.params(location.href)) != null ? ref2.page : void 0) || 1;
        } catch (_error) {                                                                                            //
          return;                                                                                                     // 881
        }                                                                                                             //
      } else {                                                                                                        //
        this.initPage = 1;                                                                                            // 883
      }                                                                                                               //
    }                                                                                                                 //
    this.init = false;                                                                                                // 875
    this.sess("oldPage", this.initPage);                                                                              // 875
    return this.sess("currentPage", this.initPage);                                                                   //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.getPage = function(page) {                                                                          // 3
    var c, n, total;                                                                                                  // 889
    if (Meteor.isClient) {                                                                                            // 889
      if (page == null) {                                                                                             // 890
        page = this.currentPage();                                                                                    // 890
      }                                                                                                               //
      page = parseInt(page);                                                                                          // 890
      if (page === NaN) {                                                                                             // 892
        return;                                                                                                       // 892
      }                                                                                                               //
      total = this.sess("totalPages");                                                                                // 890
      if (total === 0) {                                                                                              // 894
        return this.ready(true);                                                                                      // 894
      }                                                                                                               //
      if (page <= total) {                                                                                            // 898
        this.requestPage(page);                                                                                       // 899
        this.queueNeighbors(page);                                                                                    // 899
        this.checkQueue();                                                                                            // 899
      }                                                                                                               //
      if (this.infinite) {                                                                                            // 907
        n = this.Collection.find({}, {                                                                                // 908
          fields: this.fields,                                                                                        // 909
          sort: this.sort                                                                                             // 909
        }).count();                                                                                                   //
        c = this.Collection.find({}, {                                                                                // 908
          fields: this.fields,                                                                                        // 913
          sort: this.sort,                                                                                            // 913
          skip: n > this.infiniteItemsLimit ? n - this.infiniteItemsLimit : 0,                                        // 913
          limit: this.sess("limit") || this.infiniteItemsLimit                                                        // 913
        });                                                                                                           //
      } else {                                                                                                        //
        c = this.Collection.find(_.object([["_" + this.id + "_p", page]]), {                                          // 919
          fields: this.fields,                                                                                        // 923
          sort: _.object([["_" + this.id + "_i", 1]])                                                                 // 923
        });                                                                                                           //
        c.observeChanges({                                                                                            // 919
          added: (function(_this) {                                                                                   // 929
            return function() {                                                                                       //
              return _this.countPages();                                                                              //
            };                                                                                                        //
          })(this),                                                                                                   //
          removed: (function(_this) {                                                                                 // 929
            return function() {                                                                                       //
                                                                                                                      // 934
              /* !! */                                                                                                // 934
              _this.requestPage(_this.sess("currentPage"));                                                           // 934
              return _this.countPages();                                                                              //
            };                                                                                                        //
          })(this)                                                                                                    //
        });                                                                                                           //
      }                                                                                                               //
      return c.fetch();                                                                                               //
    }                                                                                                                 //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.requestPage = function(page) {                                                                      // 3
    if (!page || this.requested[page] || this.received[page]) {                                                       // 945
      return;                                                                                                         // 945
    }                                                                                                                 //
    this.log("Requesting page " + page);                                                                              // 945
    this.logRequest(page);                                                                                            // 945
    if (!Meteor.status().connected && this.groundDB) {                                                                // 948
      if (this.Collection.findOne(_.object([["_" + this.id + "_p", page]]))) {                                        // 949
        return this.onPage(page);                                                                                     //
      } else {                                                                                                        //
        return setTimeout(_.bind(function(page) {                                                                     //
          if (this.currentPage() === page && !this.received[page]) {                                                  // 953
            delete this.requested[page];                                                                              // 954
            return this.requestPage(page);                                                                            //
          }                                                                                                           //
        }, this, page), 500);                                                                                         //
      }                                                                                                               //
    } else {                                                                                                          //
      this.enforceSubscriptionLimit();                                                                                // 959
      return Meteor.defer(_.bind((function(page) {                                                                    //
        this.subscriptions[page] = Meteor.subscribe(this.id, page, {                                                  // 962
          onReady: _.bind(function(page) {                                                                            // 963
            return this.onPage(page);                                                                                 //
          }, this, page),                                                                                             //
          onError: (function(_this) {                                                                                 // 963
            return function(e) {                                                                                      //
              if (e.error === "subscription-limit-reached") {                                                         // 967
                return setTimeout(_.bind(function(page) {                                                             //
                  if (this.currentPage() === page && !this.received[page]) {                                          // 969
                    delete this.requested[page];                                                                      // 970
                    return this.requestPage(page);                                                                    //
                  }                                                                                                   //
                }, _this, page), 500);                                                                                //
              } else {                                                                                                //
                return _this.error(e.message);                                                                        //
              }                                                                                                       //
            };                                                                                                        //
          })(this)                                                                                                    //
        });                                                                                                           //
        this.subscriptions.order.push(page);                                                                          // 962
        return this.subscriptions.length++;                                                                           //
      }), this, page));                                                                                               //
    }                                                                                                                 //
  };                                                                                                                  //
                                                                                                                      //
  Pages.prototype.onPage = function(page) {                                                                           // 3
    this.log("Received page " + page);                                                                                // 984
    this.beforeFirstReady = false;                                                                                    // 984
    this.logResponse(page);                                                                                           // 984
    this.ready(page);                                                                                                 // 984
    if (this.infinite) {                                                                                              // 988
      this.lastPage = page;                                                                                           // 989
    }                                                                                                                 //
    this.countPages();                                                                                                // 984
    return this.checkQueue();                                                                                         //
  };                                                                                                                  //
                                                                                                                      //
  return Pages;                                                                                                       //
                                                                                                                      //
})();                                                                                                                 //
                                                                                                                      //
Meteor.Pagination = Pages;                                                                                            // 1
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['alethes:pages'] = {};

})();

//# sourceMappingURL=alethes_pages.js.map
