import Classes from "/imports/api/classes/fields";
import SLocation from "/imports/api/sLocation/fields";
import ClassPricing from "/imports/api/classPricing/fields";
import MonthlyPricing from "/imports/api/monthlyPricing/fields";
import ClassType from "/imports/api/classType/fields";

Meteor.publish("classes.userClasses", function({ userId }) {

    const user = Meteor.users.findOne({ _id: userId });
    let classIds = [];
    if(user && user.profile) {
        
        let joinClass = user.profile.classIds || [];
        
        if (user.profile.schoolId) {
            classIds = Classes.find({ schoolId: user.profile.schoolId }).map(function(a) {
                return a._id
            })
        }

        classIds = classIds.concat(joinClass);

        let schoolIds = Classes.find({ _id: { $in: classIds } }).map(function(a) {
            return a.schoolId
        })

        console.log("classIds -->>",classIds)
        console.log("schoolIds -->>",schoolIds)
        // console.log("classes data -->>",Classes.find({ _id: { $in: classIds } }).fetch());
        return [
            Classes.find({ _id: { $in: classIds } }), 
            SLocation.find({ schoolId: { $in: schoolIds } }), 
            ClassPricing.find({ schoolId: { $in: schoolIds } }), 
            MonthlyPricing.find({ schoolId: { $in: schoolIds } }), 
            ClassType.find({ schoolId: { $in: schoolIds } }), 
            School.find({ _id: { $in: schoolIds } })
        ]


    }
    return classIds;
})