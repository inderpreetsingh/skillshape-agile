export default methods = {
	addLocation: (payload,closeModal)=> {
		console.log("AddLocation function called")
		var locationObj = {}
    locationObj.createdBy = Meteor.userId();
    locationObj.schoolId = Router.current().params.schoolId;
    locationObj.title = payload.title;
    locationObj.address = payload.address;
    locationObj.city = payload.city;
    locationObj.neighbourhood = payload.neighbourhood;
    locationObj.state = payload.state;
    locationObj.zip = payload.zip;
    locationObj.country = payload.country;
    let sLocationDetail = locationObj.address + "," + locationObj.city + "," + locationObj.zip + "," + locationObj.country;
	}
}