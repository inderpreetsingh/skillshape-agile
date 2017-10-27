Template.comingSoonPage.events({
"click #btn_notify" : function(e,t){
  e.preventDefault();
  console.log("message");
  email = $('#alert_me_email').val()
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

  if(!emailReg.test(email))
  {
      toastr.error("Please enter valid email address","Error");
      return false;
  }
  if(email){

  }else{
    toastr.error("Please enter valid email address","Error");
    return false;
  }
  var LocationName = $('#location').val()
  var skill = $('#cskill').val()
  var classPrice = $('#HclassPrice').val()
  var monthPrice = $('#HmonthPrice').val()
  var doc = {
    email :email,
    location:LocationName,
    skill:skill,
    classPrice:classPrice,
    monthPrice:monthPrice
  }
  console.log(doc);

  Meteor.call("addUserDemand", doc,function(e,r){
    if(e){

    }else{
      toastr.success("Thanks for submit you interest.We will getback to you once any class available based on your search parameter.","Found your location");
    }
  });
  return false;
}
});
