Template.EditUser.rendered = function(){
  if(Meteor.users.findOne({_id:Router.current().params._id}).roles){
    $('#role').val(Meteor.users.findOne({_id:Router.current().params._id}).roles[0])
  }
}
/**
 * After successful edit, go to List page.
 * See: https://github.com/aldeed/meteor-autoform#callbackshooks
 */
AutoForm.hooks({
  EditUserForm: {
    /**
     * After successful form submission, go to the ListStuff page.
     * @param formType The form.
     * @param result The result of form submission.
     */
    onSuccess: function(formType, result) {
      Router.go('ListUser');
    }
  }
});

Template.EditUser.helpers({
  company_option: function(){
    company_list = Company.find().fetch();
    arraylist = []
    company_list.map(function(doc){
      arraylist.push({label: doc.name, value: doc._id})
    });
    return arraylist;
  },
  user_logo: function(pic_id){
    return Images.find({_id:pic_id});
  },
  id_demo_user:function(value){
    if(value == true){
      return "checked";
    }else{
      return "";
    }
  }
});
Template.EditUser.events(
{
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


        var data = {
             //username:template.find("#username").value,
             "profile.lastName":template.find("#lastName").value,
             "profile.firstName":template.find("#firstName").value,
             /*"profile.url":template.find("#url").value,*/
             "profile.phone":template.find("#phone").value,
             "profile.desc":template.find("#desc").value,
             "profile.is_demo_user": $("#is_demo_user").is(':checked')
             /*"profile.expertise":template.find("#expertise").value,*/
             /*"profile.state":template.find("#state").value,*/
        }
        // data = {'$set': data}

        var role_name = template.find("#role").value

          Meteor.call("editUser", data,Router.current().params._id,role_name,function(error, result){
            if(error){
              console.log("error :"+error);
              console.log("error", error);
            }
            if(result){
              console.log("user update done...");
              Router.go('ListUser');
            }
          });
    }
});
