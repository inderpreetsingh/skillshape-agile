if(Meteor.isClient){
  Template.RecoverPassword.helpers({
    resetPassword: function(){
      token = Router.current().params.token
      Session.set('resetPassword', token);
      return Session.get('resetPassword');
    }
  });
Template.RecoverPassword.events({
  'submit #sendEmail': function(event, template){
    event.preventDefault();
    template.find('#warning').innerHTML = "";
    template.find('#success').innerHTML = "";
    var email = template.find('#recover-email').value.trim();
    Accounts.forgotPassword({email: email}, function(err) {
      if (err){
        if (err.message === 'User not found [403]') {
          template.find('#warning').innerHTML = "There is no account registered with this email!";
        }else{
          console.log(err.message);
          template.find('#warning').innerHTML = "We are sorry but something went wrong.";
        }
      }else{
        template.find('#success').innerHTML = "An email has been sent";
      }
    });
  },
  'click #resetPassword': function(e, t) {
    e.preventDefault();
    var password = t.find('#resetPasswordPassword').value;
    var passwordConfirm = t.find('#resetPasswordPasswordConfirm').value;
    console.log("pwd : " + password);
    if(password.length < 1){
      toastr.error("Please enter password","Error");
      return false;
    }
    if(password != passwordConfirm){
      toastr.error("Please enter valid confirm password","Error");
      return false;
    }
    if (true){
      Accounts.resetPassword(Session.get('resetPassword'), password, function(err) {
        if (err) {
          console.log(err.message);
          toastr.error("We are sorry but something went wrong.");
        } else {
          toastr.success("Your password as been updated!");
          Session.set('resetPassword', null);
          Router.go('Home');
        }
      });
    }
  }
});
}
