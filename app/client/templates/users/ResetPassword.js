Template.ResetPassword.events({
  'click #resetPasswordForm': function(e, t) {
    e.preventDefault();
    var resetPasswordForm = $("#reset_password"),
        password = resetPasswordForm.find('#resetPasswordPassword').val(),
        passwordConfirm = resetPasswordForm.find('#resetPasswordPasswordConfirm').val();
        if(password != passwordConfirm){
          toastr.error("Please enter valid confirm password","Error");
          return false;
        }

        console.log(password)
        console.log(Router.current().params.id)
      Accounts.resetPassword(Router.current().params.id, password, function(err) {
        if (err) {
          console.log('We are sorry but something went wrong.');
        } else {
          toastr.success("Your password has been changed. Welcome back!","Success");
          Router.go('Home');
        }
      });
    return false;
  }
});
