import { imageRegex } from '/imports/util';
import '/imports/api/modules/methods';
import '/imports/api/classType/methods';
import '/imports/api/monthlyPricing/methods';
import '/imports/api/classPricing/methods';

export default methods = {
  callMeteorMethod: ({methodName, payload, closeModal}) => {
    console.log("callMeteorMethod -->>",payload)
    Meteor.call(methodName, payload, (error, result) => {
      if (error) {
        console.error("error", error);
      }
      if (result) {
        closeModal();
      }
    });
  },
  callMeteorUpdateMethod: ({methodName, updateKey, payload, closeModal}) => {
    console.log("callMeteorUpdateMethod ->",methodName, updateKey, payload);
    Meteor.call(methodName, updateKey, payload, (error, result) => {
      if (error) {
        console.error("error", error);
      }
      if (result) {
        closeModal()
      }
    });
  },
	addLocation: ({formPayload, props, closeModal}) => {
    console.log("AddLocation function called")
    const { schoolId } = props;
    let payload = formPayload;
    if(schoolId && payload) {
      payload.createdBy = Meteor.userId();
      payload.schoolId = schoolId;
      let sLocationDetail = payload.address + "," + payload.city + "," + payload.zip + "," + payload.country;
      console.log("Final payload 1 -->>",payload)
      
      getLatLong(payload, (data) => {
        
        if (data == null) {
          getLatLongPayload = payload.city + "," + payload.zip + "," + payload.country
          
          getLatLong(getLatLongPayload, (data) => {
            
            if (data == null) {
              toastr.error("Please enter valid address details", "Error");
              return false;
            } else {
              payload.geoLat = data.lat
              payload.geoLong = data.lng
              payload.loc = [data.lat, data.lng]
              console.log("Final payload 2-->>",payload)
              methods.callMeteorMethod({
                methodName: "addLocation", 
                payload: payload, 
                closeModal
              });
            }
          });
        } else {
          payload.geoLat = data.lat
          payload.geoLong = data.lng
          payload.loc = [data.lat, data.lng]
          console.log("Final payload 3-->>",payload)

          methods.callMeteorMethod({
            methodName: "addLocation", 
            payload: payload, 
            closeModal
          });
        }
      });
    }
	},
  editLocation: ({formPayload, props, closeModal, editByFieldValue}) => {
    
    if(!editByFieldValue) {
      toastr.error("Something went wrong.","Error");
      closeModal();
      return
    }

    const { schoolId } = props;
    let payload = formPayload;
    if(schoolId && payload) {
      payload.createdBy = Meteor.userId();
      payload.schoolId = schoolId;
      let sLocationDetail = payload.address + "," + payload.city + "," + payload.zip + "," + payload.country;
      console.log("editLocation Final payload 1 -->>",payload)
      
      getLatLong(payload, (data) => {
        
        if (data == null) {
          getLatLongPayload = payload.city + "," + payload.zip + "," + payload.country
          
          getLatLong(getLatLongPayload, (data) => {
            
            if (data == null) {
              toastr.error("Please enter valid address details", "Error");
              return
            } else {
              payload.geoLat = data.lat
              payload.geoLong = data.lng
              payload.loc = [data.lat, data.lng]
              console.log("editLocation Final payload 2-->>",payload)
              
              methods.callMeteorUpdateMethod({
                methodName: "editLocation", 
                payload: payload, 
                updateKey: editByFieldValue,
                closeModal
              });
            }
          });
        } else {
            payload.geoLat = data.lat
            payload.geoLong = data.lng
            payload.loc = [data.lat, data.lng]
            console.log("editLocation Final payload 3-->>",payload)

            methods.callMeteorUpdateMethod({
              methodName: "editLocation", 
              payload: payload, 
              updateKey: editByFieldValue,
              closeModal
            });
        }
      });
    }
  },
  removeLocation: ({editByFieldValue}) => {
    console.log("removeLocation fn editByFieldValue -->>", editByFieldValue);
    Meteor.call("removeLocation", editByFieldValue, (error, result) => {
      if(error) {
        toastr.error("Unable to delete.","Error");
        return
      }
    });
  },
  addRoom: ({formPayload, closeModal, parentKeyValue}) => {

    formPayload.id = Math.random().toString(36).substr(2, 16);
    Meteor.call("addRoom", formPayload, parentKeyValue, (error, result) => {
      if (result) { 
        closeModal();
      } else if(error) {
        console.error("Error ->>",error)
      }
    });
  },
  editRoom: ({formPayload, closeModal, editByFieldValue, parentKeyValue}) => {
    formPayload.id = editByFieldValue;
    methods.callMeteorUpdateMethod({
        methodName: "editRoom", 
        payload: formPayload, 
        updateKey: parentKeyValue,
        closeModal
    })
  },
  removeRoom: ({editByFieldValue, parentKeyValue}) => {

    Meteor.call("roomRemove", editByFieldValue, parentKeyValue, (error, result) => {
      if(error) {
        toastr.error("Unable to delete.","Error");
        return
      }
    });
  },
  addClassType: ({formPayload, props, closeModal}) => {
    console.log("addClassType method formPayload -->>>",formPayload)
    const { schoolId } = props;
    let payload = formPayload;
    if(schoolId && payload) {
      payload.createdBy = Meteor.userId();
      payload.schoolId = schoolId;
      if(payload.classTypeImg) {
        if(!imageRegex.image.test(payload.classTypeImg.name)) {
          toastr.error("Please enter valid Image file","Error");
          return 
        }
        S3.upload({files: { "0": payload.classTypeImg}, path:"class"}, (err, res) => {
          if(err) {
            console.error("err ",err)
          }
          if(res) {
            payload.classTypeImg = res.secure_url
            methods.callMeteorMethod({methodName: "classType.addClassType", payload, closeModal});
          }
        })
      } else {
        delete payload.classTypeImg
        methods.callMeteorMethod({methodName: "classType.addClassType", payload, closeModal});
      }
    }
  },
  updateClassType: ({formPayload, props, closeModal, editByFieldValue}) => {
    console.log("updateClassType -->>",formPayload, editByFieldValue);
    const { schoolId } = props;
    if(formPayload && editByFieldValue && schoolId) {
      formPayload.schoolId = schoolId;
      if(formPayload.classTypeImg) {
        if(!imageRegex.image.test(formPayload.classTypeImg.name)) {
          toastr.error("Please enter valid Image file","Error");
          return 
        }
        S3.upload({files: { "0": formPayload.classTypeImg}, path:"class"}, (err, res) => {
          if(err) {
            console.error("err ",err)
          }
          if(res) {
            // this.editUserCall(res)
            formPayload.classTypeImg = res.secure_url
            methods.callMeteorUpdateMethod({
              methodName: "classType.editClassType", 
              payload: formPayload, 
              updateKey: editByFieldValue,
              closeModal
            });
          }
        })
      } else {
        delete formPayload.classTypeImg
        methods.callMeteorUpdateMethod({
          methodName: "classType.editClassType", 
          payload: formPayload, 
          updateKey: editByFieldValue, 
          closeModal
        });
      }
    }
  },
  removeClassType: ({formPayload, closeModal}) => {
    methods.callMeteorMethod({
      methodName: "classType.removeClassType", 
      payload: formPayload, 
      closeModal
    });
  },
  addModule: ({formPayload, props, closeModal}) => {
    const { schoolId } = props;
    formPayload.schoolId = schoolId
    methods.callMeteorMethod({
      methodName: "module.addModule", 
      payload: formPayload, 
      closeModal
    });
  },
  editModule: ({formPayload, closeModal, editByFieldValue, props}) => {
    //formPayload.id = editByFieldValue;
    const { schoolId } = props;
    formPayload.schoolId = schoolId
    methods.callMeteorUpdateMethod({
       methodName: "module.editModule", 
       payload: formPayload, 
       updateKey: editByFieldValue, 
       closeModal
    });
  },
  removeModule: ({formPayload, closeModal}) => {
    
    methods.callMeteorMethod({
      methodName: "module.removeModule", 
      payload: formPayload, 
      closeModal
    });
  },
  addMonthlyPackage: ({formPayload, props, closeModal}) => {
    const { schoolId } = props;
    formPayload.schoolId = schoolId;
    methods.callMeteorMethod({
      methodName: "monthlyPricing.addMonthlyPricing", 
      payload: formPayload, 
      closeModal
    });
  },
  editMonthlyPackage: ({formPayload, closeModal, editByFieldValue, props}) => {
    const { schoolId } = props;
    formPayload.schoolId = schoolId;
    methods.callMeteorUpdateMethod({
      methodName: "monthlyPricing.editMonthlyPricing", 
      payload: formPayload, 
      updateKey: editByFieldValue,
      closeModal
    });
  },
  removeMonthlyPackage: ({formPayload, closeModal}) => {
    methods.callMeteorMethod({
      methodName: "monthlyPricing.removeMonthlyPricing", 
      payload: formPayload, 
      closeModal
    });
  },

  addClassPackage: ({formPayload, props, closeModal}) => {
    const { schoolId } = props;
    formPayload.schoolId = schoolId;
    methods.callMeteorMethod({
      methodName: "classPricing.addClassPricing", 
      payload: formPayload, 
      closeModal
    });
  },
  editClassPackage: ({formPayload, closeModal, editByFieldValue, props}) => {
    const { schoolId } = props;
    formPayload.schoolId = schoolId;
    methods.callMeteorUpdateMethod({
      methodName: "classPricing.editclassPricing", 
      payload: formPayload, 
      updateKey: editByFieldValue,
      closeModal
    });
  },
  removeClassPackage: ({formPayload, closeModal}) => {
    methods.callMeteorMethod({
      methodName: "classPricing.removeClassPricing", 
      payload: formPayload, 
      closeModal
    });
  }
}