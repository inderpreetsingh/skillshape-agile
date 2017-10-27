(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;
var check = Package.check.check;
var Match = Package.check.Match;
var Random = Package.random.Random;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var _ = Package.underscore._;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var Autoupdate = Package.autoupdate.Autoupdate;

/* Package-scope variables */
var __coffeescriptShare, Knox, AWS;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/lepozepo_s3/server/startup.coffee.js                                                                   //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var processBrowser;                                                                                                // 2
                                                                                                                   //
Knox = Npm.require("knox");                                                                                        // 2
                                                                                                                   //
processBrowser = process.browser;                                                                                  // 2
                                                                                                                   //
process.browser = false;                                                                                           // 2
                                                                                                                   //
AWS = Npm.require("aws-sdk");                                                                                      // 2
                                                                                                                   //
process.browser = processBrowser;                                                                                  // 2
                                                                                                                   //
this.S3 = {                                                                                                        // 2
  config: {},                                                                                                      // 11
  knox: {},                                                                                                        // 11
  aws: {},                                                                                                         // 11
  rules: {}                                                                                                        // 11
};                                                                                                                 //
                                                                                                                   //
Meteor.startup(function() {                                                                                        // 2
  if (!_.has(S3.config, "key")) {                                                                                  // 17
    console.log("S3: AWS key is undefined");                                                                       // 18
  }                                                                                                                //
  if (!_.has(S3.config, "secret")) {                                                                               // 20
    console.log("S3: AWS secret is undefined");                                                                    // 21
  }                                                                                                                //
  if (!_.has(S3.config, "bucket")) {                                                                               // 23
    console.log("S3: AWS bucket is undefined");                                                                    // 24
  }                                                                                                                //
  if (!_.has(S3.config, "bucket") || !_.has(S3.config, "secret") || !_.has(S3.config, "key")) {                    // 26
    return;                                                                                                        // 27
  }                                                                                                                //
  _.defaults(S3.config, {                                                                                          // 17
    region: "us-east-1"                                                                                            // 30
  });                                                                                                              //
  S3.knox = Knox.createClient(S3.config);                                                                          // 17
  return S3.aws = new AWS.S3({                                                                                     //
    accessKeyId: S3.config.key,                                                                                    // 34
    secretAccessKey: S3.config.secret,                                                                             // 34
    region: S3.config.region                                                                                       // 34
  });                                                                                                              //
});                                                                                                                // 16
                                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/lepozepo_s3/server/sign_request.coffee.js                                                              //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Crypto, HmacSHA256, calculate_signature, moment;                                                               // 1
                                                                                                                   //
Meteor.methods({                                                                                                   // 1
  _s3_sign: function(ops) {                                                                                        // 2
    var expiration, key, meta_credential, meta_date, meta_uuid, policy, post_url, signature;                       // 3
    if (ops == null) {                                                                                             //
      ops = {};                                                                                                    //
    }                                                                                                              //
    this.unblock();                                                                                                // 3
    _.defaults(ops, {                                                                                              // 3
      expiration: 1800000,                                                                                         // 14
      path: "",                                                                                                    // 14
      bucket: S3.config.bucket,                                                                                    // 14
      acl: "public-read",                                                                                          // 14
      region: S3.config.region,                                                                                    // 14
      server_side_encryption: false                                                                                // 14
    });                                                                                                            //
    check(ops, {                                                                                                   // 3
      expiration: Number,                                                                                          // 22
      path: String,                                                                                                // 22
      bucket: String,                                                                                              // 22
      acl: String,                                                                                                 // 22
      region: String,                                                                                              // 22
      server_side_encryption: Boolean,                                                                             // 22
      file_type: String,                                                                                           // 22
      file_name: String,                                                                                           // 22
      file_size: Number                                                                                            // 22
    });                                                                                                            //
    expiration = new Date(Date.now() + ops.expiration);                                                            // 3
    expiration = expiration.toISOString();                                                                         // 3
    if (_.isEmpty(ops.path)) {                                                                                     // 35
      key = "" + ops.file_name;                                                                                    // 36
    } else {                                                                                                       //
      key = ops.path + "/" + ops.file_name;                                                                        // 38
    }                                                                                                              //
    meta_uuid = Meteor.uuid();                                                                                     // 3
    meta_date = (moment().format('YYYYMMDD')) + "T000000Z";                                                        // 3
    meta_credential = S3.config.key + "/" + (moment().format('YYYYMMDD')) + "/" + ops.region + "/s3/aws4_request";
    policy = {                                                                                                     // 3
      "expiration": expiration,                                                                                    // 44
      "conditions": [                                                                                              // 44
        ["content-length-range", 0, ops.file_size], {                                                              //
          "key": key                                                                                               // 47
        }, {                                                                                                       //
          "bucket": ops.bucket                                                                                     // 48
        }, {                                                                                                       //
          "Content-Type": ops.file_type                                                                            // 49
        }, {                                                                                                       //
          "acl": ops.acl                                                                                           // 50
        }, {                                                                                                       //
          "x-amz-algorithm": "AWS4-HMAC-SHA256"                                                                    // 51
        }, {                                                                                                       //
          "x-amz-credential": meta_credential                                                                      // 52
        }, {                                                                                                       //
          "x-amz-date": meta_date                                                                                  // 53
        }, {                                                                                                       //
          "x-amz-meta-uuid": meta_uuid                                                                             // 54
        }                                                                                                          //
      ]                                                                                                            //
    };                                                                                                             //
    if (ops.server_side_encryption) {                                                                              // 56
      policy["conditions"].push({                                                                                  // 57
        "x-amz-server-side-encryption": "AES256"                                                                   // 57
      });                                                                                                          //
    }                                                                                                              //
    policy = new Buffer(JSON.stringify(policy), "utf-8").toString("base64");                                       // 3
    signature = calculate_signature(policy, ops.region);                                                           // 3
    if (ops.region === "us-east-1" || ops.region === "us-standard") {                                              // 66
      post_url = "https://s3.amazonaws.com/" + ops.bucket;                                                         // 67
    } else {                                                                                                       //
      post_url = "https://s3-" + ops.region + ".amazonaws.com/" + ops.bucket;                                      // 69
    }                                                                                                              //
    return {                                                                                                       //
      policy: policy,                                                                                              // 72
      signature: signature,                                                                                        // 72
      access_key: S3.config.key,                                                                                   // 72
      post_url: post_url,                                                                                          // 72
      url: (post_url + "/" + key).replace("https://", "http://"),                                                  // 72
      secure_url: post_url + "/" + key,                                                                            // 72
      relative_url: "/" + key,                                                                                     // 72
      bucket: ops.bucket,                                                                                          // 72
      acl: ops.acl,                                                                                                // 72
      key: key,                                                                                                    // 72
      file_type: ops.file_type,                                                                                    // 72
      file_name: ops.file_name,                                                                                    // 72
      meta_uuid: meta_uuid,                                                                                        // 72
      meta_date: meta_date,                                                                                        // 72
      meta_credential: meta_credential                                                                             // 72
    };                                                                                                             //
  }                                                                                                                //
});                                                                                                                //
                                                                                                                   //
Crypto = Npm.require("crypto-js");                                                                                 // 1
                                                                                                                   //
moment = Npm.require("moment");                                                                                    // 1
                                                                                                                   //
HmacSHA256 = Crypto.HmacSHA256;                                                                                    // 1
                                                                                                                   //
calculate_signature = function(policy, region) {                                                                   // 1
  var kDate, kRegion, kService, signature_key;                                                                     // 95
  kDate = HmacSHA256(moment().format("YYYYMMDD"), "AWS4" + S3.config.secret);                                      // 95
  kRegion = HmacSHA256(region, kDate);                                                                             // 95
  kService = HmacSHA256("s3", kRegion);                                                                            // 95
  signature_key = HmacSHA256("aws4_request", kService);                                                            // 95
  return HmacSHA256(policy, signature_key).toString(Crypto.enc.Hex);                                               //
};                                                                                                                 // 94
                                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/lepozepo_s3/server/delete_object.coffee.js                                                             //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Future;                                                                                                        // 1
                                                                                                                   //
Future = Npm.require('fibers/future');                                                                             // 1
                                                                                                                   //
Meteor.methods({                                                                                                   // 1
  _s3_delete: function(path) {                                                                                     // 4
    var auth_function, delete_context, future, ref;                                                                // 5
    this.unblock();                                                                                                // 5
    check(path, String);                                                                                           // 5
    future = new Future();                                                                                         // 5
    if ((ref = S3.rules) != null ? ref["delete"] : void 0) {                                                       // 10
      delete_context = _.extend(this, {                                                                            // 11
        s3_delete_path: path                                                                                       // 12
      });                                                                                                          //
      auth_function = _.bind(S3.rules["delete"], delete_context);                                                  // 11
      if (!auth_function()) {                                                                                      // 15
        throw new Meteor.Error("Unauthorized", "Delete not allowed");                                              // 16
      }                                                                                                            //
    }                                                                                                              //
    S3.knox.deleteFile(path, function(e, r) {                                                                      // 5
      if (e) {                                                                                                     // 19
        return future["return"](e);                                                                                //
      } else {                                                                                                     //
        return future["return"](true);                                                                             //
      }                                                                                                            //
    });                                                                                                            //
    return future.wait();                                                                                          //
  }                                                                                                                //
});                                                                                                                //
                                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['lepozepo:s3'] = {}, {
  Knox: Knox,
  AWS: AWS
});

})();

//# sourceMappingURL=lepozepo_s3.js.map
