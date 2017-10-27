Template.Profile.helpers({
  profile_pic: function(pic_id){
    return Images.find({_id:pic_id});
  }
});
Template.Profile.rendered = function(){
  $('.dropdown-toggle').dropdown()
  if(Meteor.user().roles){
    $('#role').val(Meteor.user().roles[0])
  }
}
Template.Profile.events({
  "click .change_password": function(event, template){
    $('#change_password').appendTo("body").modal('show');
  },
  "click #btn_update": function(event, template)
  {
    event.preventDefault();


      var fname = template.find("#firstName").value ;
      // if( !fname || fname.length <= 0 || !fname.trim())
      // {
      //   $("#firstName").removeClass('form-mandatory') ;
      //   $("#firstName").addClass('form-error') ;
      //
      //   return ;
      // }
        var user_obj = Meteor.user()
        var data = {
            //username:template.find("#username").value,
            "profile.lastName":template.find("#lastName").value,
            "profile.firstName":template.find("#firstName").value,
            /*"profile.url":template.find("#url").value,*/
            "profile.phone":template.find("#phone").value,
            "profile.desc":template.find("#desc").value,
            /*"profile.expertise":template.find("#expertise").value,*/
            /*"profile.state":template.find("#state").value*/
        }
        console.log(data)
        var role_name = template.find("#role").value
        console.log(role_name)
        // data = {'$set': data}
          Meteor.call("editUser", data, user_obj._id,role_name,function(error, result){
            if(error){
              console.log("error :"+error);
              console.log("error", error);
            }
            if(result){
              console.log("user update done...");
              Router.go('/');
            }
          });

  }
});
