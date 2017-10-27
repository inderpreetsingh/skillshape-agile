/**
 * Configure Iron Router.
 * See: http://iron-meteor.github.io/iron-router/
 */

Router.configure({
    layoutTemplate: 'Layout',
    loadingTemplate: 'Loading'
});

if (Meteor.isClient) {
    Router.route('/verify-email/:token', {
        name: 'verifyemail',
        data: function() {
            console.log("verify-email")
            Accounts.verifyEmail(this.params.token, function(error) {
                if (error) {
                    toastr.error(error.reason, 'danger');
                } else {
                    Router.go('/')
                    toastr.success('Email verified! Thanks!', 'Success');
                }
            });
        }
    });


    Router.route('/evaluation_details/:id', {
        name: 'EvaluationDetails',
        waitOn: function() {

        }
    });
    Router.route('/AboutUs/', {
        name: 'AboutUs',
        waitOn: function() {

        }
    });

    Router.route('/howitworks/',
    {
        name: 'howitworks',
        waitOn: function() {

        }
    });
    Router.route('/SchoolUpload', {
        name: 'SchoolUpload',
        waitOn: function() {

        }
    });

    Router.route('/ContactUs/', {
        name: 'ContactUs',
        waitOn: function() {

        }
    });
    Router.route('/timeline/:id', {
        name: 'timeline',
        waitOn: function() {


        }
    });
    Router.route('/schedule', {
        name: 'ScheduleView',
        waitOn: function() {

        }
    });

    Router.route('/Login', {
        name: 'Login',
        waitOn: function() {

        }
    });
    Router.route('/Join', {
        name: 'Join',
        waitOn: function() {

        }
    });
    Router.route('/ForgotPassword', {
        name: 'ForgotPassword',
        waitOn: function() {

        }
    });
    Router.route('/MyCalendar', {
        name: 'MyCalendar',
        waitOn: function() {
          return this.subscribe("userSkillClass", Meteor.userId());
        }
    });
    Router.route('/ManageSchool', {
        name: 'Schools',
        waitOn: function() {
          return this.subscribe("School", Meteor.userId());
        }
    });
    Router.route('/claimSchool', {
        name: 'ClaimSchool',
        waitOn: function() {
          return [];
        }
    });
    Router.route('/school', {
        name: 'SchoolOverview',
        waitOn: function() {

        }
    });
    Router.route('/reset-password/:token', {
        name: 'RecoverPassword',
        waitOn: function() {

        }
    });
    Router.route('/ComingSoon', {
        name: 'ComingSoon',
        waitOn: function() {

        }
    });
    Router.route('/instructor', {
        name: 'Instructor',
        waitOn: function() {

        }
    });
    Router.route('/class_archive', {
        name: 'ClassArchive',
        waitOn: function() {

        }
    });
    Router.route('/class_edit/:id', {
        name: 'ClassEdit',
        waitOn: function() {

        }
    });

    Router.route('/add_class', {
        name: 'AddClass',
        waitOn: function() {

        }
    });
    Router.route('/school/:id', {
        name: 'EditSchool',
        waitOn: function() {

        }
    });
    Router.route('/class_detail/:id', {
        name: 'ClassDetail',
        waitOn: function() {

        }
    });
    Router.route('/class_template/:id', {
        name: 'ClassTemplate',
        waitOn: function() {

        }
    });
    Router.route('/member_home', {
        name: 'MemberHome',
        waitOn: function() {

        }
    });

    Router.route('/program_manager', {
        name: 'ProgramManager',
        waitOn: function() {

        }
    });
    Router.route('/member_signup', {
        name: 'membersignup',
        waitOn: function() {

        }
    });
    Router.route('/personal_info/:id', {
        name: 'PersonalInfo',
        waitOn: function() {

        }
    });

    Router.route('/MemberList', {
        name: 'MemberList',
        waitOn: function() {

        }
    });
    Router.route('/MemberDetails', {
        name: 'MemberDetails',
        waitOn: function() {

        }
    });
    Router.route('/MemberDetailsInstructor', {
        name: 'MemberDetailsInstructor',
        waitOn: function() {

        }
    });
    Router.route('/MemberDetailsStudent', {
        name: 'MemberDetailsStudent',
        waitOn: function() {

        }
    });
    Router.route('/student_evaluator', {
        name: 'StudentEvaluator',
        waitOn: function() {

        }
    });

    Router.route('/SkillView', {
        name: 'SkillView',
        waitOn: function() {

        }
    });
    Router.route('/SkillList', {
        name: 'SkillList',
        waitOn: function() {

        }
    });
    Router.route('/SkillEditor', {
        name: 'SkillEditor',
        waitOn: function() {

        }
    });
    Router.route('/media_upload', {
        name: 'MediaUpload',
        waitOn: function() {}
    });
    Router.route('/EvaluationArchive', {
        name: 'EvaluationArchive',
        waitOn: function() {}
    });
    Router.route('/StudentProgressView', {
        name: 'StudentProgressView',
        waitOn: function() {

        }
    });
    Router.route('/MemberNewAdmin', {
        name: 'MemberNewAdmin',
        waitOn: function() {

        }
    });
    Router.route('/member_chooser', {
        name: 'MemberChooser',
        waitOn: function() {

        }
    });
    Router.route('/schoolAdmin', {
        template: 'schoolAdmin',
        name: 'schoolCreate',
        waitOn: function() {

        }
    });
    Router.route('/schools/:schoolId/calendar', {
        template: 'SchoolView',
        name: 'calendar',
        waitOn: function() {
          var slug =  this.params.schoolId;
          console.log(slug);
          params = this.params.query
          console.log(params);
          if(params && params.city || params && params.skillType ){
            return [this.subscribe("UserSchoolbySlug",slug),this.subscribe("SkillClassbySchoolBySlugWithFilter",slug,params.city,params.skillType)];
          }else{
            return [this.subscribe("UserSchoolbySlug",slug),this.subscribe("SkillClassbySchoolBySlug",slug)];
          }
        },
        data:function(){
          return School.findOne({slug:this.params.schoolId})
        }
    });
    Router.route('/embed/schools/:schoolId/calendar', {
        layoutTemplate:'iframeembed',
        template: 'SchoolView',
        name: 'embedcalendar',
        waitOn: function() {
          var slug =  this.params.schoolId;
          console.log(slug);
          params = this.params.query
          console.log(params);
          if(params && params.city || params && params.skillType ){
            return [this.subscribe("UserSchoolbySlug",slug),this.subscribe("SkillClassbySchoolBySlugWithFilter",slug,params.city,params.skillType)];
          }else{
            return [this.subscribe("UserSchoolbySlug",slug),this.subscribe("SkillClassbySchoolBySlug",slug)];
          }
        },
        data:function(){
            params = this.params.query
            if(params.height){
              Session.set("embed_height",eval(params.height))
            }else{
              Session.set("embed_height",800)
            }
            if(params.width){
              Session.set("embed_width",params.width)
            }else{
                Session.set("embed_width",null)
            }
          return School.findOne({slug:this.params.schoolId})
        }
    });

    Router.route('/embed/schools/:schoolId/pricing', {
        layoutTemplate:'iframeembed',
        template: 'SchoolView',
        name: 'embedPricing',
        waitOn: function() {
          var slug =  this.params.schoolId;
          console.log(slug);
          params = this.params.query
          console.log(params);
          if(params && params.city || params && params.skillType ){
            return [this.subscribe("UserSchoolbySlug",slug),this.subscribe("SkillClassbySchoolBySlugWithFilter",slug,params.city,params.skillType)];
          }else{
            return [this.subscribe("UserSchoolbySlug",slug),this.subscribe("SkillClassbySchoolBySlug",slug)];
          }
        },
        data:function(){
          params = this.params.query
          if(params.height){
            Session.set("embed_height",params.height)
          }else{
            Session.set("embed_height",null)
          }
          if(params.width){
            if(eval(params.width) < 1000){
              params.width = 1000
            }
            Session.set("embed_width",params.width)
          }else{
            Session.set("embed_width",null)
          }
          return School.findOne({slug:this.params.schoolId})
        }
    });

    Router.route('/schools/:schoolId/pricing', {
        template: 'SchoolView',
        name: 'pricing',
        waitOn: function() {
          var slug =  this.params.schoolId;
          console.log(slug);
          params = this.params.query
          console.log(params);
          if(params && params.city || params && params.skillType ){
            return [this.subscribe("UserSchoolbySlug",slug),this.subscribe("SkillClassbySchoolBySlugWithFilter",slug,params.city,params.skillType)];
          }else{
            return [this.subscribe("UserSchoolbySlug",slug),this.subscribe("SkillClassbySchoolBySlug",slug)];
          }
        },
        data:function(){
          return School.findOne({slug:this.params.schoolId})
        }
    });
    Router.route('/schools/:schoolId', {
        template: 'SchoolView',
        name: 'SlagbasedViewSchool',
        waitOn: function() {
          var slug =  this.params.schoolId;
          console.log(slug);
          params = this.params.query
          console.log(params);
          date = null //new Date();
          /*date = Session.get("currentCalanderDate")*/
          if(params && params.city || params && params.skillType ){
            return [this.subscribe("UserSchoolbySlug",slug),this.subscribe("SkillClassbySchoolBySlugWithFilter",slug,params.city,params.skillType)];
          }else{
            return [this.subscribe("UserSchoolbySlug",slug),this.subscribe("SkillClassbySchoolBySlug",slug)];
          }
        },
        data:function(){
          return School.findOne({slug:this.params.schoolId})
        }
    });
    Router.route('/schoolAdmin/:schoolId', {
        template: 'SchoolView',
        name: 'viewSchool',
        waitOn: function() {
        var school_id =  this.params.schoolId;
        return [this.subscribe("UserSchool",school_id),this.subscribe("SkillClassbySchool",school_id),this.subscribe("ClaimOrder","")];
        },
        data:function(){
          return School.findOne({_id:this.params.schoolId})
        }
    });
    Router.route('/schoolAdmin/:schoolId/edit', {
      template: 'schoolAdmin',
        name: 'schoolEdit',
        waitOn: function() {
        var school_id =  this.params.schoolId;
         return this.subscribe("UserSchool",school_id);
        },
        data:function(){
          return School.findOne({_id:this.params.schoolId})
        }
    });
    Router.onRun(function() {
        try {
            var currentRoute = Router.current().originalUrl
        } catch (e) {
            var currentRoute = "/"
        }

        console.log(currentRoute);

        if (Meteor.loggingIn() || Meteor.user()) {
            console.log(Meteor.userId())
                // if (Meteor.user() && !Meteor.user().emails[0].verified){
                //   if(currentRoute == "/" || currentRoute.indexOf("verify-email") > -1){
                //     this.next();
                //   }else{
                //     this.render('Home');
                //     this.stop();
                //   }
                // }else{
            this.next();
            // }
        } else {

        }
    });
    Router.route('/search',  function () {
      params = this.params.query
      if(params && params.school){
        this.redirect('/schools/'+params.school+"?city="+params.city+"&skillType="+params.skillType);
      }else{
        if(params && params.skillType){
          Session.set("Hskill",params.skillType)
        }
        if(params.city){
          Session.set("initNearByLocation",false)
          console.log(params.city);
          getLatLong(params.city,function(data){
            coords = []
            coords[0] = data.lat
            coords[1] = data.lng
            console.log(data);
            Session.set("coords",coords)
            Session.set("SLocation",data.formatted_address)
            if(params.skillType){
            Router.go('/'+"?city="+params.city+"&skillType="+params.skillType);
            }else{
              Router.go('/?city='+params.city);
            }
          })
        }else{
          Session.set("initNearByLocation",false)
          Router.go('/'+"?skillType="+params.skillType);
        }
      }
    });
    Router.route('/', {
      name: 'Home',
      onBeforeAction: function() {
          if (Meteor.userId() && IsDemoUser()) {
              this.redirect('/schedule');
              this.next()
          } else {
              this.next()
          }
      },
      waitOn : function(){
        params = this.params.query
        return [];
      }
  });

    Router.route('/profile/:id', {
      name: 'MyProfile',
      data: function() {
      }
    });
    Router.route('/profile', {
        name: 'Profile',
        data: function() {
            return Meteor.user();
        },
        waitOn: function() {
            return this.subscribe("images");
        }
    });



    Router.route('/users', {
        name: 'ListUser',
        waitOn: function() {
            return [this.subscribe("User", Meteor.userId())]
        },
        onBeforeAction: function() {
            if (Meteor.user()) {
                this.next();

            } else {
                Router.go('Home');
                this.next();
            }
        }
    });
    Router.route('/user/add', {
        waitOn: function() {
            return this.subscribe("Company", Meteor.userId());
        },
        name: 'AddUser'
    });
    Router.route('/user/:_id', {
        name: 'EditUser',
        waitOn: function() {
            return [
                this.subscribe("UserShow", this.params._id, this.params._id)
            ]
        },
        data: function() {
            return Meteor.users.findOne(this.params._id);
        }
    });
}
