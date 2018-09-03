import SLocation from "./fields";
import ClassType from "/imports/api/classType/fields";
import ClassTime from "/imports/api/classTimes/fields";

Meteor.methods({
  "location.getLocationBySchoolId": function({ schoolId }) {
    return SLocation.find({ schoolId }).fetch();
  },
  "location.addLocation": function({ doc }) {
    let temp=doc.loc;;
    doc.loc=[temp[1],temp[0]];
    const user = Meteor.users.findOne(this.userId);
    if (
      checkMyAccess({ user, schoolId: doc.schoolId, viewName: "SLocation_CUD" })
    ) {
      
      doc.createdAt = new Date();
      return SLocation.insert(doc);
    } else {
      throw new Meteor.Error("Permission denied!!");
    }
  },
  "location.editLocation": function({ doc_id, doc }) {
    let previousData = SLocation.findOne({_id:doc_id});
    if(previousData && previousData.loc != doc.loc){
      let temp=doc.loc;;
      doc.loc=[temp[1],temp[0]];
    }
    
    const user = Meteor.users.findOne(this.userId);
    if (
      checkMyAccess({ user, schoolId: doc.schoolId, viewName: "SLocation_CUD" })
    ) {
      let ClassTypeData = ClassType.find().fetch();
      ClassTypeData.map((currentClassType)=>{
        currentClassType.filters && currentClassType.filters['location'] &&
         currentClassType.filters['location'].map((currentLocation,index)=>{
         if(currentLocation && currentLocation['loc'] && currentLocation['loc']["locationId"] &&
         currentLocation['loc']["locationId"] == doc_id){
              currentLocation['loc']['coordinates'] =doc.loc;
              currentLocation['loc']['title']=`${doc.state}, ${doc.city}, ${doc.country}`
              ClassType.update({_id:currentClassType._id},{$set:{filters:currentClassType.filters}})
         } 
        })
      })
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
      let ClassTypeData = ClassType.find().fetch();
      let pos;
      ClassTypeData.map((currentClassType)=>{
        currentClassType.filters && currentClassType.filters['location'] &&
         currentClassType.filters['location'].map((currentLocation,index)=>{
         if(currentLocation && currentLocation['loc'] && currentLocation['loc']["locationId"] &&
         currentLocation['loc']["locationId"] == doc._id){
          pos =index;
          currentClassType.filters['location'].splice(pos,1);
          ClassType.update({_id:currentClassType._id},{$set:{filters:currentClassType.filters}})
         } 
        })
      })
      
      ClassTime.update({locationId:doc._id},{$set:{locationId:'',roomId:''}},{multi:true});

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
