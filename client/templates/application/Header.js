Template.Header.helpers({
  is_assessment_page: function(){
    return Iron.Location.get().path == "/assessment" || Iron.Location.get().path == "/timeline/domain"
  }
});
Template.Header.events({
   "click #btnTextSearch" : function(e){
      searchParams = $('#searchParams').val()
      Session.set("textSearch",searchParams)
      Session.set("initNearByLocation",false)
      var currentRoute = Router.current().originalUrl;
      if(currentRoute.split("/").length != 4){
        Router.go('/')
      }
    },
    "click .login": function(event, template) {
        console.log("event")
        event.preventDefault();
        $('#signupmodal').modal('hide')
        $('#loginmodal').modal('show')

    },
    "click .downloadreport": function() {
      if(Meteor.user()){
        var company = Company.findOne({'base_company': true, 'user_id': Meteor.userId()});
        var companyId = company && company._id;
        window.open('/pdf/' +companyId +'/print');

      }else{
        $('#signupmodal').modal('show')
      }
        // $(".collapse").toggleClass('in')
        // var wrapperhtml = $('.sidebar').html();
        // var docDefinition = { content: wrapperhtml }
        // pdfMake.createPdf(docDefinition).open();

    },

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
      },
      "click .sheade" : function(event, template){
        $('.sheade').removeClass('active');
        $(event.currentTarget).addClass('active');
      },
      "click .forgetPass":function(event, template){
        $('#loginmodal').modal('hide');
        $('#signupmodal').modal('hide');
        $('#forget_pass_modal').modal('show');
      },
      "click .btn_sign_up": function(event, template){
        event.preventDefault();
        var eamil = $('#signupmodal').find('#email').val();
        var password = $('#signupmodal').find('#password').val();
        var re_password = $('#signupmodal').find('#re_password').val();
        var fname = $('#signupmodal').find('#fname').val();
        var lname = $('#signupmodal').find('#lname').val();
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        if(!emailReg.test(eamil))
        {
            toastr.error("Please enter valid email address","Error");
            return false;
        }
        if(password != re_password){
          toastr.error("Please enter valid confirm password","Error");
          return false;
        }

        //Meteor.loginWithPassword(emailVar, passwordVar);
        // $('#userwelcomemodel').modal('show');

        //
        // control registration with flag
       profile = {"lastName":lname,"firstName":fname}
       Accounts.createUser({email: eamil,password: password,profile:profile},
          function(error){
              if(error)
              {
                toastr.error(error.reason,"Eroor");
              }
              else
              {
                $('#signupmodal').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                var user_id = Meteor.userId();
                Meteor.call( 'sendVerificationLink', function( error, response )  {
                  if ( error ) {
                    toastr.error(error.reason,"Error");
                  } else {
                    var email = Meteor.user().emails[ 0 ].address;
                    toastr.success("Verification sent to "+email+"","Success");
                  }
                });
                var role_name = "Admin"
                data = null;
                var active_selection = $('.sheade.active').attr("id");
                if(active_selection == "student-tab"){
                  data = {"profile.acess_type":"student"}
                  role_name = "Student"
                }
                else{
                  data = {"profile.acess_type":"school"}
                  role_name = "Admin"
                }
                console.log(data);
                Meteor.call("editUser", data,user_id,role_name,function(error, result){
                  if(error){
                    console.log("error :"+error);
                    console.log("error", error);
                  }
                  if(result){
                    if(active_selection == "Sign Up as Student"){
                      Router.go('/profile/'+Meteor.userId());
                    }else{
                      Router.go('ClaimSchool');
                    }
                  }
                });
              }
        });

      },
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
                // Router.go('ForgotPassword');
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
