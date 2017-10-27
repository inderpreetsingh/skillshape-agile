Template.SchoolOverview.events({
  "click #studentsignupmodal": function(event, template){
    $('#student-signup-modal').modal('show');
 },
 "click .btn_sign_up" : function(event,template){
   console.log("events")
   event.preventDefault();
   var email = $('#student-signup-modal').find('#email').val();
   var password = $('#student-signup-modal').find('#password').val();
   var re_password = $('#student-signup-modal').find('#re_password').val();

   var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
   if(!emailReg.test(email))
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
   console.log(email)
   console.log(password)
   Meteor.call('createUserFromAdmin',email,password,function(err,result){
        if(!err){
           console.log(result)
           $('#student-signup-modal').modal('hide');
           $('body').removeClass('modal-open');
           $('.modal-backdrop').remove();
           var user_id = result;
           var role_name = "Student"
           data = null;
           Meteor.call("editUser", data,user_id,role_name,function(error, result){
             if(error){
               console.log("error :"+error.reason);
               console.log("error", error.reason);
             }
             if(result){
               toastr.success("Student added.","Success");
              //  Router.go('Profile');

             }
           });
           console.log("a new user just got created")
          }else{
            toastr.error(err.reason,"Eroor");
          }
       })
 }
});
