import SLocation from "./fields";

Meteor.methods({
    "location.getLocationBySchoolId": function({ schoolId }) {
        return SLocation.find({ schoolId }).fetch()
    },
    "location.addLocation": function({doc}) {
        const user = Meteor.users.findOne(this.userId);
        console.log("location.addModule methods called!!!");
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "SLocation_CUD" })) {
            // doc.remoteIP = this.connection.clientAddress;
            doc.createdAt = new Date();
            console.log("location.addModule doc -->>", doc);
            return SLocation.insert(doc);
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "location.editLocation": function({doc_id, doc}) {
        const user = Meteor.users.findOne(this.userId);
        console.log("location.editModule methods called!!!", doc_id, doc);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "SLocation_CUD" })) {
            console.log(doc);
            return SLocation.update({ _id: doc_id }, { $set: doc });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "location.removeLocation": function({doc}) {
        const user = Meteor.users.findOne(this.userId);
        console.log("location.removeModule methods called!!!", doc);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "SLocation_CUD" })) {
            return SLocation.remove({ _id: doc._id });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "location.addRoom": function({locationId, data}) {
        console.log(data);
        console.log(locationId);
        data.id = Math.random().toString(36).substr(2, 16);
        return SLocation.update({ _id: locationId }, { $push: { "rooms": data } });
    },
    "location.editRoom": function({locationId, data}) {
        console.log("location.editRoom data -->>",data);
        console.log("location.editRoom location -->>",locationId);
        return SLocation.update({ _id: locationId, "rooms.id": data.id }, { $set: { "rooms.$": data } });
    },
    "location.roomRemove": function({locationId, data}) {
        SLocation.update({ _id: locationId }, { $pull: { "rooms": { id: data.id } } }, { multi: true });
        return true;
    }
});