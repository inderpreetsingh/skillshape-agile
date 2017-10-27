Template.MVPSidebar.created = function(){
  var self = this;
   this.autorun(function () {
     if(Meteor.userId()){
       self.subscribe("ClaimRequest",Meteor.userId())
     }
   });
};
Template.MVPSidebar.helpers(
{
  claimRequest : function(){
    return ClaimRequest.find({userId:Meteor.userId()})
  },
  claimRequestPresnet : function(){
    return ClaimRequest.find({userId:Meteor.userId()}).fetch().length > 0
  },
  user_name : function(){
    var user = Meteor.user();
    if ( user ) {
      if(user.profile && user.profile && user.profile.firstName){
        name = user.profile.nickame
        if(name && name != undefined && name != "undefined"){
          name = name
        }else{
          name = ""
        }
        return user.profile.firstName+" "+name
      }else{
        return Meteor.user().emails[0].address
      }
    }
  },
  checkElement : function(list){
    return list && list.length > 0
  },
  school_list : function(){
    return Session.get("ConnectedSchool");
  },
  mySchool : function(){
    return Session.get("MySchool");
  },
  user_id:function(){
    return Meteor.userId()
  },
  pic:function(){
    var user = Meteor.user();
    if ( user ) {
      if(user.profile){
        return user.profile.pic
      }
    }
  },
  is_school : function(){
    access_type =false;
    var user = Meteor.user();
    if ( user ) {
      if(user.profile){
        access_type =  user.profile.acess_type == "school"
      }
    }
    return access_type;
  }
});
loadConnectedSchool = function(){
  Meteor.call("getConnectedSchool", Meteor.userId(), function(error, result){
    if(error){
      console.log("error", error);
    }
    if(result){
      Session.set("ConnectedSchool",result)
    }
  });
}
loadMySchool = function(){
  if(Meteor.user() && Meteor.user().profile && Meteor.user().profile.schoolId && Meteor.user().profile.schoolId.length > 1){
    school_id = Meteor.user().profile.schoolId
    Meteor.call("getMySchool", school_id,Meteor.userId(),function(error, result){
      if(error){
        console.log("error", error);
      }
      if(result){
        console.log(result);
        Session.set("MySchool",result)
      }
    });
  }
}
Template.MVPSidebar.rendered = function()
{
  Session.set("ConnectedSchool",[])
  Session.set("MySchool",[])
  if(Meteor.userId()){
    loadConnectedSchool();
    loadMySchool();
  }
}
Template.MVPSidebar.events(
{
  "click .claimProgress":function(){
    toastr.success("We are in progress of resolving claim dispute.We will update you once claim process resolve and assign school to you.","");
  },
  "click .comming_soon": function(){
    swal({
        title: 'Comming Soon',
        text: "Comming Soon !",
        type: 'success',
        // showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then(function()
      {})
  },
  "click .scroll_top" : function(event, template){
    $('.sidebar-wrapper').animate({ scrollTop: $(event.currentTarget).offset().top+300}, 500);
  }
});
