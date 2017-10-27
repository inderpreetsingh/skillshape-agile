/**
 * After successful addition of a new Stuff document, go to List page.
 * See: https://github.com/aldeed/meteor-autoform#callbackshooks
 */
AutoForm.hooks({
  AddUserForm: {
    /**
     * After successful form submission, go to the ListStuff page.
     * @param formType The form.
     * @param result The result of form submission.
     */

    onSuccess: function(formType, result) {
      Router.go('ListUser');
    },
    onError:  function(formType, result) {
      toastr.error(result.reason,"Error");
    }
  }
});

Template.AddUser.helpers({
  company_option: function(){
    company_list = Company.find().fetch();
    arraylist = []
    company_list.map(function(doc){
      arraylist.push({label: doc.name, value: doc._id})
    });
    return arraylist;
  },
  rendered: function(){

  },
  destroyed: function(){

  }
});
Template.AddUser.events(
{
  "click #btn_submit": function(event, template)
  {

    event.preventDefault();

    var email = template.find("#email").value ;
    if( !email || email.length <= 0 || !email.trim())
    {
      $("#email").removeClass('form-mandatory') ;
      $("#email").addClass('form-error') ;

      return ;
    }

    var fname = template.find("#firstName").value ;
    if( !fname || fname.length <= 0 || !fname.trim())
    {
      $("#firstName").removeClass('form-mandatory') ;
      $("#firstName").addClass('form-error') ;

      return ;
    }


      var user_obj = Meteor.user();
      var data = {
          //username:template.find("#username").value,
          email:template.find("#email").value,
          profile :{
            lastName:template.find("#lastName").value,
             firstName:template.find("#firstName").value,
             desc:template.find("#desc").value,
          }
      }
      // data = {'$set': data}
        Meteor.call("addUser", data,function(error, result){
          if(error){
            console.log("error :"+error);
            console.log("error", error);
          }
          if(result){
            console.log("user update done...");
            Router.go('ListUser');
          }
        });
        Router.go('ListUser');

  }
});
