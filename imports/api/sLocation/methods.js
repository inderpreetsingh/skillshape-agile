import SLocation from "./fields";
import ClassType from "/imports/api/classType/fields";

Meteor.methods({
  "location.getLocationBySchoolId": function({ schoolId }) {
    return SLocation.find({ schoolId }).fetch();
  },
  "location.addLocation": function({ doc }) {
    const user = Meteor.users.findOne(this.userId);
    if (
      checkMyAccess({ user, schoolId: doc.schoolId, viewName: "SLocation_CUD" })
    ) {
      // doc.remoteIP = this.connection.clientAddress;
      doc.createdAt = new Date();
      return SLocation.insert(doc);
    } else {
      throw new Meteor.Error("Permission denied!!");
    }
  },
  "location.editLocation": function({ doc_id, doc }) {
    const user = Meteor.users.findOne(this.userId);
    if (
      checkMyAccess({ user, schoolId: doc.schoolId, viewName: "SLocation_CUD" })
    ) {
      ClassType.update(
        { locationId: doc_id },
        {
          $set: {
            "filters.location": doc.loc,
            "filters.locationTitle": `${doc.state}, ${doc.city}, ${doc.country}`
          }
        },
        { multi: true }
      );

      return SLocation.update({ _id: doc_id }, { $set: doc });
    } else {
      throw new Meteor.Error("Permission denied!!");
    }
  },
  "location.removeLocation": function({ doc }) {
    const user = Meteor.users.findOne(this.userId);
    if (
      checkMyAccess({ user, schoolId: doc.schoolId, viewName: "SLocation_CUD" })
    ) {
      ClassType.update(
        { locationId: doc._id },
        { $set: { locationId: null, "filters.location": null } },
        { multi: true }
      );
      return SLocation.remove({ _id: doc._id });
    } else {
      throw new Meteor.Error("Permission denied!!");
    }
  },
  "location.addRoom": function({ locationId, data }) {
    data.id = Math.random()
      .toString(36)
      .substr(2, 16);
    return SLocation.update({ _id: locationId }, { $push: { rooms: data } });
  },
  "location.editRoom": function({ locationId, data }) {
    return SLocation.update(
      { _id: locationId, "rooms.id": data.id },
      { $set: { "rooms.$": data } }
    );
  },
  "location.roomRemove": function({ locationId, data }) {
    SLocation.update(
      { _id: locationId },
      { $pull: { rooms: { id: data.id } } },
      { multi: true }
    );
    return true;
  }
});
