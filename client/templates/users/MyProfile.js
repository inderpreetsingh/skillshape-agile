Template.MyProfile.helpers({
  pic:function(){
    var user = Meteor.user();
    if ( user ) {
      if(user.profile){
        return user.profile.pic
      }
    }
  },
  firstName: function(){
    var user = Meteor.user();
    if ( user ) {
      if(user.profile){
        return user.profile.firstName
      }
    }
  },
  lastName: function(){
    var user = Meteor.user();
    if ( user ) {
      if(user.profile){
        return user.profile.lastName
      }
    }
  },
  nickame: function(){
    var user = Meteor.user();
    if ( user ) {
      if(user.profile){
        return user.profile.nickame
      }
    }
  },
  address: function(){
    var user = Meteor.user();
    if ( user ) {
      if(user.profile){
        return user.profile.address
      }
    }
  },
  dob: function(){
    var user = Meteor.user();
    if ( user ) {
      if(user.profile){
        return user.profile.dob
      }
    }
  },
  email: function(){
    var user = Meteor.user();
    if ( user ) {
      if(user.profile){
        return Meteor.user().emails[0].address
      }
    }
  },
  phone:function(){
    var user = Meteor.user();
    if ( user ) {
      if(user.profile){
        return user.profile.phone
      }
    }
  },
  gender: function(){
    var user = Meteor.user();
    if ( user ) {
      if(user.profile){
        $('#gender').val(user.profile.gender);
      }
    }

  }
});
Template.MyProfile.events({
  "click #btn_update_user": function(event, template){
    var user_obj = Meteor.user()
    if($("#ProfileImage")[0].files.length > 0){
      var files = $("#ProfileImage")[0].files
      var fileName = files[0].name;
      if (!(/\.(gif|jpg|jpeg|tiff|png)$/i).test(fileName)) {
        toastr.error("Please enter valid Image file","Error");
        return false;
     }
     S3.upload({
         files:files,
         path:"profile"
       },function(e,r){
         var data = {
             "profile.nickame":template.find("#nickame").value,
             "profile.lastName":template.find("#lastName").value,
             "profile.firstName":template.find("#firstName").value,
             "profile.phone":template.find("#phone").value,
             "profile.pic":r.secure_url,
             "profile.gender":template.find("#gender").value,
             "profile.dob":template.find("#dob").value,
             "profile.address":template.find("#address").value
         }
         Meteor.call("editUser", data, user_obj._id,null,function(error, result){
           if(error){
             console.log("error", error);
           }
           if(result){
             console.log("user update done...");
             Router.go('/');
           }
         });
         setTimeout(function() {
           $(".fileinput").fileinput('clear')
         },1000);
     });
   }else{
     var data = {
         "profile.nickame":template.find("#nickame").value,
         "profile.lastName":template.find("#lastName").value,
         "profile.firstName":template.find("#firstName").value,
         "profile.phone":template.find("#phone").value,
         "profile.gender":template.find("#gender").value,
         "profile.dob":template.find("#dob").value,
         "profile.address":template.find("#address").value
     }
     Meteor.call("editUser", data, user_obj._id,null,function(error, result){
       if(error){
         console.log("error", error);
       }
       if(result){
         console.log("user update done...");
         Router.go('/');
       }
     });
   }
  }
});
Template.MyProfile.rendered = function(){
  $('.datepicker').datetimepicker({
     format: 'MM/DD/YYYY',
     icons: {
         time: "fa fa-clock-o",
         date: "fa fa-calendar",
         up: "fa fa-chevron-up",
         down: "fa fa-chevron-down",
         previous: 'fa fa-chevron-left',
         next: 'fa fa-chevron-right',
         today: 'fa fa-screenshot',
         clear: 'fa fa-trash',
         close: 'fa fa-remove',
         inline: true
     }
  });

  setTimeout(function() {
    var user = Meteor.user();
    if ( user ) {
      if(user.profile){
        $('#gender').val(user.profile.gender);
        $('#dob').val(user.profile.dob);
      }
    }
  },1000);
}
