import ClassType from "./fields";
import ClassTimes from "/imports/api/classTimes/fields";
import ClassInterest from "/imports/api/classInterest/fields";
import SLocation from "/imports/api/sLocation/fields";

Meteor.methods({
    "classType.getClassType": function({schoolId}) {

        return ClassType.find({schoolId}).fetch();
    },
    "classType.getClassTypeByTextSearch": function({schoolId, textSearch}) {

        return ClassType.find({schoolId: schoolId, name: { $regex: new RegExp(textSearch, 'mi') }},{limit: 10,fields:{name:1}}).fetch();
    },
    "classType.addClassType": function({doc}) {
         const user = Meteor.users.findOne(this.userId);
        // console.log("classType.addClassType methods called!!!");
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "classType_CUD" })) {
            // doc.remoteIP = this.connection.clientAddress;
            const temp = {...doc};
            if(temp.locationId) {
                const location = SLocation.findOne(doc.locationId);
                temp.filters =  temp.filters ? temp.filters : {};
                temp.filters["location"] = location.loc;
                // doc.filters["state"] = location.state;
                temp.filters["locationTitle"] = `${location.state}, ${location.city}, ${location.country}`;
            }
            temp.createdAt = new Date();

            return ClassType.insert(temp);
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "classType.editClassType": function({doc_id, doc}) {
        const user = Meteor.users.findOne(this.userId);
        console.log("classType.editClassType methods called!!!",doc_id, doc);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "classType_CUD" })) {
            const temp = {...doc};
            if(temp.locationId) {
                const location = SLocation.findOne(temp.locationId);
                temp.filters =  temp.filters ? temp.filters : {};
                temp.filters["location"] = location.loc;
                // temp.filters["state"] = location.state;
                temp.filters["locationTitle"] = `${location.state}, ${location.city}, ${location.country}`;
            }
            return ClassType.update({ _id: doc_id }, { $set: temp });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "classType.removeClassType": function({doc}) {
        const user = Meteor.users.findOne(this.userId);
        console.log("classType.removeClassType methods called!!!",doc);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "classType_CUD" })) {
            ClassTimes.remove({classTypeId: doc._id})
            ClassInterest.remove({classTypeId: doc._id})
            return ClassType.remove({ _id: doc._id });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    }
});