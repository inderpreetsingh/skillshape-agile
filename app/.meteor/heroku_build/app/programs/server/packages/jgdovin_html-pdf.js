(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var pdf, pdfBuffer, PdfCollection;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// packages/jgdovin_html-pdf/packages/jgdovin_html-pdf.js                                    //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
(function () {

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/jgdovin:html-pdf/server/html-pdf.js                                        //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
pdf = Npm.require('html-pdf');                                                         // 1
                                                                                       // 2
                                                                                       // 3
Meteor.startup(function() {                                                            // 4
  pdfBuffer = function (html, options, cb) {                                           // 5
    pdf.create(html, options).toBuffer(Meteor.bindEnvironment(function (err, buffer) { // 6
      cb && cb(null, buffer);                                                          // 7
      return buffer;                                                                   // 8
    }));                                                                               // 9
  };                                                                                   // 10
});                                                                                    // 11
                                                                                       // 12
Meteor.methods({                                                                       // 13
  pdfStream : function(html, options) {                                                // 14
    var pdfStream = function (html, options, cb) {                                     // 15
      pdf.create(html).toStream(Meteor.bindEnvironment(function (err, buffer) {        // 16
        cb && cb(null, buffer);                                                        // 17
        return;                                                                        // 18
      }));                                                                             // 19
    };                                                                                 // 20
                                                                                       // 21
    var stream = Meteor.wrapAsync(pdfStream);                                          // 22
                                                                                       // 23
    try {                                                                              // 24
      var result = stream(html, options);                                              // 25
      return result;                                                                   // 26
    } catch (e) {                                                                      // 27
      console.log(e);                                                                  // 28
    }                                                                                  // 29
  },                                                                                   // 30
  pdfBuffer : function(html, options) {                                                // 31
    var buffer = Meteor.wrapAsync(pdfBuffer);                                          // 32
                                                                                       // 33
    try {                                                                              // 34
      var result = buffer(html, options);                                              // 35
      return result;                                                                   // 36
    } catch (e) {                                                                      // 37
      console.log(e);                                                                  // 38
    }                                                                                  // 39
  },                                                                                   // 40
  pdfCollection : function(html, options) {                                            // 41
    var buffer = Meteor.wrapAsync(pdfBuffer);                                          // 42
                                                                                       // 43
    try {                                                                              // 44
      var result = buffer(html, options);                                              // 45
      var resultId = PdfCollection.insert({pdf:result});                               // 46
      return resultId;                                                                 // 47
    } catch (e) {                                                                      // 48
      console.log(e);                                                                  // 49
    }                                                                                  // 50
  }                                                                                    // 51
});                                                                                    // 52
                                                                                       // 53
//we need a publication to keep pdfs inside of.                                        // 54
Meteor.publish("htmlPdfCollection", function () {                                      // 55
  return PdfCollection.find();                                                         // 56
});                                                                                    // 57
/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/jgdovin:html-pdf/lib/index.js                                              //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
if(Meteor.isClient) {                                                                  // 1
  Meteor.pdf = {                                                                       // 2
    buffer : function(html, options, cb) {                                             // 3
      if (arguments.length === 1) {                                                    // 4
        options = {};                                                                  // 5
      }                                                                                // 6
      if (arguments.length === 2 && typeof options === 'function') {                   // 7
        cb = options;                                                                  // 8
        options = {};                                                                  // 9
      }                                                                                // 10
                                                                                       // 11
      Meteor.call('pdfBuffer', html, options, function(err, result) {                  // 12
        cb(result);                                                                    // 13
      });                                                                              // 14
    },                                                                                 // 15
    stream : function(html, options, cb) {                                             // 16
      if (arguments.length === 1) {                                                    // 17
        options = {};                                                                  // 18
      }                                                                                // 19
      if (arguments.length === 2 && typeof options === 'function') {                   // 20
        cb = options;                                                                  // 21
        options = {};                                                                  // 22
      }                                                                                // 23
                                                                                       // 24
      Meteor.call('pdfStream', html, options, function(err, result) {                  // 25
        cb(result);                                                                    // 26
      });                                                                              // 27
    },                                                                                 // 28
    save : function(html, filename, options) {                                         // 29
      if (arguments.length === 2){                                                     // 30
        options = {};                                                                  // 31
      }                                                                                // 32
      Meteor.call('pdfCollection', html, options, function(err, result) {              // 33
        var item = PdfCollection.findOne({_id : result});                              // 34
        var blob = new Blob([item.pdf], {type: 'application/pdf'});                    // 35
        saveAs(blob, filename + '.pdf');                                               // 36
        PdfCollection.remove({_id: result})                                            // 37
      });                                                                              // 38
    }                                                                                  // 39
  };                                                                                   // 40
}                                                                                      // 41
                                                                                       // 42
PdfCollection = new Mongo.Collection('htmlPdfCollection');                             // 43
                                                                                       // 44
/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/jgdovin:html-pdf/lib/permissions.js                                        //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
PdfCollection.allow({                                                                  // 1
  remove: function(userId, doc) {                                                      // 2
    return true;                                                                       // 3
  }                                                                                    // 4
});                                                                                    // 5
/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);

///////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['jgdovin:html-pdf'] = {}, {
  pdf: pdf,
  PdfCollection: PdfCollection
});

})();

//# sourceMappingURL=jgdovin_html-pdf.js.map
