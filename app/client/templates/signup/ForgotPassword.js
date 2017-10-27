Template.ForgotPassword.rendered = function(){
  $('html').removeClass('nav-open');

  $('.close-layer').remove();
  setTimeout(function(){
    if($toggle){
      $toggle.removeClass('toggled');
    }
  }, 400);
  mobile_menu_visible = 0;
}
Template.ForgotPassword.events({
  "click #btn_reset_password": function(event, template){
      event.preventDefault();
      var email =  $('#forget_pass_modal').find('#email').val();
      console.log(email)
      if(email.length < 1){
        toastr.error("Please enter email address","Error");
        return false;
      }
      var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
      if(!emailReg.test(email))
      {
          toastr.error("Please enter valid email address","Error");
          return false;
      }
      Accounts.forgotPassword({email:email}, function(err) {
        if (err) {
          if (err.message === 'User not found [403]') {
            toastr.error("This email does not exist.","Error");
          } else {
            toastr.error("We are sorry but something went wrong.","Error");
            console.log('We are sorry but something went wrong.');
          }
        } else {
          toastr.success("Email Sent. Check your mailbox.","Success");
          $('#forget_pass_modal').modal('hide');
        }
      });
    console.log("btn_reset_password");
  }
});
