import Media from "./fields";
import get from 'lodash/get';

Meteor.methods({
   "media.addMedia": function(doc) {
        const user = Meteor.users.findOne(this.userId);
        // console.log("media.addMedia methods called!!!");
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "media_CUD" })) {
            doc.createdAt = new Date();
            doc.createdBy = this.userId;
            doc.users_permission = {
                [this.userId]: {
                    accessType: user.media_access_permission || "public"
                }
            }
            doc.accessType = user.media_access_permission || "public";
            // doc.taggedUserIds = [];
            // console.log("media doc ->",doc);
            return Media.insert(doc);
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "media.editMedia": function(doc_id, doc) {
        // console.log("media.editMedia methods called!!!",doc_id, doc);
        let payload = {...doc, accessType: 'public'};
        const mediaData = Media.findOne({ _id: doc_id });
        let userPermissionData = get(mediaData, "mediaData.users_permission", {});

        if(doc.users_permission) {
            userPermissionData = {...userPermissionData, ...payload.users_permission}
        }

        for(let key in userPermissionData) {

            if(userPermissionData[key].accessType === 'member') {
                payload.accessType = 'member';
                break;
            }
        }

        if(payload.taggedObj && payload.taggedObj.memberId) {
            let taggedMemberIds = new Set(mediaData.taggedMemberIds || []);
            if(payload.taggedObj.memberTaggedStatus) {
                taggedMemberIds.add(payload.taggedObj.memberId)
            } else {
                taggedMemberIds.delete(payload.taggedObj.memberId)
            }
            payload.taggedMemberIds = Array.from(taggedMemberIds);
            delete payload.taggedObj
        }

        // console.log("media.editMedia -->>",payload);
        return Media.update({ _id: doc_id }, { $set: payload });
        // return Media.update({ _id: doc_id }, { $set: doc });
        // const user = Meteor.users.findOne(this.userId);
        // if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "media_CUD" })) {
        // } else {
        //     throw new Meteor.Error("Permission denied!!");
        // }
    },
    "media.removeMedia": function(doc) {
        const user = Meteor.users.findOne(this.userId);
        // console.log("media.removeModule methods called!!!",doc);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "media_CUD" })) {
            return Media.remove({ _id: doc._id });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
});