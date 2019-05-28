import ClassType from "../fields";
import bodyParser from "body-parser";
import { isEmpty, isArray } from "lodash";
Picker.middleware(bodyParser.json());
Picker.middleware(bodyParser.urlencoded({ extended: false }));

Picker.route("/api/v1/classTypes/", (params, req, res, next) => {
  try {
    let {
      schoolName,
      coords,
      skillCategoryIds,
      skillSubjectIds,
      experienceLevel,
      gender,
      age,
      locationName
    } = req.body;
    let payload = {};
    let classTypeFilter = {};

    // Add SchoolName to classType Filter;
    if (schoolName) {
      classTypeFilter["$text"] = { $search: schoolName };
    }

    // Add Gender Filter for class type
    if (gender) {
      classTypeFilter["gender"] = gender;
    }

    // Add Age Filter for class type
    if (age) {
      age = Number(age);
      classTypeFilter["ageMin"] = { $lte: age };
      classTypeFilter["ageMax"] = { $gte: age };
    }

    // Add experienceLevel Filter for class type
    if (experienceLevel) {
      classTypeFilter["experienceLevel"] = experienceLevel;
    }

    //  Add skillCategory Filter for class type;
    if (skillCategoryIds && !isEmpty(JSON.parse(skillCategoryIds))) {
      skillCategoryIds = JSON.parse(skillCategoryIds);
      classTypeFilter["skillCategoryId"] = { $in: skillCategoryIds };
    }

    // Add SkillSubjects Filter for class type;
    if (skillSubjectIds && !isEmpty(JSON.parse(skillSubjectIds))) {
      skillSubjectIds = JSON.parse(skillSubjectIds);
      classTypeFilter["skillSubject"] = { $in: skillSubjectIds };
    }

    // Add Location Name Filter for class type;
    if (locationName) {
      classTypeFilter["$text"] = { $search: locationName };
    }

    // Add Coords Filter for class type;
    if (coords) {
      coords = JSON.parse(coords);
      let maxDistance = 50;
      maxDistance /= 63;
      if (isArray(coords)) {
        classTypeFilter["filters.location.loc"] = {
          $geoWithin: { $center: [[coords[1], coords[0]], maxDistance] }
        };
      }
    }

    if (!isEmpty(classTypeFilter)) {
      let result = ClassType.find(classTypeFilter).fetch();
      payload = { result };
    }
    res.end(JSON.stringify(payload));
  } catch (error) {
    console.log("Error in /api/v1/classTypes/", error);
    payload = { error: "Something Went Wrong" };
    res.end(JSON.stringify(payload));
  }
});
