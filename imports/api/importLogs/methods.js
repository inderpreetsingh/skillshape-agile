import ImportLogs from "./fields";
import SLocation from "../sLocation/fields";
import SkillCategory from "../skillCategory/fields";
import SkillSubject from "../skillSubject/fields";
import ClassType from "../classType/fields";
import ClassTimes from "../classTimes/fields";
import School from "../school/fields";
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}$/;

Meteor.methods({
    project_upload: function(fileName, fileData) {
    	this.unblock();
    	const user = Meteor.users.findOne(this.userId);
    	if(checkMyAccess({user, viewName: 'csvUpload_Schools'})){
	        console.log("received file ", fileName );
	        const results = Papa.parse(fileData, {
	            header: true
	        });
	        const csvdata = results.data;
	        // csvdata.splice(-1,1)
	        const csvLength = csvdata.length;
	        console.log("csvLength>>>> ", csvLength)
	        console.log("csvData>>>> ", JSON.stringify(csvdata, null, 2))
	        const csvLogId = ImportLogs.insert({
	        	fileName: fileName
	        })
	        for (var i = 0; i < csvLength; i++) {
	        	try{
	        		for(let key in csvdata[i]){
						csvdata[i][key] = csvdata[i][key].trim();
	        		}
		            if (csvdata[i].schoolName && csvdata[i].website && csvdata[i].schoolName.length > 0 && emailRegex.test(csvdata[i].email)) {
		                let school = School.findOne({ name: csvdata[i].schoolName, website: csvdata[i].website, email: csvdata[i].email });
		                let locationId = ""
		                let schoolId = null;
		                // School already exists then need to update school info and  update `userId` with an array as a School can be managed by multiple admins.
		                if (school) {
		                    schoolId = school._id
		                    const schoolUpdateDoc = {
		                        name: csvdata[i].schoolName,
		                        website: findUrl(csvdata[i].website),
		                        phone: csvdata[i].phone,
		                        mainImage: findUrl(csvdata[i].mainImage),
		                        aboutHtml: csvdata[i].aboutHtml,
		                        descHtml: csvdata[i].descHtml,
		                        email: csvdata[i].email,
		                        firstName: csvdata[i].fName,
		                        lastName: csvdata[i].lName
		                    }
		                    School.update({ _id: schoolId }, { $set: schoolUpdateDoc });
		                } else {
		                    const schoolInsertDoc = {
		                        name: csvdata[i].schoolName,
		                        website: findUrl(csvdata[i].website),
		                        phone: csvdata[i].phone,
		                        mainImage: findUrl(csvdata[i].mainImage),
		                        aboutHtml: csvdata[i].aboutHtml,
		                        descHtml: csvdata[i].descHtml,
		                        email: csvdata[i].email,
		                        firstName: csvdata[i].fName,
		                        lastName: csvdata[i].lName
		                    }
		                    schoolId = School.insert(schoolInsertDoc)
		                    let newUser = CreateNewUser(csvdata[i].email, csvdata[i].schoolName, csvdata[i].fName, csvdata[i].lName, schoolId);
		                    if (newUser) {
		                    	School.update(
				                    { _id: schoolId },
				                    {
				                        $set: {
				                            "superAdmin": newUser,
				                            "admins": [newUser],
				                        }
				                    }
				                );
		                    }
		                }

		                const slocation = SLocation.findOne({ schoolId: schoolId, zip: csvdata[i].zip, $or: [ {title: csvdata[i].LocationTitle}, {address: csvdata[i].address} ] })
		                const sLocationDoc = {
		                    title: csvdata[i].LocationTitle,
		                    neighbourhood: csvdata[i].neighbourhood,
		                    address: csvdata[i].address,
		                    city: csvdata[i].city,
		                    state: csvdata[i].state,
		                    zip: csvdata[i].zip,
		                    country: csvdata[i].country,
		                    schoolId: schoolId
		                }
		                let data = {}
		                try {
		                	console.log("<<< -------- Start for location searching ------->>>>>>>>>>>")
		                    let slocation_detail = sLocationDoc.address + "," + sLocationDoc.city + "," + sLocationDoc.state + "," + sLocationDoc.zip;
		                    console.log(slocation_detail)
		                    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + slocation_detail + "&key=AIzaSyBtQoiRR6Ft0wGTajMd8uTZb71h8kwD5Ew"
		                    data = Meteor.http.call("GET", url);
		                    data = JSON.parse(data.content);
		                    console.log(">>>>>data is >>>>> ", data)
		                    if (data.results[0] && data.results[0].geometry && data.results[0].geometry.location) {
		                        data = data.results[0].geometry.location
		                    }
		                    if (data.status == 'ZERO_RESULTS') {
		                        data.lat = 0
		                        data.lng = 0
		                        console.log("Location not found");
		                    }
		                    sLocationDoc.geoLat = data.lat
		                    sLocationDoc.geoLong = data.lng
		                    sLocationDoc.loc = [data.lat, data.lng]
		                } catch (err) {
		                    console.log("Location not found",err);
		                    data.lat = 0
		                    data.lng = 0
		                    sLocationDoc.geoLat = data.lat
		                    sLocationDoc.geoLong = data.lng
		                    sLocationDoc.loc = [data.lat, data.lng]
		                }
		                if (slocation) {
		                    locationId = slocation._id;
		                    SLocation.update({ _id: locationId }, { $set: sLocationDoc });
		                } else {
		                    if (csvdata[i].address) {
		                        locationId = SLocation.insert(sLocationDoc);
		                    }
		                }
		                let skillCategoryIds = [];
		                let	skillSubjectIds = [];
		                let classTypeObject = {
		                	locationId: locationId,
		                	filters: {
		                		location: sLocationDoc.loc,
		                		locationTitle: `${sLocationDoc.state}, ${sLocationDoc.city}, ${sLocationDoc.country}`
		                	}
		                };

		                classTypeObject.schoolId = schoolId;
		                classTypeObject.name = csvdata[i].classTypeName;
		                let skillCategory = csvdata[i].skillCategory;
		                let skillSubject = csvdata[i].skillSubject;

		                if (skillCategory) {
		                    skillCategory = skillCategory.split(",")
		                    for(let skill of skillCategory) {
		                		let skillCategoryId;
		                		let skillCategoryObject = SkillCategory.findOne({ name: skill.trim() });

				                if (skillCategoryObject){
				                	skillCategoryId = skillCategoryObject._id;
				                } else {
				                    if (csvdata[i].classTypeName) {
				                        skillCategoryId = SkillCategory.insert({ name: skill.trim() })
				                    }
				                }

				                if(skillCategoryId) {
				                	skillCategoryIds.push(skillCategoryId);
				                }
		                    }
		                }

		                if (skillSubject) {
		                    skillSubject = skillSubject.split(",")
		                    for(let skill of skillSubject) {
		                    	let skillSubjectId;
		                    	let skillSubjectObject = SkillSubject.findOne({ name: skill.trim() });

		                    	if (skillSubjectObject){
				                	skillSubjectId = skillSubjectObject._id;
				                } else {
				                	// if (csvdata[i].classTypeName) {
				                 //        skillSubjectId = SkillSubject.insert({ name: skill.trim() })
				                 //    }
				                }

				                if(skillSubjectId) {
				                	skillSubjectIds.push(skillSubjectId);
				                }
		                    }
		                }

		                classTypeObject.desc = csvdata[i].classTypeDesc
		                classTypeObject.classTypeImg = csvdata[i].classTypeImg

		                let classTypeId = null;


                    	classTypeObject.skillCategoryId = skillCategoryIds;
            			classTypeObject.skillSubject = skillSubjectIds;
                    	// console.log("ClassTypeObject Data-->>",classTypeObject);
	                    if (classTypeObject.name) {
		                	ClassType.update({ schoolId: schoolId, name: csvdata[i].classTypeName, desc: csvdata[i].classTypeDesc },{ $set: classTypeObject},{upsert: true});
	                    }
		                console.log("--------------- Done with ClassType ----------------------")
		                let classTime = ClassTimes.findOne({ name: csvdata[i].className, schoolId: schoolId });
		                const classTimeObject = {
		                	name: csvdata[i].className,
		                	schoolId,
		                	classTypeId
		                }

		                if (classTime) {
		                    ClassTimes.update({ _id: classTime._id }, { $set: classTimeObject });
		                } else {
		                    if (classTimeObject.className) {
		                        ClassTimes.insert(classTimeObject);
		                    }
		                }

		                // var obj = {}
		                // obj.className = csvdata[i].className
		                // obj.schoolId = schoolId;
		                // obj.locationId = locationId
		                // obj.classTypeId = classTypeId
		                // obj.plannedStart = csvdata[i].plannedStart
		                // obj.plannedEnd = csvdata[i].plannedStart
		                // var repeat = {}
		                // obj.planEndTime = csvdata[i].planEndTime
		                // obj.planStartTime = csvdata[i].planStartTime
		                // repeat_type = csvdata[i].RepeatType
		                // repeat.repeat_type = repeat_type;
		                // repeat_every = csvdata[i].RepeatEvery
		                // repeat.repeat_every = repeat_every;
		                // start_date = csvdata[i].plannedStart
		                // repeat.start_date = start_date;
		                // repeat_on_item = []
		                // obj.isRecurring = csvdata[i].isRecurring == "TRUE" ? true : false
		                // csvdata[i].Sunday == "TRUE" ? repeat_on_item.push("Sunday") : false
		                // csvdata[i].Monday == "TRUE" ? repeat_on_item.push("Monday") : false
		                // csvdata[i].Tuesday == "TRUE" ? repeat_on_item.push("Tuesday") : false
		                // csvdata[i].Wednesday == "TRUE" ? repeat_on_item.push("Wednesday") : false
		                // csvdata[i].Thursday == "TRUE" ? repeat_on_item.push("Thursday") : false
		                // csvdata[i].Friday == "TRUE" ? repeat_on_item.push("Friday") : false
		                // csvdata[i].Saturday == "TRUE" ? repeat_on_item.push("Saturday") : false

		                // repeat_on = [];
		                // repeat_details = []
		                // repeat_on_item.map(function(day) {
		                //     repeat_on.push(day);
		                //     console.log(csvdata[i]);
		                //     start_time = day + 'StartTime';
		                //     end_time = day + 'EndTime';
		                //     location = day + 'LocationTitle';
		                //     stime = csvdata[i][start_time];
		                //     etime = csvdata[i][end_time];
		                //     slocation = SLocation.findOne({ schoolId: schoolId, title: csvdata[i][location] })
		                //     if (slocation) {
		                //         locationId = slocation._id
		                //     }
		                //     repeat_details.push({ "day": day, "start_time": stime, "end_time": etime, "location": locationId })
		                // })
		                // repeat.repeat_on = repeat_on
		                // repeat.repeat_details = repeat_details
		                // end_option_item = csvdata[i].Ends
		                // end_option = csvdata[i].Ends

		                // if (end_option == "On Specific Date") {
		                //     end_option = "rend_date"
		                // } else if (end_option == "After") {
		                //     end_option = "occurrence"
		                // } else {
		                //     end_option = "Never"
		                // }
		                // repeat.end_option = end_option
		                // if (end_option == "Never") {
		                //     end_option_value = "Never";
		                // } else {
		                //     end_option_value = csvdata[i].EndValue
		                // }
		                // repeat.end_option_value = end_option_value
		                // obj.repeats = JSON.stringify(repeat)
		                // if (skillClass) {
		                //     SkillClass.update({ _id: skillClass._id }, { $set: obj });
		                // } else {
		                //     if (obj.className) {
		                //         SkillClass.insert(obj);
		                //     }
		                // }
		                // monthlypricing = MonthlyPricing.findOne({ schoolId: schoolId, packageName: csvdata[i].monthlyPackageName })
		                // var obj = {}
		                // obj.packageName = csvdata[i].monthlyPackageName
		                // obj.pymtType = csvdata[i].PaymentType
		                // obj.classTypeId = classTypeId
		                // obj.oneMonCost = csvdata[i].oneMonCost
		                // obj.threeMonCost = csvdata[i].threeMonCost
		                // obj.sixMonCost = csvdata[i].sixMonCost
		                // obj.annualCost = csvdata[i].annualCost
		                // obj.lifetimeCost = csvdata[i].lifeTimeCost
		                // obj.schoolId = schoolId;
		                // if (monthlypricing) {
		                //     MonthlyPricing.update({ _id: monthlypricing._id }, { $set: obj });
		                // } else {
		                //     if (obj.packageName) {
		                //         console.log(obj);
		                //         MonthlyPricing.insert(obj);
		                //     }
		                // }
		                // classpricing = ClassPricing.findOne({ schoolId: schoolId, packageName: csvdata[i].ClassPackageName })
		                // obj = {}
		                // obj.packageName = csvdata[i].ClassPackageName
		                // obj.cost = !isNaN(csvdata[i].Cost) ? csvdata[i].Cost : 0
		                // obj.classTypeId = classTypeId
		                // obj.noClasses = csvdata[i].NumberOfClasses
		                // obj.start = csvdata[i].Expires
		                // obj.finish = csvdata[i].ExpiresValue
		                // obj.schoolId = schoolId;
		                // if (classpricing) {
		                //     ClassPricing.update({ _id: classpricing._id }, { $set: obj });
		                // } else {
		                //     if (obj.packageName) {
		                //         console.log(obj);
		                //         ClassPricing.insert(obj);
		                //     }
		                // }
		                ImportLogs.update({_id: csvLogId},{$inc: {sucessCount:1, totalRecord:1}})
		            } else {
		            	if(!csvdata[i].schoolName ){
		            		csvdata[i]['errorMessage'] = "School name is required";
		            	} else if(!csvdata[i].website){
		            		csvdata[i]['errorMessage'] = "Website URL is required";
		            	} else if(!emailRegex.test(csvdata[i].email)){
		            		csvdata[i]['errorMessage'] = "Invalid email";
		            	}
		            	console.log("I CAlled>>????>>>> ", csvdata[i])
		            	ImportLogs.update({_id: csvLogId},{$inc: {errorRecordCount:1, totalRecord: 1}, $push:{'errorRecord':csvdata[i]}})
		            }

	        	} catch(err){
	        		console.log("error is ", err);
	        		ImportLogs.update({_id: csvLogId},{$inc: {errorRecordCount:1, totalRecord: 1 }, $push:{'errorRecord':csvdata[i]}})
	        	}
	        }
	        ImportLogs.update({_id: csvLogId},{$set: {status:"COMPLETED"}})
    	} else {
    		throw new Meteor.Error("Permission Denied");
    	}
    },
    getErrorDocs: function(logId){
    	if(logId){
    		let log = ImportLogs.findOne({_id: logId});
    		if(log && log.errorRecord && log.errorRecord.length > 0){
    			return log.errorRecord;
    		}
    		return false;
    	} else{
    		throw new Meteor.Error('Log identifier is required')
    	}
    }
})

function CreateNewUser(email, name, firstName, lastName, schoolId) {
	console.log("CreateNewUser -->>",email, name, firstName, lastName)
    if (typeof email !== "undefined" && emailRegex.test(email)) {
        let _user = Accounts.findUserByEmail(email)
        if (!_user) {
            return Accounts.createUser({
                email: email,
                password: email,
                profile: { firstName: firstName, lastName: lastName, schoolId:[schoolId] },
                roles: "Admin",
                preverfiedUser: true
            });
        } else {
        	// Update `schoolId` in `Users` rec.
        	Meteor.users.update(
                    { _id: _user._id },
                    {
                        $addToSet: {
                                "profile.schoolId": schoolId
                        }
                    }
            );
            return _user._id;
        }
    }
    return false;
}

function findUrl(text) {
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

function getLocationTitle(locationData) {

	return `${locationData.state}, ${locationData.city}, ${locationData.country}`
}