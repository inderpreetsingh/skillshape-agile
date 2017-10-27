(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var FS = Package['cfs:base-package'].FS;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var check = Package.check.check;
var Match = Package.check.Match;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var EJSON = Package.ejson.EJSON;
var EventEmitter = Package['raix:eventemitter'].EventEmitter;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var _storageAdapters;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cfs_storage-adapter/packages/cfs_storage-adapter.js                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/cfs:storage-adapter/storageAdapter.server.js                                                         //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
/* global FS, _storageAdapters:true, EventEmitter */                                                             // 1
                                                                                                                 // 2
// #############################################################################                                 // 3
//                                                                                                               // 4
// STORAGE ADAPTER                                                                                               // 5
//                                                                                                               // 6
// #############################################################################                                 // 7
_storageAdapters = {};                                                                                           // 8
                                                                                                                 // 9
FS.StorageAdapter = function(storeName, options, api) {                                                          // 10
  var self = this, fileKeyMaker;                                                                                 // 11
  options = options || {};                                                                                       // 12
                                                                                                                 // 13
  // If storeName is the only argument, a string and the SA already found                                        // 14
  // we will just return that SA                                                                                 // 15
  if (arguments.length === 1 && storeName === '' + storeName &&                                                  // 16
          typeof _storageAdapters[storeName] !== 'undefined')                                                    // 17
    return _storageAdapters[storeName];                                                                          // 18
                                                                                                                 // 19
  // Verify that the storage adapter defines all the necessary API methods                                       // 20
  if (typeof api === 'undefined') {                                                                              // 21
    throw new Error('FS.StorageAdapter please define an api');                                                   // 22
  }                                                                                                              // 23
                                                                                                                 // 24
  FS.Utility.each('fileKey,remove,typeName,createReadStream,createWriteStream'.split(','), function(name) {      // 25
    if (typeof api[name] === 'undefined') {                                                                      // 26
      throw new Error('FS.StorageAdapter please define an api. "' + name + '" ' + (api.typeName || ''));         // 27
    }                                                                                                            // 28
  });                                                                                                            // 29
                                                                                                                 // 30
  // Create an internal namespace, starting a name with underscore is only                                       // 31
  // allowed for stores marked with options.internal === true                                                    // 32
  if (options.internal !== true && storeName[0] === '_') {                                                       // 33
    throw new Error('A storage adapter name may not begin with "_"');                                            // 34
  }                                                                                                              // 35
                                                                                                                 // 36
  // store reference for easy lookup by storeName                                                                // 37
  if (typeof _storageAdapters[storeName] !== 'undefined') {                                                      // 38
    throw new Error('Storage name already exists: "' + storeName + '"');                                         // 39
  } else {                                                                                                       // 40
    _storageAdapters[storeName] = self;                                                                          // 41
  }                                                                                                              // 42
                                                                                                                 // 43
  // User can customize the file key generation function                                                         // 44
  if (typeof options.fileKeyMaker === "function") {                                                              // 45
    fileKeyMaker = options.fileKeyMaker;                                                                         // 46
  } else {                                                                                                       // 47
    fileKeyMaker = api.fileKey;                                                                                  // 48
  }                                                                                                              // 49
                                                                                                                 // 50
  // User can provide a function to adjust the fileObj                                                           // 51
  // before it is written to the store.                                                                          // 52
  var beforeWrite = options.beforeWrite;                                                                         // 53
                                                                                                                 // 54
  // extend self with options and other info                                                                     // 55
  FS.Utility.extend(this, options, {                                                                             // 56
    name: storeName,                                                                                             // 57
    typeName: api.typeName                                                                                       // 58
  });                                                                                                            // 59
                                                                                                                 // 60
  // Create a nicer abstracted adapter interface                                                                 // 61
  self.adapter = {};                                                                                             // 62
                                                                                                                 // 63
  self.adapter.fileKey = function(fileObj) {                                                                     // 64
    return fileKeyMaker(fileObj);                                                                                // 65
  };                                                                                                             // 66
                                                                                                                 // 67
  // Return readable stream for fileKey                                                                          // 68
  self.adapter.createReadStreamForFileKey = function(fileKey, options) {                                         // 69
    if (FS.debug) console.log('createReadStreamForFileKey ' + storeName);                                        // 70
    return FS.Utility.safeStream( api.createReadStream(fileKey, options) );                                      // 71
  };                                                                                                             // 72
                                                                                                                 // 73
  // Return readable stream for fileObj                                                                          // 74
  self.adapter.createReadStream = function(fileObj, options) {                                                   // 75
    if (FS.debug) console.log('createReadStream ' + storeName);                                                  // 76
    if (self.internal) {                                                                                         // 77
      // Internal stores take a fileKey                                                                          // 78
      return self.adapter.createReadStreamForFileKey(fileObj, options);                                          // 79
    }                                                                                                            // 80
    return FS.Utility.safeStream( self._transform.createReadStream(fileObj, options) );                          // 81
  };                                                                                                             // 82
                                                                                                                 // 83
  function logEventsForStream(stream) {                                                                          // 84
    if (FS.debug) {                                                                                              // 85
      stream.on('stored', function() {                                                                           // 86
        console.log('-----------STORED STREAM', storeName);                                                      // 87
      });                                                                                                        // 88
                                                                                                                 // 89
      stream.on('close', function() {                                                                            // 90
        console.log('-----------CLOSE STREAM', storeName);                                                       // 91
      });                                                                                                        // 92
                                                                                                                 // 93
      stream.on('end', function() {                                                                              // 94
        console.log('-----------END STREAM', storeName);                                                         // 95
      });                                                                                                        // 96
                                                                                                                 // 97
      stream.on('finish', function() {                                                                           // 98
        console.log('-----------FINISH STREAM', storeName);                                                      // 99
      });                                                                                                        // 100
                                                                                                                 // 101
      stream.on('error', function(error) {                                                                       // 102
        console.log('-----------ERROR STREAM', storeName, error && (error.message || error.code));               // 103
      });                                                                                                        // 104
    }                                                                                                            // 105
  }                                                                                                              // 106
                                                                                                                 // 107
  // Return writeable stream for fileKey                                                                         // 108
  self.adapter.createWriteStreamForFileKey = function(fileKey, options) {                                        // 109
    if (FS.debug) console.log('createWriteStreamForFileKey ' + storeName);                                       // 110
    var writeStream = FS.Utility.safeStream( api.createWriteStream(fileKey, options) );                          // 111
                                                                                                                 // 112
    logEventsForStream(writeStream);                                                                             // 113
                                                                                                                 // 114
    return writeStream;                                                                                          // 115
  };                                                                                                             // 116
                                                                                                                 // 117
  // Return writeable stream for fileObj                                                                         // 118
  self.adapter.createWriteStream = function(fileObj, options) {                                                  // 119
    if (FS.debug) console.log('createWriteStream ' + storeName + ', internal: ' + !!self.internal);              // 120
                                                                                                                 // 121
    if (self.internal) {                                                                                         // 122
      // Internal stores take a fileKey                                                                          // 123
      return self.adapter.createWriteStreamForFileKey(fileObj, options);                                         // 124
    }                                                                                                            // 125
                                                                                                                 // 126
    // If we haven't set name, type, or size for this version yet,                                               // 127
    // set it to same values as original version. We don't save                                                  // 128
    // these to the DB right away because they might be changed                                                  // 129
    // in a transformWrite function.                                                                             // 130
    if (!fileObj.name({store: storeName})) {                                                                     // 131
      fileObj.name(fileObj.name(), {store: storeName, save: false});                                             // 132
    }                                                                                                            // 133
    if (!fileObj.type({store: storeName})) {                                                                     // 134
      fileObj.type(fileObj.type(), {store: storeName, save: false});                                             // 135
    }                                                                                                            // 136
    if (!fileObj.size({store: storeName})) {                                                                     // 137
      fileObj.size(fileObj.size(), {store: storeName, save: false});                                             // 138
    }                                                                                                            // 139
                                                                                                                 // 140
    // Call user function to adjust file metadata for this store.                                                // 141
    // We support updating name, extension, and/or type based on                                                 // 142
    // info returned in an object. Or `fileObj` could be                                                         // 143
    // altered directly within the beforeWrite function.                                                         // 144
    if (beforeWrite) {                                                                                           // 145
      var fileChanges = beforeWrite(fileObj);                                                                    // 146
      if (typeof fileChanges === "object") {                                                                     // 147
        if (fileChanges.extension) {                                                                             // 148
          fileObj.extension(fileChanges.extension, {store: storeName, save: false});                             // 149
        } else if (fileChanges.name) {                                                                           // 150
          fileObj.name(fileChanges.name, {store: storeName, save: false});                                       // 151
        }                                                                                                        // 152
        if (fileChanges.type) {                                                                                  // 153
          fileObj.type(fileChanges.type, {store: storeName, save: false});                                       // 154
        }                                                                                                        // 155
      }                                                                                                          // 156
    }                                                                                                            // 157
                                                                                                                 // 158
    var writeStream = FS.Utility.safeStream( self._transform.createWriteStream(fileObj, options) );              // 159
                                                                                                                 // 160
    logEventsForStream(writeStream);                                                                             // 161
                                                                                                                 // 162
    // Its really only the storage adapter who knows if the file is uploaded                                     // 163
    //                                                                                                           // 164
    // We have to use our own event making sure the storage process is completed                                 // 165
    // this is mainly                                                                                            // 166
    writeStream.safeOn('stored', function(result) {                                                              // 167
      if (typeof result.fileKey === 'undefined') {                                                               // 168
        throw new Error('SA ' + storeName + ' type ' + api.typeName + ' did not return a fileKey');              // 169
      }                                                                                                          // 170
      if (FS.debug) console.log('SA', storeName, 'stored', result.fileKey);                                      // 171
      // Set the fileKey                                                                                         // 172
      fileObj.copies[storeName].key = result.fileKey;                                                            // 173
                                                                                                                 // 174
      // Update the size, as provided by the SA, in case it was changed by stream transformation                 // 175
      if (typeof result.size === "number") {                                                                     // 176
        fileObj.copies[storeName].size = result.size;                                                            // 177
      }                                                                                                          // 178
                                                                                                                 // 179
      // Set last updated time, either provided by SA or now                                                     // 180
      fileObj.copies[storeName].updatedAt = result.storedAt || new Date();                                       // 181
                                                                                                                 // 182
      // If the file object copy havent got a createdAt then set this                                            // 183
      if (typeof fileObj.copies[storeName].createdAt === 'undefined') {                                          // 184
        fileObj.copies[storeName].createdAt = fileObj.copies[storeName].updatedAt;                               // 185
      }                                                                                                          // 186
                                                                                                                 // 187
      fileObj._saveChanges(storeName);                                                                           // 188
                                                                                                                 // 189
      // There is code in transform that may have set the original file size, too.                               // 190
      fileObj._saveChanges('_original');                                                                         // 191
    });                                                                                                          // 192
                                                                                                                 // 193
    // Emit events from SA                                                                                       // 194
    writeStream.once('stored', function(/*result*/) {                                                            // 195
      // XXX Because of the way stores inherit from SA, this will emit on every store.                           // 196
      // Maybe need to rewrite the way we inherit from SA?                                                       // 197
      var emitted = self.emit('stored', storeName, fileObj);                                                     // 198
      if (FS.debug && !emitted) {                                                                                // 199
        console.log(fileObj.name() + ' was successfully stored in the ' + storeName + ' store. You are seeing this informational message because you enabled debugging and you have not defined any listeners for the "stored" event on this store.');
      }                                                                                                          // 201
    });                                                                                                          // 202
                                                                                                                 // 203
    writeStream.on('error', function(error) {                                                                    // 204
      // XXX We could wrap and clarify error                                                                     // 205
      // XXX Because of the way stores inherit from SA, this will emit on every store.                           // 206
      // Maybe need to rewrite the way we inherit from SA?                                                       // 207
      var emitted = self.emit('error', storeName, error, fileObj);                                               // 208
      if (FS.debug && !emitted) {                                                                                // 209
        console.log(error);                                                                                      // 210
      }                                                                                                          // 211
    });                                                                                                          // 212
                                                                                                                 // 213
    return writeStream;                                                                                          // 214
  };                                                                                                             // 215
                                                                                                                 // 216
  //internal                                                                                                     // 217
  self._removeAsync = function(fileKey, callback) {                                                              // 218
    // Remove the file from the store                                                                            // 219
    api.remove.call(self, fileKey, callback);                                                                    // 220
  };                                                                                                             // 221
                                                                                                                 // 222
  /**                                                                                                            // 223
   * @method FS.StorageAdapter.prototype.remove                                                                  // 224
   * @public                                                                                                     // 225
   * @param {FS.File} fsFile The FS.File instance to be stored.                                                  // 226
   * @param {Function} [callback] If not provided, will block and return true or false                           // 227
   *                                                                                                             // 228
   * Attempts to remove a file from the store. Returns true if removed or not                                    // 229
   * found, or false if the file couldn't be removed.                                                            // 230
   */                                                                                                            // 231
  self.adapter.remove = function(fileObj, callback) {                                                            // 232
    if (FS.debug) console.log("---SA REMOVE");                                                                   // 233
                                                                                                                 // 234
    // Get the fileKey                                                                                           // 235
    var fileKey = (fileObj instanceof FS.File) ? self.adapter.fileKey(fileObj) : fileObj;                        // 236
                                                                                                                 // 237
    if (callback) {                                                                                              // 238
      return self._removeAsync(fileKey, FS.Utility.safeCallback(callback));                                      // 239
    } else {                                                                                                     // 240
      return Meteor._wrapAsync(self._removeAsync)(fileKey);                                                      // 241
    }                                                                                                            // 242
  };                                                                                                             // 243
                                                                                                                 // 244
  self.remove = function(fileObj, callback) {                                                                    // 245
    // Add deprecation note                                                                                      // 246
    console.warn('Storage.remove is deprecating, use "Storage.adapter.remove"');                                 // 247
    return self.adapter.remove(fileObj, callback);                                                               // 248
  };                                                                                                             // 249
                                                                                                                 // 250
  if (typeof api.init === 'function') {                                                                          // 251
    Meteor._wrapAsync(api.init.bind(self))();                                                                    // 252
  }                                                                                                              // 253
                                                                                                                 // 254
  // This supports optional transformWrite and transformRead                                                     // 255
  self._transform = new FS.Transform({                                                                           // 256
    adapter: self.adapter,                                                                                       // 257
    // Optional transformation functions:                                                                        // 258
    transformWrite: options.transformWrite,                                                                      // 259
    transformRead: options.transformRead                                                                         // 260
  });                                                                                                            // 261
                                                                                                                 // 262
};                                                                                                               // 263
                                                                                                                 // 264
Npm.require('util').inherits(FS.StorageAdapter, EventEmitter);                                                   // 265
                                                                                                                 // 266
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/cfs:storage-adapter/transform.server.js                                                              //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
/* global FS, gm */                                                                                              // 1
                                                                                                                 // 2
var PassThrough = Npm.require('stream').PassThrough;                                                             // 3
var lengthStream = Npm.require('length-stream');                                                                 // 4
                                                                                                                 // 5
FS.Transform = function(options) {                                                                               // 6
  var self = this;                                                                                               // 7
                                                                                                                 // 8
  options = options || {};                                                                                       // 9
                                                                                                                 // 10
  if (!(self instanceof FS.Transform))                                                                           // 11
    throw new Error('FS.Transform must be called with the "new" keyword');                                       // 12
                                                                                                                 // 13
  if (!options.adapter)                                                                                          // 14
    throw new Error('Transform expects option.adapter to be a storage adapter');                                 // 15
                                                                                                                 // 16
  self.storage = options.adapter;                                                                                // 17
                                                                                                                 // 18
  // Fetch the transformation functions if any                                                                   // 19
  self.transformWrite = options.transformWrite;                                                                  // 20
  self.transformRead = options.transformRead;                                                                    // 21
};                                                                                                               // 22
                                                                                                                 // 23
// Allow packages to add scope                                                                                   // 24
FS.Transform.scope = {                                                                                           // 25
// Deprecate gm scope:                                                                                           // 26
  gm: function(source, height, color) {                                                                          // 27
    console.warn('Deprecation notice: `this.gm` is deprecating in favour of the general global `gm` scope');     // 28
    if (typeof gm !== 'function')                                                                                // 29
      throw new Error('No graphicsmagick package installed, `gm` not found in scope, eg. `cfs-graphicsmagick`'); // 30
    return gm(source, height, color);                                                                            // 31
  }                                                                                                              // 32
// EO Deprecate gm scope                                                                                         // 33
};                                                                                                               // 34
                                                                                                                 // 35
// The transformation stream triggers an "stored" event when data is stored into                                 // 36
// the storage adapter                                                                                           // 37
FS.Transform.prototype.createWriteStream = function(fileObj) {                                                   // 38
  var self = this;                                                                                               // 39
                                                                                                                 // 40
  // Get the file key                                                                                            // 41
  var fileKey = self.storage.fileKey(fileObj);                                                                   // 42
                                                                                                                 // 43
  // Rig write stream                                                                                            // 44
  var destinationStream = self.storage.createWriteStreamForFileKey(fileKey, {                                    // 45
    // Not all SA's can set these options and cfs dont depend on setting these                                   // 46
    // but its nice if other systems are accessing the SA that some of the data                                  // 47
    // is also available to those                                                                                // 48
    aliases: [fileObj.name()],                                                                                   // 49
    contentType: fileObj.type(),                                                                                 // 50
    metadata: fileObj.metadata                                                                                   // 51
  });                                                                                                            // 52
                                                                                                                 // 53
  // Pass through transformWrite function if provided                                                            // 54
  if (typeof self.transformWrite === 'function') {                                                               // 55
                                                                                                                 // 56
    destinationStream = addPassThrough(destinationStream, function (ptStream, originalStream) {                  // 57
      // Rig transform                                                                                           // 58
      try {                                                                                                      // 59
        self.transformWrite.call(FS.Transform.scope, fileObj, ptStream, originalStream);                         // 60
        // XXX: If the transform function returns a buffer should we stream that?                                // 61
      } catch(err) {                                                                                             // 62
        // We emit an error - should we throw an error?                                                          // 63
        console.warn('FS.Transform.createWriteStream transform function failed, Error: ');                       // 64
        throw err;                                                                                               // 65
      }                                                                                                          // 66
    });                                                                                                          // 67
                                                                                                                 // 68
  }                                                                                                              // 69
                                                                                                                 // 70
  // If original doesn't have size, add another PassThrough to get and set the size.                             // 71
  // This will run on size=0, too, which is OK.                                                                  // 72
  // NOTE: This must come AFTER the transformWrite code block above. This might seem                             // 73
  // confusing, but by coming after it, this will actually be executed BEFORE the user's                         // 74
  // transform, which is what we need in order to be sure we get the original file                               // 75
  // size and not the transformed file size.                                                                     // 76
  if (!fileObj.size()) {                                                                                         // 77
    destinationStream = addPassThrough(destinationStream, function (ptStream, originalStream) {                  // 78
      var lstream = lengthStream(function (fileSize) {                                                           // 79
        fileObj.size(fileSize, {save: false});                                                                   // 80
      });                                                                                                        // 81
                                                                                                                 // 82
      ptStream.pipe(lstream).pipe(originalStream);                                                               // 83
    });                                                                                                          // 84
  }                                                                                                              // 85
                                                                                                                 // 86
  return destinationStream;                                                                                      // 87
};                                                                                                               // 88
                                                                                                                 // 89
FS.Transform.prototype.createReadStream = function(fileObj, options) {                                           // 90
  var self = this;                                                                                               // 91
                                                                                                                 // 92
  // Get the file key                                                                                            // 93
  var fileKey = self.storage.fileKey(fileObj);                                                                   // 94
                                                                                                                 // 95
  // Rig read stream                                                                                             // 96
  var sourceStream = self.storage.createReadStreamForFileKey(fileKey, options);                                  // 97
                                                                                                                 // 98
  // Pass through transformRead function if provided                                                             // 99
  if (typeof self.transformRead === 'function') {                                                                // 100
                                                                                                                 // 101
    sourceStream = addPassThrough(sourceStream, function (ptStream, originalStream) {                            // 102
      // Rig transform                                                                                           // 103
      try {                                                                                                      // 104
        self.transformRead.call(FS.Transform.scope, fileObj, originalStream, ptStream);                          // 105
      } catch(err) {                                                                                             // 106
        //throw new Error(err);                                                                                  // 107
        // We emit an error - should we throw an error?                                                          // 108
        sourceStream.emit('error', 'FS.Transform.createReadStream transform function failed');                   // 109
      }                                                                                                          // 110
    });                                                                                                          // 111
                                                                                                                 // 112
  }                                                                                                              // 113
                                                                                                                 // 114
  // We dont transform just normal SA interface                                                                  // 115
  return sourceStream;                                                                                           // 116
};                                                                                                               // 117
                                                                                                                 // 118
// Utility function to simplify adding layers of passthrough                                                     // 119
function addPassThrough(stream, func) {                                                                          // 120
  var pts = new PassThrough();                                                                                   // 121
  // We pass on the special "stored" event for those listening                                                   // 122
  stream.on('stored', function(result) {                                                                         // 123
    pts.emit('stored', result);                                                                                  // 124
  });                                                                                                            // 125
  func(pts, stream);                                                                                             // 126
  return pts;                                                                                                    // 127
}                                                                                                                // 128
                                                                                                                 // 129
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['cfs:storage-adapter'] = {};

})();

//# sourceMappingURL=cfs_storage-adapter.js.map
