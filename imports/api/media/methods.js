import Media from "./fields";

Meteor.methods({
   "media.addMedia": function(doc) {
        const user = Meteor.users.findOne(this.userId);
        // console.log("media.addMedia methods called!!!");
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "media_CUD" })) {
            doc.createdAt = new Date();
            doc.createdBy = this.userId;
            // console.log("media doc ->",doc);
            return Media.insert(doc);
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "media.editMedia": function(doc_id, doc) {
        const user = Meteor.users.findOne(this.userId);
        // console.log("media.editMedia methods called!!!",doc_id, doc);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "media_CUD" })) {
            return Media.update({ _id: doc_id }, { $set: doc });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "media.removeModule": function(doc) {
        const user = Meteor.users.findOne(this.userId);
        // console.log("media.removeModule methods called!!!",doc);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "media_CUD" })) {
            return Media.remove({ _id: doc._id });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
});