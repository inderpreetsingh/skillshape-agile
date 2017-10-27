Template.ListUser.helpers({
  companyList: function () {
    return Company.find();
  },user_count: function () {
   return Meteor.users.find().count() >= 5;
 },
});

Template.User.helpers({
  user_logo: function(pic_id){
    return Images.find({_id:pic_id});
  }
});
Template.ListUser.rendered = function(){

}

Template.ListUser.events({
  "click .delete": function(event, template){
    var id = $(this).data("id");
    var id = $(event.currentTarget).attr('data-id');
    console.log(id);
      Meteor.call("deleteUser", id, function(error, result){
        if(error){
          console.log("error", error);
        }
        if(result){
          toastr.success("User has been deleted.","Success");
        }
      });
  }
});

Template.registerHelper("user_logo", function (id)
{
  var ret ;

  ret = Images.find({_id:id});
  console.log(ret ) ;

  return ret ;
});

Template.registerHelper("is_admin", function (user_id) {
  if(Meteor.user()){
    return Meteor.user().profile.role == 'Admin'
  }else{
    return false;
  }
});

Template.UserActionBtns.events({
  "click .admin": function(event, template){
    var id = $(event.currentTarget).attr('data-id');
    Meteor.call("setAdmin", id, function(error, result){
      if(error){
        console.log("error", error);
      }
      if(result){

      }
    });
  },
  "click .normal": function(event, template){
    var id = $(event.currentTarget).attr('data-id');
    Meteor.call("setNormal", id, function(error, result){
      if(error){
        console.log("error", error);
      }
      if(result){

      }
    });
  }
});
Template.UserActionBtns.helpers({
  is_admin_user : function(user){
    return user.profile.role == "Admin"
  },
  is_login_user:function(user){
    return Meteor.userId() != user._id
  }
});
