(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var check = Package.check.check;
var Match = Package.check.Match;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/todda00_friendly-slugs/slugs.coffee.js                                                                 //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Mongo, slugify, stringToNested;                                                                                // 2
                                                                                                                   //
if (typeof Mongo === "undefined") {                                                                                // 2
  Mongo = {};                                                                                                      // 3
  Mongo.Collection = Meteor.Collection;                                                                            // 3
}                                                                                                                  //
                                                                                                                   //
Mongo.Collection.prototype.friendlySlugs = function(options) {                                                     // 2
  var collection, fsDebug, runSlug;                                                                                // 7
  if (options == null) {                                                                                           //
    options = {};                                                                                                  //
  }                                                                                                                //
  collection = this;                                                                                               // 7
  if (!_.isArray(options)) {                                                                                       // 9
    options = [options];                                                                                           // 10
  }                                                                                                                //
  _.each(options, function(opts) {                                                                                 // 7
    var defaults, fields;                                                                                          // 13
    if (_.isString(opts)) {                                                                                        // 13
      opts = {                                                                                                     // 14
        slugFrom: [opts]                                                                                           // 14
      };                                                                                                           //
    }                                                                                                              //
    if (_.isString(opts.slugFrom)) {                                                                               // 17
      opts.slugFrom = [opts.slugFrom];                                                                             // 17
    }                                                                                                              //
    defaults = {                                                                                                   // 13
      slugFrom: ['name'],                                                                                          // 20
      slugField: 'slug',                                                                                           // 20
      distinct: true,                                                                                              // 20
      distinctUpTo: [],                                                                                            // 20
      updateSlug: true,                                                                                            // 20
      createOnUpdate: true,                                                                                        // 20
      maxLength: 0,                                                                                                // 20
      debug: false,                                                                                                // 20
      transliteration: [                                                                                           // 20
        {                                                                                                          //
          from: 'àáâäåãа',                                                                                         // 29
          to: 'a'                                                                                                  // 29
        }, {                                                                                                       //
          from: 'б',                                                                                               // 30
          to: 'b'                                                                                                  // 30
        }, {                                                                                                       //
          from: 'ç',                                                                                               // 31
          to: 'c'                                                                                                  // 31
        }, {                                                                                                       //
          from: 'д',                                                                                               // 32
          to: 'd'                                                                                                  // 32
        }, {                                                                                                       //
          from: 'èéêëẽэе',                                                                                         // 33
          to: 'e'                                                                                                  // 33
        }, {                                                                                                       //
          from: 'ф',                                                                                               // 34
          to: 'f'                                                                                                  // 34
        }, {                                                                                                       //
          from: 'г',                                                                                               // 35
          to: 'g'                                                                                                  // 35
        }, {                                                                                                       //
          from: 'х',                                                                                               // 36
          to: 'h'                                                                                                  // 36
        }, {                                                                                                       //
          from: 'ìíîïи',                                                                                           // 37
          to: 'i'                                                                                                  // 37
        }, {                                                                                                       //
          from: 'к',                                                                                               // 38
          to: 'k'                                                                                                  // 38
        }, {                                                                                                       //
          from: 'л',                                                                                               // 39
          to: 'l'                                                                                                  // 39
        }, {                                                                                                       //
          from: 'м',                                                                                               // 40
          to: 'm'                                                                                                  // 40
        }, {                                                                                                       //
          from: 'ñн',                                                                                              // 41
          to: 'n'                                                                                                  // 41
        }, {                                                                                                       //
          from: 'òóôöõо',                                                                                          // 42
          to: 'o'                                                                                                  // 42
        }, {                                                                                                       //
          from: 'п',                                                                                               // 43
          to: 'p'                                                                                                  // 43
        }, {                                                                                                       //
          from: 'р',                                                                                               // 44
          to: 'r'                                                                                                  // 44
        }, {                                                                                                       //
          from: 'с',                                                                                               // 45
          to: 's'                                                                                                  // 45
        }, {                                                                                                       //
          from: 'т',                                                                                               // 46
          to: 't'                                                                                                  // 46
        }, {                                                                                                       //
          from: 'ùúûüу',                                                                                           // 47
          to: 'u'                                                                                                  // 47
        }, {                                                                                                       //
          from: 'в',                                                                                               // 48
          to: 'v'                                                                                                  // 48
        }, {                                                                                                       //
          from: 'йы',                                                                                              // 49
          to: 'y'                                                                                                  // 49
        }, {                                                                                                       //
          from: 'з',                                                                                               // 50
          to: 'z'                                                                                                  // 50
        }, {                                                                                                       //
          from: 'æ',                                                                                               // 51
          to: 'ae'                                                                                                 // 51
        }, {                                                                                                       //
          from: 'ч',                                                                                               // 52
          to: 'ch'                                                                                                 // 52
        }, {                                                                                                       //
          from: 'щ',                                                                                               // 53
          to: 'sch'                                                                                                // 53
        }, {                                                                                                       //
          from: 'ш',                                                                                               // 54
          to: 'sh'                                                                                                 // 54
        }, {                                                                                                       //
          from: 'ц',                                                                                               // 55
          to: 'ts'                                                                                                 // 55
        }, {                                                                                                       //
          from: 'я',                                                                                               // 56
          to: 'ya'                                                                                                 // 56
        }, {                                                                                                       //
          from: 'ю',                                                                                               // 57
          to: 'yu'                                                                                                 // 57
        }, {                                                                                                       //
          from: 'ж',                                                                                               // 58
          to: 'zh'                                                                                                 // 58
        }, {                                                                                                       //
          from: 'ъь',                                                                                              // 59
          to: ''                                                                                                   // 59
        }                                                                                                          //
      ]                                                                                                            //
    };                                                                                                             //
    _.defaults(opts, defaults);                                                                                    // 13
    fields = {                                                                                                     // 13
      slugFrom: Array,                                                                                             // 65
      slugField: String,                                                                                           // 65
      distinct: Boolean,                                                                                           // 65
      createOnUpdate: Boolean,                                                                                     // 65
      maxLength: Number,                                                                                           // 65
      debug: Boolean                                                                                               // 65
    };                                                                                                             //
    if (typeof opts.updateSlug !== "function") {                                                                   // 72
      if (opts.updateSlug) {                                                                                       // 73
        opts.updateSlug = function() {                                                                             // 74
          return true;                                                                                             //
        };                                                                                                         //
      } else {                                                                                                     //
        opts.updateSlug = function() {                                                                             // 76
          return false;                                                                                            //
        };                                                                                                         //
      }                                                                                                            //
    }                                                                                                              //
    check(opts, Match.ObjectIncluding(fields));                                                                    // 13
    collection.before.insert(function(userId, doc) {                                                               // 13
      fsDebug(opts, 'before.insert function');                                                                     // 82
      runSlug(doc, opts);                                                                                          // 82
    });                                                                                                            //
    collection.before.update(function(userId, doc, fieldNames, modifier, options) {                                // 13
      var cleanModifier, cont, slugFromChanged;                                                                    // 87
      fsDebug(opts, 'before.update function');                                                                     // 87
      cleanModifier = function() {                                                                                 // 87
        if (_.isEmpty(modifier.$set)) {                                                                            // 90
          return delete modifier.$set;                                                                             //
        }                                                                                                          //
      };                                                                                                           //
      options = options || {};                                                                                     // 87
      if (options.multi) {                                                                                         // 94
        fsDebug(opts, "multi doc update attempted, can't update slugs this way, leaving.");                        // 95
        return true;                                                                                               // 96
      }                                                                                                            //
      modifier = modifier || {};                                                                                   // 87
      modifier.$set = modifier.$set || {};                                                                         // 87
      cont = false;                                                                                                // 87
      _.each(opts.slugFrom, function(slugFrom) {                                                                   // 87
        if (stringToNested(doc, slugFrom) || (modifier.$set[slugFrom] != null) || stringToNested(modifier.$set, slugFrom)) {
          return cont = true;                                                                                      //
        }                                                                                                          //
      });                                                                                                          //
      if (!cont) {                                                                                                 // 105
        fsDebug(opts, "no slugFrom fields are present (either before or after update), leaving.");                 // 106
        cleanModifier();                                                                                           // 106
        return true;                                                                                               // 108
      }                                                                                                            //
      slugFromChanged = false;                                                                                     // 87
      _.each(opts.slugFrom, function(slugFrom) {                                                                   // 87
        var docFrom;                                                                                               // 113
        if ((modifier.$set[slugFrom] != null) || stringToNested(modifier.$set, slugFrom)) {                        // 113
          docFrom = stringToNested(doc, slugFrom);                                                                 // 114
          if ((docFrom !== modifier.$set[slugFrom]) && (docFrom !== stringToNested(modifier.$set, slugFrom))) {    // 115
            return slugFromChanged = true;                                                                         //
          }                                                                                                        //
        }                                                                                                          //
      });                                                                                                          //
      fsDebug(opts, slugFromChanged, 'slugFromChanged');                                                           // 87
      if (!stringToNested(doc, opts.slugField) && opts.createOnUpdate) {                                           // 121
        fsDebug(opts, 'Update: Slug Field is missing and createOnUpdate is set to true');                          // 122
        if (slugFromChanged) {                                                                                     // 124
          fsDebug(opts, 'slugFrom field has changed, runSlug with modifier');                                      // 125
          runSlug(doc, opts, modifier);                                                                            // 125
        } else {                                                                                                   //
          fsDebug(opts, 'runSlug to create');                                                                      // 129
          runSlug(doc, opts, modifier, true);                                                                      // 129
          cleanModifier();                                                                                         // 129
          return true;                                                                                             // 132
        }                                                                                                          //
      } else {                                                                                                     //
        if ((typeof opts.updateSlug === "function" ? opts.updateSlug(doc, modifier) : void 0) === false) {         // 136
          fsDebug(opts, 'updateSlug is false, nothing to do.');                                                    // 137
          cleanModifier();                                                                                         // 137
          return true;                                                                                             // 139
        }                                                                                                          //
        if (!slugFromChanged) {                                                                                    // 142
          fsDebug(opts, 'slugFrom field has not changed, nothing to do.');                                         // 143
          cleanModifier();                                                                                         // 143
          return true;                                                                                             // 145
        }                                                                                                          //
        runSlug(doc, opts, modifier);                                                                              // 136
        cleanModifier();                                                                                           // 136
        return true;                                                                                               // 150
      }                                                                                                            //
      cleanModifier();                                                                                             // 87
      return true;                                                                                                 // 153
    });                                                                                                            //
  });                                                                                                              //
  runSlug = function(doc, opts, modifier, create) {                                                                // 7
    var baseField, combineFrom, defaultSlugGenerator, f, fieldSelector, finalSlug, from, i, index, indexField, limitSelector, ref, result, slugBase, slugGenerator, sortSelector;
    if (modifier == null) {                                                                                        //
      modifier = false;                                                                                            //
    }                                                                                                              //
    if (create == null) {                                                                                          //
      create = false;                                                                                              //
    }                                                                                                              //
    fsDebug(opts, 'Begin runSlug');                                                                                // 156
    fsDebug(opts, opts, 'Options');                                                                                // 156
    fsDebug(opts, modifier, 'Modifier');                                                                           // 156
    fsDebug(opts, create, 'Create');                                                                               // 156
    combineFrom = function(doc, fields, modifierDoc) {                                                             // 156
      var fromValues;                                                                                              // 162
      fromValues = [];                                                                                             // 162
      _.each(fields, function(f) {                                                                                 // 162
        var val;                                                                                                   // 164
        if (modifierDoc != null) {                                                                                 // 164
          if (stringToNested(modifierDoc, f)) {                                                                    // 165
            val = stringToNested(modifierDoc, f);                                                                  // 166
          } else {                                                                                                 //
            val = stringToNested(doc, f);                                                                          // 168
          }                                                                                                        //
        } else {                                                                                                   //
          val = stringToNested(doc, f);                                                                            // 170
        }                                                                                                          //
        if (val) {                                                                                                 // 171
          return fromValues.push(val);                                                                             //
        }                                                                                                          //
      });                                                                                                          //
      if (fromValues.length === 0) {                                                                               // 172
        return false;                                                                                              // 172
      }                                                                                                            //
      return fromValues.join('-');                                                                                 // 173
    };                                                                                                             //
    from = create || !modifier ? combineFrom(doc, opts.slugFrom) : combineFrom(doc, opts.slugFrom, modifier.$set);
    if (from === false) {                                                                                          // 177
      fsDebug(opts, "Nothing to slug from, leaving.");                                                             // 178
      return true;                                                                                                 // 179
    }                                                                                                              //
    fsDebug(opts, from, 'Slugging From');                                                                          // 156
    slugBase = slugify(from, opts.transliteration, opts.maxLength);                                                // 156
    if (!slugBase) {                                                                                               // 184
      return false;                                                                                                // 184
    }                                                                                                              //
    fsDebug(opts, slugBase, 'SlugBase before reduction');                                                          // 156
    if (opts.distinct) {                                                                                           // 188
      slugBase = slugBase.replace(/(-\d+)+$/, '');                                                                 // 191
      fsDebug(opts, slugBase, 'SlugBase after reduction');                                                         // 191
      baseField = "friendlySlugs." + opts.slugField + ".base";                                                     // 191
      indexField = "friendlySlugs." + opts.slugField + ".index";                                                   // 191
      fieldSelector = {};                                                                                          // 191
      fieldSelector[baseField] = slugBase;                                                                         // 191
      i = 0;                                                                                                       // 191
      while (i < opts.distinctUpTo.length) {                                                                       // 201
        f = opts.distinctUpTo[i];                                                                                  // 202
        fieldSelector[f] = doc[f];                                                                                 // 202
        i++;                                                                                                       // 202
      }                                                                                                            //
      sortSelector = {};                                                                                           // 191
      sortSelector[indexField] = -1;                                                                               // 191
      limitSelector = {};                                                                                          // 191
      limitSelector[indexField] = 1;                                                                               // 191
      result = collection.findOne(fieldSelector, {                                                                 // 191
        sort: sortSelector,                                                                                        // 213
        fields: limitSelector,                                                                                     // 213
        limit: 1                                                                                                   // 213
      });                                                                                                          //
      fsDebug(opts, result, 'Highest indexed base found');                                                         // 191
      if ((result == null) || (result.friendlySlugs == null) || (result.friendlySlugs[opts.slugField] == null) || (result.friendlySlugs[opts.slugField].index == null)) {
        index = 0;                                                                                                 // 221
      } else {                                                                                                     //
        index = result.friendlySlugs[opts.slugField].index + 1;                                                    // 223
      }                                                                                                            //
      defaultSlugGenerator = function(slugBase, index) {                                                           // 191
        if (index === 0) {                                                                                         // 226
          return slugBase;                                                                                         //
        } else {                                                                                                   //
          return slugBase + '-' + index;                                                                           //
        }                                                                                                          //
      };                                                                                                           //
      slugGenerator = (ref = opts.slugGenerator) != null ? ref : defaultSlugGenerator;                             // 191
      finalSlug = slugGenerator(slugBase, index);                                                                  // 191
    } else {                                                                                                       //
      index = false;                                                                                               // 234
      finalSlug = slugBase;                                                                                        // 234
    }                                                                                                              //
    fsDebug(opts, finalSlug, 'finalSlug');                                                                         // 156
    if (modifier || create) {                                                                                      // 239
      fsDebug(opts, 'Set to modify or create slug on update');                                                     // 240
      modifier = modifier || {};                                                                                   // 240
      modifier.$set = modifier.$set || {};                                                                         // 240
      modifier.$set.friendlySlugs = doc.friendlySlugs || {};                                                       // 240
      modifier.$set.friendlySlugs[opts.slugField] = modifier.$set.friendlySlugs[opts.slugField] || {};             // 240
      modifier.$set.friendlySlugs[opts.slugField].base = slugBase;                                                 // 240
      modifier.$set.friendlySlugs[opts.slugField].index = index;                                                   // 240
      modifier.$set[opts.slugField] = finalSlug;                                                                   // 240
      fsDebug(opts, modifier, 'Final Modifier');                                                                   // 240
    } else {                                                                                                       //
      fsDebug(opts, 'Set to update');                                                                              // 251
      doc.friendlySlugs = doc.friendlySlugs || {};                                                                 // 251
      doc.friendlySlugs[opts.slugField] = doc.friendlySlugs[opts.slugField] || {};                                 // 251
      doc.friendlySlugs[opts.slugField].base = slugBase;                                                           // 251
      doc.friendlySlugs[opts.slugField].index = index;                                                             // 251
      doc[opts.slugField] = finalSlug;                                                                             // 251
      fsDebug(opts, doc, 'Final Doc');                                                                             // 251
    }                                                                                                              //
    return true;                                                                                                   // 258
  };                                                                                                               //
  return fsDebug = function(opts, item, label) {                                                                   //
    if (label == null) {                                                                                           //
      label = '';                                                                                                  //
    }                                                                                                              //
    if (!opts.debug) {                                                                                             // 261
      return;                                                                                                      // 261
    }                                                                                                              //
    if (typeof item === 'object') {                                                                                // 262
      console.log("friendlySlugs DEBUG: " + label + '↓');                                                          // 263
      return console.log(item);                                                                                    //
    } else {                                                                                                       //
      return console.log("friendlySlugs DEBUG: " + label + '= ' + item);                                           //
    }                                                                                                              //
  };                                                                                                               //
};                                                                                                                 // 6
                                                                                                                   //
slugify = function(text, transliteration, maxLength) {                                                             // 2
  var lastDash, slug;                                                                                              // 269
  if (text == null) {                                                                                              // 269
    return false;                                                                                                  // 269
  }                                                                                                                //
  if (text.length < 1) {                                                                                           // 270
    return false;                                                                                                  // 270
  }                                                                                                                //
  text = text.toString().toLowerCase();                                                                            // 269
  _.each(transliteration, function(item) {                                                                         // 269
    return text = text.replace(new RegExp('[' + item.from + ']', 'g'), item.to);                                   //
  });                                                                                                              //
  slug = text.replace(/'/g, '').replace(/[^0-9a-z-]/g, '-').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
  if (maxLength > 0 && slug.length > maxLength) {                                                                  // 280
    lastDash = slug.substring(0, maxLength).lastIndexOf('-');                                                      // 281
    slug = slug.substring(0, lastDash);                                                                            // 281
  }                                                                                                                //
  return slug;                                                                                                     // 283
};                                                                                                                 // 268
                                                                                                                   //
stringToNested = function(obj, path) {                                                                             // 2
  var parts;                                                                                                       // 286
  parts = path.split(".");                                                                                         // 286
  if (parts.length === 1) {                                                                                        // 287
    if ((obj != null) && (obj[parts[0]] != null)) {                                                                // 288
      return obj[parts[0]];                                                                                        // 289
    } else {                                                                                                       //
      return false;                                                                                                // 291
    }                                                                                                              //
  }                                                                                                                //
  return stringToNested(obj[parts[0]], parts.slice(1).join("."));                                                  // 292
};                                                                                                                 // 285
                                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['todda00:friendly-slugs'] = {};

})();

//# sourceMappingURL=todda00_friendly-slugs.js.map
