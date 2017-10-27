Template.Login.rendered = function(){
  $('html').removeClass('nav-open');

  $('.close-layer').remove();
  setTimeout(function(){
    if($toggle){
      $toggle.removeClass('toggled');
    }
  }, 400);
  mobile_menu_visible = 0;
}
Template.Login.events({
  "click #btn_login": function(event, template){
    event.preventDefault();
    console.log("test");
    var eamil = $('#loginmodal').find('#email').val();
    var password = $('#loginmodal').find('#password').val();
    Meteor.loginWithPassword(eamil, password,function(error)
     {
         if(error)
         {

            //  toastr.error(error.reason,"Error");
            $('#loginmodal').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            console.log(login_fail_count);
          if (login_fail_count > 2){
            $('#loginmodal').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            $('body').removeAttr("style");
            $('#forget_pass_modal').modal('show');
            $('#loginmodal').modal('hide');
            $('#signupmodal').modal('hide');
            Router.go('ForgotPassword');
          }else{
            if(error.reason ==  "Incorrect password"){
              login_fail_count = login_fail_count + 1;
              swal({
                      title: error.reason,
                      buttonsStyling: false,
                      confirmButtonClass: "btn btn-success",
                      timer: 2000 ,
                      html: error.reason
                    }).then(
                    function() {},
                    function() {}
                  );
            }else{
              swal({
                    title: 'Unauthorised User',
                    buttonsStyling: false,
                    confirmButtonClass: "btn btn-success",
                    timer: 2000,
                    html:
                            'Cannot Login Please contact, ' +
                            '<a href="#">Admin</a> ' +
                            ''
                  }).then(
                  function() {},
                  function() {}
                );
            }
          }
         }
         else
         {
           $('#loginmodal').modal('hide');
           var user_id = Meteor.userId()
           $('body').removeClass('modal-open');
           $('.modal-backdrop').remove();
           console.log(IsDemoUser());
           if(IsDemoUser()){
             if (Meteor.user().profile.role == 'Admin')
             {
                    Router.go('ScheduleView');
             }
             else
             {
               Router.go('ScheduleView');
             }
           }else{
             Router.go('Home');
           }


         }
     });
  }
});
