import Media from "./fields";

Meteor.methods({
   "media.addMedia": function(doc) {
        const user = Meteor.users.findOne(this.userId);
        console.log("media.addMedia methods called!!!");
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "media_CUD" })) {
            doc.createdAt = new Date();
            doc.createdBy = this.userId;
            console.log("media doc ->",doc);
            return Media.insert(doc);
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
});