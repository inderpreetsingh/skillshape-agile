school = "School"; // avoid typos, this string occurs many times.
//
School = new Mongo.Collection(school);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
Schema = {};
Schema.Media = new SimpleSchema({
  mediaType: {
    optional: true,
    type: String
  },
  fileName: {
    optional: true,
    type: String
  },
  fileSize: {
    optional: true,
    type: String
  },
  filePath: {
    optional: true,
    type: String
  },
  contentType: {
    optional: true,
    type: String
  }
});
School.attachSchema(new SimpleSchema({
  is_publish: {
    type: String,
    optional: true
  },
  name: {
    type: String,
    optional: true
  },
  website: {
    type: String,
    optional: true
  },
  phone: {
    type: String,
    optional: true
  },
  schooldesc: {
    type: String,
    optional: true
  },
  address: {
    type: String,
    optional: true
  },
  schoolGroupId: {
    type: String,
    optional: true
  },
  tag: {
    type: String,
    optional: true
  },
  quote: {
    type: String,
    optional: true
  },
  message: {
    type: String,
    optional: true
  },
  categoryCalled: {
    type: String,
    optional: true
  },
  subjectCalled: {
    type: String,
    optional: true
  },
  levelCalled: {
    type: String,
    optional: true
  },
  phone: {
    type: String,
    optional: true
  },
  claimed: {
    type: String,
    optional: true
  },
  logoImg: {
    type: String,
    optional: true
  },
  topBarColor: {
    type: String,
    optional: true
  },
  bodyColour: {
    type: String,
    optional: true
  },
  backGroundVideoUrl: {
    type: String,
    optional: true
  },
  moduleColour: {
    type: String,
    optional: true
  },
  font: {
    type: String,
    optional: true
  },
  mainImage: {
    type: String,
    optional: true
  },
  aboutHtml: {
    type: String,
    optional: true
  },
  descHtml: {
    type: String,
    optional: true
  },
  scoreMin: {
    type: String,
    optional: true
  },
  scoreMax: {
    type: String,
    optional: true
  },
  mediaList: {
    type: [Schema.Media],
    optional: true
  },
  userId: {
    type: String,
    optional: true
  },
  email: {
    type: String,
    optional: true
  },
  firstName:{
    type: String,
    optional: true

  },
  lastName:{
    type: String,
    optional: true
  }
}));
School.friendlySlugs(
  {
    slugFrom: 'name',
    slugField: 'slug',
    distinct: true,
    updateSlug: true
  }
);
if (Meteor.isServer) {
  var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  School._ensureIndex({ name: "text", website: "text" });

Meteor.publish(school,schoolSearch) 

 function schoolSearch({user_id, coords, skill, _classPrice, _monthPrice, textSearch, limit, selectedTag}) {
   let classPrice=_classPrice ? _classPrice : null ;
   let monthPrice=_monthPrice ? _monthPrice : null ;
    limit = limit;
    class_filter = {}
    classTypeFilter = {}
    allClassIds = []
    allClassTypeIds = []
    schoolList = School.find({ is_publish: 'N' }).fetch();
    nSchoolIds = schoolList.map(function (a) { return a._id });
    if (textSearch) {
      textSearchfilter = { $text: { $search: textSearch, $caseSensitive: true } }
      console.log(textSearchfilter);
      schools = School.find(textSearchfilter).fetch();
      if (schools.length > 0) {
        schoolIds = schools.map(function (a) {
          return a._id
        })
        console.log(schoolIds);
        schoolClass = SkillClass.find({ schoolId: { $in: schoolIds } }).fetch();
        allClassIds = schoolClass.map(function (a) {
          return a._id
        })
        allClassTypeIds = schoolClass.map(function (a) {
          return a.classTypeId
        })
      }
      classd = SkillClass.find(textSearchfilter).fetch();
      classIds = classd.map(function (a) {
        return a._id
      })
      if (allClassIds.length > 0) {
        allClassIds = classIds.concat(allClassIds)
      }
      console.log(classd);
      classTypeIds = classd.map(function (a) {
        return a.classTypeId
      })
      if (allClassTypeIds.length > 0) {
        classTypeIds = classTypeIds.concat(allClassTypeIds)
      }
      classTypeFilter._id = { $in: classTypeIds }
      limit = { limit: limit }
      console.log(allClassIds);
      class_filter = { _id: { $in: allClassIds } }
      class_filter.schoolId = { $nin: nSchoolIds }
      classTypeFilter.schoolId = { $nin: nSchoolIds }

      // Counts.publish(this, "TotalSearchedSkillClass", SkillClass.find(class_filter));
      skillCursor = SkillClass.find(class_filter, limit)
     
      skillResult = skillCursor.fetch();
      classTypeIds = skillResult.map(function (a) { return a.classTypeId });
      schoolIds = skillResult.map(function (a) { return a.schoolId });
      classTypeFilter._id = { $in: classTypeIds }
      schoolFilter = { _id: { $in: schoolIds } }

      return [School.find(schoolFilter), skillCursor, SLocation.find({}), SkillType.find({}), ClassType.find(classTypeFilter), ClassPricing.find({})];
    }
    if (coords) {
    
      // place variable will have all the information you are looking for.
      var maxDistance = 50;
      // we need to convert the distance to radians
      // the raduis of Earth is approximately 6371 kilometers
      maxDistance /= 63;
      try {
        slocations = SLocation.find({
          /*loc: {
            $near : {$geometry:{type: "Point",coordinates:coords}, $maxDistance:50000}
          }*/
          loc: {
            $near: coords,
            $maxDistance: maxDistance
          }
          /*$maxDistance: maxDistance*/

        }).fetch();
      } catch (e) {
        slocations = [];
      }

      locaion_ids = slocations.map(function (a) {
        return a._id;
      });
      class_filter = { locationId: { $in: locaion_ids } };
      skillClass = SkillClass.find(class_filter)
      tmpClassIds = skillClass.map(function (a) {
        return a._id;
      });
      schoolIds = skillClass.map(function (a) {
        return a.schoolId;
      });
      if (tmpClassIds.length < 1) {
        tmpClassIds.push("000000000")
      }
      allClassIds = tmpClassIds
      /*class_type = ClassType.find({schoolId:{$in:schoolIds}}).fetch()
      classTypeIds = class_type.map(function(a) {
                    return a._id;
      });*/

      class_type = ClassType.find({ schoolId: { $in: schoolIds } }).fetch();
      classTypeIds = class_type.map(function (a) {
        return a._id;
      });
      if (skill) {
        let _query = { skillTypeId: skill, schoolId: { $in: schoolIds } };
        if (selectedTag)
          _query["tags"] = { $regex: new RegExp(selectedTag, 'mi') };
        class_type = ClassType.find(_query).fetch()
        classTypeIds = class_type.map(function (a) {
          return a._id;
        });
      }
      if (monthPrice) {

         let minMonthPrice=parseInt(monthPrice[0]);
         let maxMonthPrice= parseInt(monthPrice[1]);

         month_price = MonthlyPricing.find({ $or: [
            { oneMonCost: { $gte: minMonthPrice, $lt: maxMonthPrice } },
            { threeMonCost: { $gte: minMonthPrice, $lt: maxMonthPrice } },
            { sixMonCost:{ $gte: minMonthPrice, $lt: maxMonthPrice } },
            { annualCost: { $gte: minMonthPrice, $lt: maxMonthPrice } }, 
            { lifetimeCost: { $gte: minMonthPrice, $lt: maxMonthPrice } }
            ], 
            schoolId: { $in: schoolIds } }).fetch();


 /***********************Commented to use Range Slider *******************************/

        // price = eval(monthPrice)
        // if (price == 201) {
        //   price = eval(price)
        //   month_price = MonthlyPricing.find({ $or: [{ oneMonCost: { $gte: price } }, { threeMonCost: { $gte: price } }, { sixMonCost: { $gte: price } }, { annualCost: { $gte: price } }, { lifetimeCost: { $gte: price } }], schoolId: { $in: schoolIds } }).fetch()
        // } else {
        //   month_price = MonthlyPricing.find({ $or: [{ oneMonCost: { $lte: price } }, { threeMonCost: { $lte: price } }, { sixMonCost: { $lte: price } }, { annualCost: { $lte: price } }, { lifetimeCost: { $lte: price } }], schoolId: { $in: schoolIds } }).fetch()
        // }

    /***********************Commented to use Range Slider *******************************/
        classTypeIds = []
        month_price.map(function (a) {
          if (a.classTypeId) {
            Ids = a.classTypeId.split(",");
            classTypeIds = classTypeIds.concat(Ids)
          }
        });
      }
      if (classPrice) {
       // price = eval(classPrice)
        let minPrice=parseInt(classPrice[0]);
        let maxPrice=parseInt(classPrice[1]);


       // console.lIntelliJIDEALicenseServer_linux_amd64og(price);


        /***********************Commented to use Range Slider *******************************/
        // if (price == 201) {
        //   class_price = ClassPricing.find({ 
        //   cost: { $gte: price } 
        //  ,cost: { $lte: price }
        //  , schoolId: { $in: schoolIds } }).fetch()
        // } else {
        //   class_price = ClassPricing.find({ cost: { $lte: price }, schoolId: { $in: schoolIds } }).fetch()
        // }

      /***********************End *****************************/


     /***********************Replaced code to use Range Slider *******************************/

    console.log("Min Price",minPrice);
    console.log("Max Price",maxPrice);
    class_price= ClassPricing.find({ cost: { $gte: minPrice,$lt:maxPrice}, schoolId: { $in: schoolIds } }).fetch();
     
      /***********************End *******************************/




        /*{ "Price": {"$gt": 2, "$lt": 1250 } }*/



        console.log(class_price);
        classTypeIds = []
        class_price.map(function (a) {
          if (a.classTypeId) {
            Ids = a.classTypeId.split(",");
            classTypeIds = classTypeIds.concat(Ids)
          }
        });
      }
      class_filter.classTypeId = { $in: classTypeIds }
      classTypeFilter._id = { $in: classTypeIds }
      console.log(class_filter);
      limit = { limit: limit }
      class_filter.schoolId = { $nin: nSchoolIds }
      classTypeFilter.schoolId = { $nin: nSchoolIds }

      // Counts.publish(this, "TotalSearchedSkillClass", SkillClass.find(class_filter));
      skillCursor = SkillClass.find(class_filter, limit)
      skillResult = skillCursor.fetch();
      classTypeIds = skillResult.map(function (a) { return a.classTypeId });
      schoolIds = skillResult.map(function (a) { return a.schoolId });
      classTypeFilter._id = { $in: classTypeIds }
      schoolFilter = { _id: { $in: schoolIds } }
      return [School.find(schoolFilter), skillCursor, SLocation.find({}), SkillType.find({}), ClassType.find(classTypeFilter), ClassPricing.find({})];
    }
    if (skill) {
      let _query = { skillTypeId: skill };
      if (selectedTag)
        _query["tags"] = { $regex: new RegExp(selectedTag, 'mi') };
      console.log(_query);
      class_type = ClassType.find(_query).fetch()
      classTypeIds = class_type.map(function (a) {
        return a._id;
      });
      if (classPrice) {
          let minPrice=parseInt(classPrice[0]);
        let maxPrice=parseInt(classPrice[1]);
       console.log("Min Price",minPrice);
       console.log("Max Price",maxPrice);
       class_price= ClassPricing.find({ cost: { $gte: minPrice, $lt:maxPrice}}).fetch();




        // price = eval(classPrice)
        // console.log(price);
        // if (price == 201) {
        //   class_price = ClassPricing.find({ cost: { $gte: price } }).fetch()
        // } else {
        //   class_price = ClassPricing.find({ cost: { $lte: price } }).fetch()
        // }
        /*{ "Price": {"$gt": 2, "$lt": 1250 } }*/
        console.log(class_price);
        newclassTypeIds = []
        class_price.map(function (a) {
          if (a.classTypeId) {
            Ids = a.classTypeId.split(",");
            newclassTypeIds = newclassTypeIds.concat(Ids)
          }
        });
        classTypeIds = newclassTypeIds.filter(function (obj) { return classTypeIds.indexOf(obj) > -1; });
      }
      if (monthPrice) {
        // price = eval(monthPrice)
        // if (price == 201) {
        //   price = eval(price)
        //   month_price = MonthlyPricing.find({ $or: [{ oneMonCost: { $gte: price } }, { threeMonCost: { $gte: price } }, { sixMonCost: { $gte: price } }, { annualCost: { $gte: price } }, { lifetimeCost: { $gte: price } }] }).fetch()
        // } else {
        //   month_price = MonthlyPricing.find({ $or: [{ oneMonCost: { $lte: price } }, { threeMonCost: { $lte: price } }, { sixMonCost: { $lte: price } }, { annualCost: { $lte: price } }, { lifetimeCost: { $lte: price } }] }).fetch()
        // }

        let minMonthPrice=parseInt(monthPrice[0]);
         let maxMonthPrice=parseInt(monthPrice[1]);
         month_price = MonthlyPricing.find({ $or: [
            { oneMonCost: { $gte: minMonthPrice, $lt: maxMonthPrice } },
            { threeMonCost: { $gte: minMonthPrice, $lt: maxMonthPrice } },
            { sixMonCost:{ $gte: minMonthPrice, $lt: maxMonthPrice } },
            { annualCost: { $gte: minMonthPrice, $lt: maxMonthPrice } }, 
            { lifetimeCost: { $gte: minMonthPrice, $lt: maxMonthPrice } }
            ]}).fetch();

        newclassTypeIds = []
        month_price.map(function (a) {
          if (a.classTypeId) {
            Ids = a.classTypeId.split(",");
            newclassTypeIds = classTypeIds.concat(Ids)
          }
        });
        classTypeIds = newclassTypeIds.filter(function (obj) { return classTypeIds.indexOf(obj) > -1; });
      }

      class_filter.classTypeId = { $in: classTypeIds }
      classTypeFilter._id = { $in: classTypeIds }
      limit = { limit: limit }
      class_filter.schoolId = { $nin: nSchoolIds }
      classTypeFilter.schoolId = { $nin: nSchoolIds }

      // Counts.publish(this, "TotalSearchedSkillClass", SkillClass.find(class_filter));
      skillCursor = SkillClass.find(class_filter, limit)
      skillResult = skillCursor.fetch();
      classTypeIds = skillResult.map(function (a) { return a.classTypeId });
      schoolIds = skillResult.map(function (a) { return a.schoolId });
      classTypeFilter._id = { $in: classTypeIds }
      schoolFilter = { _id: { $in: schoolIds } }
      return [School.find(schoolFilter), skillCursor, SLocation.find({}), SkillType.find({}), ClassType.find(classTypeFilter), ClassPricing.find({})];
    }
    if (classPrice) {
      console.log("Class Price Block");

         let minPrice=parseInt(classPrice[0]);
        let maxPrice=parseInt(classPrice[1]);

       console.log("Min Price",minPrice);
       console.log("Max Price",maxPrice);
       class_price= ClassPricing.find({ cost: { $gte: minPrice,$lt:maxPrice}}).fetch();
       
     ///console.log(class_price);

      // price = eval(classPrice)
      // console.log(price);
      // if (price == 201) {
      //   class_price = ClassPricing.find({ cost: { $gte: price } }).fetch()
      // } else {
      //   class_price = ClassPricing.find({ cost: { $lte: price } }).fetch()
      // }
      /*{ "Price": {"$gt": 2, "$lt": 1250 } }*/
      classTypeIds = [];
      class_price.map(function (a) {
        if (a.classTypeId) {
          Ids = a.classTypeId.split(",");
          classTypeIds = classTypeIds.concat(Ids);
        }
      });
      class_filter.classTypeId = { $in: classTypeIds }
      classTypeFilter._id = { $in: classTypeIds }
    }

    if (monthPrice) {


      // price = eval(monthPrice)
      // if (price == 201) {
      //   price = eval(price)
      //   month_price = MonthlyPricing.find({ $or: [{ oneMonCost: { $gte: price } }, { threeMonCost: { $gte: price } }, { sixMonCost: { $gte: price } }, { annualCost: { $gte: price } }, { lifetimeCost: { $gte: price } }] }).fetch()
      // } else {
      //   month_price = MonthlyPricing.find({ $or: [{ oneMonCost: { $lte: price } }, { threeMonCost: { $lte: price } }, { sixMonCost: { $lte: price } }, { annualCost: { $lte: price } }, { lifetimeCost: { $lte: price } }] }).fetch()
      // }
      
      let minMonthPrice=parseInt(monthPrice[0]);
         let maxMonthPrice=parseInt(monthPrice[1]);
         month_price = MonthlyPricing.find({ $or: [
            { oneMonCost: { $gte: minMonthPrice, $lt: maxMonthPrice } },
            { threeMonCost: { $gte: minMonthPrice, $lt: maxMonthPrice } },
            { sixMonCost:{ $gte: minMonthPrice, $lt: maxMonthPrice } },
            { annualCost: { $gte: minMonthPrice, $lt: maxMonthPrice } }, 
            { lifetimeCost: { $gte: minMonthPrice, $lt: maxMonthPrice } }
            ], 
            schoolId: { $in: schoolIds } }).fetch();
       classTypeIds = []
      month_price.map(function (a) {
        if (a.classTypeId) {
          Ids = a.classTypeId.split(",");
          classTypeIds = classTypeIds.concat(Ids)
        }
      });
      class_filter.classTypeId = { $in: classTypeIds }
      classTypeFilter._id = { $in: classTypeIds }
    }
    limit = { limit: limit }
    console.log("--------------------------");
    class_filter.schoolId = { $nin: nSchoolIds }
    classTypeFilter.schoolId = { $nin: nSchoolIds }
    console.log(limit);
    skillCursor = SkillClass.find(class_filter, limit)
    skillResult = skillCursor.fetch();
    classTypeIds = skillResult.map(function (a) { return a.classTypeId });
    schoolIds = skillResult.map(function (a) { return a.schoolId });
    classTypeFilter._id = { $in: classTypeIds }
    schoolFilter = { _id: { $in: schoolIds } }
    console.log("--------------------------");

    /* Used total count  */
    // Counts.publish(this, "TotalSearchedSkillClass", SkillClass.find(class_filter));
      return [School.find(schoolFilter), skillCursor, SLocation.find({}), SkillType.find({}), ClassType.find(classTypeFilter), ClassPricing.find({})];
  };


  Meteor.publish("UserSchool", function (schoolId) {
    return School.find({ _id: schoolId });
  });
  Meteor.publish("UserSchoolbySlug", function (slug) {
    return School.find({ slug: slug });
  });
  Meteor.publish("ClaimSchoolFilter", function ({phone, website, name, coords, cskill, role, limit}) {
    filter = {}
    limit = { limit: limit }
    schoolList = School.find({ is_publish: 'N' }).fetch();
    // UnPublishSchoolIds = schoolList.map(function (a) { return a._id });
    if (phone) {
      filter.phone = { '$regex': '' + phone + '', '$options': '-i' };
    }
    if (website) {
      filter.website = { '$regex': '' + website + '', '$options': '-i' };
    }
    if (name) {
      filter.name = { '$regex': '' + name + '', '$options': '-i' };
    }
    AllSchoolIds = []
    console.log(coords);
    if (coords) {
      // place variable will have all the information you are looking for.
      var maxDistance = 50;
      // we need to convert the distance to radians
      // the raduis of Earth is approximately 6371 kilometers
      maxDistance /= 63;
      slocations = SLocation.find({
        loc: {
          $near: coords,
          $maxDistance: maxDistance
        }
      }).fetch();
      schoolIds = slocations.map(function (a) {
        return a.schoolId;
      });
      console.log(schoolIds);
      filter._id = { $in: schoolIds };
      AllSchoolIds = schoolIds;
    }
    if (cskill) {
      class_type = ClassType.find({ skillTypeId: cskill }).fetch()
      schoolIds = class_type.map(function (a) {
        return a.schoolId;
      });
      console.log(schoolIds);
      AllSchoolIds = schoolIds.concat(AllSchoolIds)
      if (AllSchoolIds.length > 0) {
        filter._id = { $in: AllSchoolIds };
      } else {
        filter._id = { $in: schoolIds };
      }

    }
    if (role && role == "Superadmin") {


    } else {
      /*result = {}
      result = _.extend(result,filter._id, {$nin:UnPublishSchoolIds});*/
      filter.is_publish = { $ne: 'N' }
    }
    /*filter.claimed = { $ne : 'Y' }*/
    console.log(filter);
    return School.find(filter, limit);


  });
  findUrl = function (text) {
    var source = (text || '').toString();
    var urlArray = [];
    var url;
    var matchArray;
    // Regular expression to find FTP, HTTP(S) and email URLs.
    var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;
    // Iterate through any URLs in the text.
    while ((matchArray = regexToken.exec(source)) !== null) {
      var token = matchArray[0];
      return token;
    }
    return '';
  }
  Meteor.methods({
    project_upload: function (fileInfo, fileData) {
      console.log("received file " + fileInfo.name + " data: " + fileData);
      var results = Papa.parse(fileData, {
        header: true
      });
      csvdata = results.data
      for (var i = 0; i < csvdata.length; i++) {
        if (csvdata[i].name && csvdata[i].website && csvdata[i].name.length > 0 && emailRegex.test(csvdata[i].emailAddress)) {
          school = School.findOne({ name: csvdata[i].name, website: csvdata[i].website, email: csvdata[i].emailAddress });
          schoolId = ""
          locationId = ""
          classTypeId = ""
          if (school) {
            schoolId = school._id
            doc = {
              name: csvdata[i].name,
              website: findUrl(csvdata[i].website),
              phone: csvdata[i].phone,
              mainImage: findUrl(csvdata[i].mainImage),
              aboutHtml: csvdata[i].aboutHtml,
              descHtml: csvdata[i].descHtml,
              email: csvdata[i].emailAddress ,
              firstName:csvdata[i].firstName,
              lastName:csvdata[i].lastName

            }
            School.update({ _id: schoolId }, { $set: doc });
          } else {
            doc = {
              name: csvdata[i].name,
              website: findUrl(csvdata[i].website),
              phone: csvdata[i].phone,
              mainImage: findUrl(csvdata[i].mainImage),
              aboutHtml: csvdata[i].aboutHtml,
              descHtml: csvdata[i].descHtml,
              email: csvdata[i].emailAddress,
              firstName:csvdata[i].firstName,
              lastName:csvdata[i].lastName
            }
            let newUser = CreateNewUser(csvdata[i].emailAddress, csvdata[i].name, csvdata[i].firstName, csvdata[i].lastName);
            if (newUser) {
              doc["userId"] = newUser;
            }
            schoolId = School.insert(doc)
          }
          slocation = SLocation.findOne({ schoolId: schoolId, title: csvdata[i].LocationTitle, zip: csvdata[i].zip })
          if (slocation) {

          } else {
            slocation = SLocation.findOne({ schoolId: schoolId, address: csvdata[i].address, zip: csvdata[i].zip })
          }
          doc = {
            title: csvdata[i].LocationTitle,
            neighbourhood: csvdata[i].neighbourhood,
            address: csvdata[i].address,
            city: csvdata[i].city,
            state: csvdata[i].state,
            zip: csvdata[i].zip,
            country: csvdata[i].country,
            schoolId: schoolId
          }
          var data = {}
          try {
            slocation_detail = doc.address + "," + doc.city + "," + doc.state + "," + doc.zip
            console.log(slocation_detail)
            var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + slocation_detail + "&key=AIzaSyBtQoiRR6Ft0wGTajMd8uTZb71h8kwD5Ew"
            data = Meteor.http.call("GET", url);
            data = JSON.parse(data.content);
            if (data.results[0] && data.results[0].geometry && data.results[0].geometry.location) {
              data = data.results[0].geometry.location
            }
            if (data.status == 'ZERO_RESULTS') {
              data.lat = 0
              data.lng = 0
              console.log("Location not found");
            }
            doc.geoLat = data.lat
            doc.geoLong = data.lng
            doc.loc = [data.lat, data.lng]
          } catch (err) {
            console.log("Location not found");
            data.lat = 0
            data.lng = 0
            doc.geoLat = data.lat
            doc.geoLong = data.lng
            doc.loc = [data.lat, data.lng]
          }
          if (slocation) {
            locationId = slocation._id
            SLocation.update({ _id: locationId }, { $set: doc });
          } else {
            if (csvdata[i].address) {
              locationId = SLocation.insert(doc);
            }
          }

          var obj = {}
          obj.schoolId = schoolId;
          obj.name = csvdata[i].classTypeName
          skill = csvdata[i].skillType
          if (skill) {
            skill = skill.split(",")
            skill = skill[0].trim();
          }


          skillType = SkillType.findOne({ name: skill })
          if (skillType) {

          } else {
            if (csvdata[i].classTypeName) {
              SkillType.insert({ name: skill })
            }
          }
          obj.skillTypeId = skill
          obj.desc = csvdata[i].classTypeDesc
          obj.classTypeImg = csvdata[i].classTypeImg

          classtype = ClassType.findOne({ schoolId: schoolId, name: csvdata[i].classTypeName });
          if (classtype) {

          } else {
            classtype = ClassType.findOne({ schoolId: schoolId, desc: csvdata[i].classTypeDesc });
            if (classtype) {

            } else {
              classtype = ClassType.findOne({ schoolId: schoolId, skillTypeId: skill });
            }
          }
          if (classtype) {
            classTypeId = classtype._id
            ClassType.update({ _id: classTypeId }, { $set: obj });
          } else {
            if (obj.name) {
              classTypeId = ClassType.insert(obj);
            }
          }
          skillClass = SkillClass.findOne({ className: csvdata[i].className, schoolId: schoolId });

          var obj = {}
          obj.className = csvdata[i].className
          obj.schoolId = schoolId;
          obj.locationId = locationId
          obj.classTypeId = classTypeId
          obj.plannedStart = csvdata[i].plannedStart
          obj.plannedEnd = csvdata[i].plannedStart
          var repeat = {}
          obj.planEndTime = csvdata[i].planEndTime
          obj.planStartTime = csvdata[i].planStartTime
          repeat_type = csvdata[i].RepeatType
          repeat.repeat_type = repeat_type;
          repeat_every = csvdata[i].RepeatEvery
          repeat.repeat_every = repeat_every;
          start_date = csvdata[i].plannedStart
          repeat.start_date = start_date;
          repeat_on_item = []
          obj.isRecurring = csvdata[i].isRecurring == "TRUE" ? true : false
          csvdata[i].Sunday == "TRUE" ? repeat_on_item.push("Sunday") : false
          csvdata[i].Monday == "TRUE" ? repeat_on_item.push("Monday") : false
          csvdata[i].Tuesday == "TRUE" ? repeat_on_item.push("Tuesday") : false
          csvdata[i].Wednesday == "TRUE" ? repeat_on_item.push("Wednesday") : false
          csvdata[i].Thursday == "TRUE" ? repeat_on_item.push("Thursday") : false
          csvdata[i].Friday == "TRUE" ? repeat_on_item.push("Friday") : false
          csvdata[i].Saturday == "TRUE" ? repeat_on_item.push("Saturday") : false

          repeat_on = [];
          repeat_details = []
          repeat_on_item.map(function (day) {
            repeat_on.push(day);
            console.log(csvdata[i]);
            start_time = day + 'StartTime';
            end_time = day + 'EndTime';
            location = day + 'LocationTitle';
            stime = csvdata[i][start_time];
            etime = csvdata[i][end_time];
            slocation = SLocation.findOne({ schoolId: schoolId, title: csvdata[i][location] })
            if (slocation) {
              locationId = slocation._id
            }
            repeat_details.push({ "day": day, "start_time": stime, "end_time": etime, "location": locationId })
          })
          repeat.repeat_on = repeat_on
          repeat.repeat_details = repeat_details
          end_option_item = csvdata[i].Ends
          end_option = csvdata[i].Ends

          if (end_option == "On Specific Date") {
            end_option = "rend_date"
          } else if (end_option == "After") {
            end_option = "occurrence"
          } else {
            end_option = "Never"
          }
          repeat.end_option = end_option
          if (end_option == "Never") {
            end_option_value = "Never";
          } else {
            end_option_value = csvdata[i].EndValue
          }
          repeat.end_option_value = end_option_value
          obj.repeats = JSON.stringify(repeat)
          if (skillClass) {
            SkillClass.update({ _id: skillClass._id }, { $set: obj });
          } else {
            if (obj.className) {
              SkillClass.insert(obj);
            }
          }
          monthlypricing = MonthlyPricing.findOne({ schoolId: schoolId, packageName: csvdata[i].monthlyPackageName })
          var obj = {}
          obj.packageName = csvdata[i].monthlyPackageName
          obj.pymtType = csvdata[i].PaymentType
          obj.classTypeId = classTypeId
          obj.oneMonCost = csvdata[i].oneMonCost
          obj.threeMonCost = csvdata[i].threeMonCost
          obj.sixMonCost = csvdata[i].sixMonCost
          obj.annualCost = csvdata[i].annualCost
          obj.lifetimeCost = csvdata[i].lifeTimeCost
          obj.schoolId = schoolId;
          if (monthlypricing) {
            MonthlyPricing.update({ _id: monthlypricing._id }, { $set: obj });
          } else {
            if (obj.packageName) {
              console.log(obj);
              MonthlyPricing.insert(obj);
            }
          }
          classpricing = ClassPricing.findOne({ schoolId: schoolId, packageName: csvdata[i].ClassPackageName })
          obj = {}
          obj.packageName = csvdata[i].ClassPackageName
          obj.cost = !isNaN(csvdata[i].Cost) ? csvdata[i].Cost : 0
          obj.classTypeId = classTypeId
          obj.noClasses = csvdata[i].NumberOfClasses
          obj.start = csvdata[i].Expires
          obj.finish = csvdata[i].ExpiresValue
          obj.schoolId = schoolId;
          if (classpricing) {
            ClassPricing.update({ _id: classpricing._id }, { $set: obj });
          } else {
            if (obj.packageName) {
              console.log(obj);
              ClassPricing.insert(obj);
            }
          }
        }



      }

    },
    getConnectedSchool: function (userId) {
      school_list = []
      user = Meteor.users.findOne({ _id: userId });
      if (user && user.profile && user.profile.classIds && user.profile.classIds.length > 0) {
        classIds = user.profile.classIds
        var demand = Demand.find({ userId: userId, classId: { $in: classIds } })
        school_list = demand.map(function (a) {
          return a.schoolId
        })
      }
      return School.find({ _id: { $in: school_list } }).fetch();
    },
    addSchool: function (data) {
      var schoolId = School.insert(data);
      Meteor.users.update({ _id: data.userId }, { $set: { "profile.schoolId": schoolId } });
      return schoolId
    },
    editSchool: function (id, data) {
      return School.update({ _id: id }, { $set: data });
    },
    getMySchool: function (school_id, userId) {
      console.log(school_id);
      school = School.findOne({ _id: school_id });
      if (school) {

      } else {
        Meteor.users.update({ _id: userId }, { $set: { "profile.schoolId": " " } });
      }
      return School.find({ _id: school_id }).fetch();
    },
    claimSchool: function (userId, schoolId) {
      data = {}
      data.userId = userId;
      data.claimed = 'Y'
      School.update({ _id: schoolId }, { $set: data });
      return Meteor.users.update({ _id: data.userId }, { $set: { "profile.schoolId": schoolId, "profile.acess_type": "school" } });
    },
    addMedia: function (schoolId, fileobj) {
      return School.update({ _id: schoolId }, { $push: { "mediaList": fileobj } });
    },
    removeMedia: function (schoolId, path) {
      console.log({ _id: schoolId }, { $pull: { "mediaList": { filePath: path } } }, { multi: true })
      School.update({ _id: schoolId }, { $pull: { "mediaList": { filePath: path } } }, { multi: true });
    },
    publish_school: function (schoolId, is_publish) {
      data = { "is_publish": is_publish }
      return School.update({ _id: schoolId }, { $set: data });
    }

  });


  function CreateNewUser(email, name, firstName, lastName) {
    if (typeof email !== "undefined" && emailRegex.test(email)) {
      let _user = Accounts.findUserByEmail(email)
      if (!_user) {
        return Accounts.createUser({
          email: email, password: email,
          profile: { firstName: firstName, lastName: lastName },
          roles: "Admin",
          preverfiedUser: true
        });
      } else {
        return _user._id;
      }
    }
    return false;
  }

}
