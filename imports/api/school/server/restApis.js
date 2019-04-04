import SLocation from "/imports/api/sLocation/fields";
import ClassType from "/imports/api/classType/fields";
import ClassTimes from "/imports/api/classTimes/fields";
import School from "../fields";
import SkillCategory from "/imports/api/skillCategory/fields";
import SkillSubject from "/imports/api/skillSubject/fields";
import {uniq,isEmpty} from "lodash";

import  bodyParser from "body-parser";
Picker.middleware(bodyParser.json());
Picker.middleware(bodyParser.urlencoded({ extended: false }));


Picker.route("/api/v1/schools",(params, req, res, next  )=>{
    try{
      let payload = {};
      let {schoolName,location,skillCategory,skillSubject,experienceLevel,gender,age} = req.body;
      let filter = {},classTypeFilter = {};
      
      // Add schoolName Filter if schoolName Available
      if(schoolName){
        schoolName = schoolName.split(" ");
        let schoolNameRegEx = [];
        schoolName.map((str)=>{
            schoolNameRegEx.push(new RegExp(`.*${str}.*`, 'i'))
          });
        filter.name = {$in:schoolNameRegEx};
      }

      // Add Gender Filter for class type
      if (gender) {
        classTypeFilter["gender"] = gender;
      }

      // Add Age Filter for class type
      if (age) {
        age = Number(age);
        classTypeFilter["ageMin"] = { $lte: age };
        classTypeFilter["ageMax"]  = { $gte: age };
      }
      
      // Add experienceLevel Filter for class type
      if (experienceLevel) {
        age = Number(age);
        classTypeFilter["experienceLevel"] = experienceLevel;
      }
      
      console.log("TCL: classTypeFilter", classTypeFilter)
      if(!isEmpty(classTypeFilter)){
       let classTypeData =  ClassType.find(classTypeFilter).fetch();
       console.log("TCL: classTypeData", classTypeData.length)
       if(!isEmpty(classTypeData)){
         let schoolIds = [];
         classTypeData.map((obj)=>{
            if(obj.schoolId)
            schoolIds.push(obj.schoolId);
         })
         schoolIds = uniq(schoolIds);
         if(!isEmpty(schoolIds)){
           filter._id = {$in:schoolIds};
         }
       }
      }
      let result = [];
			console.log("TCL: filter", filter)
      if(!isEmpty(filter))
      result = School.find(filter,{fields:{name:1}}).fetch();
      payload = {result:result};
      res.end(JSON.stringify(payload));
    }catch(error){
      console.log("Error in /api/v1/schools", error);
      payload = {error : 'Something Went Wrong'};
      res.end(JSON.stringify(payload));
    }
  })