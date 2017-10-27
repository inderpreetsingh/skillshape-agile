
Template.ClaimSchool.events({
  "click .toggelSchoolStatus" : function(event, template){
    console.log("message");
    var schoolId = $(event.currentTarget).attr("data-school_id");
    publish_state = 'N'
    if($(event.currentTarget).is(':checked')){
      publish_state = 'Y'
    }else{
      publish_state = 'N'
    }
    Meteor.call("publish_school",schoolId,publish_state,function(error, result){
      if(error){
        console.log("error", error);
      }
      if(result){

      }
    });
  },
  "click .btn_claim": function(event, template){

    if(Meteor.user()){
      setTimeout(function() {
        if(Roles.userIsInRole(Meteor.userId(),"Superadmin")){
              Router.go('/schoolAdmin');
        }else{
          if(Meteor.user() && Meteor.user().profile && Meteor.user().profile.schoolId && Meteor.user().profile.schoolId.length > 1){
            toastr.error("You already have school.You can not claim other School.Please contect admin for more details","Error");
          }else{
            var school_id = $(event.currentTarget).attr("data-id");
            if(school_id){
              Router.go('/schoolAdmin/'+school_id);
            }else{
              Router.go('/schoolAdmin');
            }
          }
        }
      },1000);
    }else{
      // Router.go('Join');
      /*Meteor.setTimeout(function(){ Router.go('Join'); }, 1000);*/
      Meteor.setTimeout(function(){
        $('#join_school').trigger("click");
      }, 500);
      /*toastr.error("Please register yourself as school before claim","Error");*/
    }

  },
  "click #search":function(){
      Session.set("web",$('#web').val())
      Session.set("phone",$('#phone').val())
      Session.set("name",$('#name').val())
      Session.set("cskill",$('#cskill').val())
  },
  "click .clear_filter":function(){
      Session.set("web",null)
      Session.set("phone",null)
      Session.set("name",null)
      Session.set("Claimcoords",null)
      Session.set("cskill",null)
      Session.set("ClaimLocation","")
  }
});
Template.ClaimSchool.helpers({
  moreResults: function() {
    return !(School.find().count() < Session.get("school_filter_limit"));
  },
  school_status :function(is_publish){
    return is_publish == 'Y' || is_publish == '' ||  is_publish == undefined ? "checked" : ""
  },
  checkUserAccess:function(user_id){
      if(Meteor.userId()){
        if(Roles.userIsInRole(Meteor.userId(),"Superadmin")){
          return true
        }else{
          return Meteor.userId() == user_id
        }
      }else{
        return false;
      }
  },
  school_list : function(){
    return School.find({});
  },
  skill_type : function(){
    return SkillType.find({});
  },
  vname:function(){
    return Session.get("name")
  },
  vphone : function(){
    return Session.get("phone")
  },
  vweb : function(){
    return Session.get("web")
  },
  vcskill:function(){
    return Session.get("cskill")
  },
  vlocation : function(){
    return Session.get("ClaimLocation")
  },
  selectedSkill:function(skill){
    if(Session.get("cskill") == skill){
      return "selected";
    }else{
      return "";
    }

  }
});
var newsfeed_increment = 20;
var schoolshowMoreVisible = function() {
      var threshold, target = $("#SchoolShowMoreResults");
      if (!target.length) return;
      threshold = $(window).scrollTop() + $(window).height() - target.height();
      if (target.offset().top < threshold) {
          if (!target.data("visible")) {
              // console.log("target became visible (inside viewable area)");
              target.data("visible", true);
              Session.set("school_filter_limit",
                  Session.get("school_filter_limit") + newsfeed_increment);
          }
      } else {
          if (target.data("visible")) {
              // console.log("target became invisible (below viewable arae)");
              target.data("visible", false);
          }
      }
  }
Template.ClaimSchool.created = function(){
  const ClaimSchoolSubscribe = this;
   ClaimSchoolSubscribe.autorun(function () {
     role = ''
     if(Meteor.user() && Meteor.user().roles && Meteor.user().roles[0]){
       role = Meteor.user().roles[0] ;
     }
      claimSchoolsub = ClaimSchoolSubscribe.subscribe("ClaimSchoolFilter",Session.get("phone"),Session.get("web"),Session.get("name"),Session.get("Claimcoords"),Session.get("cskill"),role,Session.get("school_filter_limit"));
      claimordersub = ClaimSchoolSubscribe.subscribe("ClaimOrder","");
      if(claimSchoolsub.ready() && claimordersub.ready()){
        console.log("ClaimSchoolFilter sub is ready..")
        $.material.init()
        $(window).off('scroll');
        $('.main-panel').off('scroll');
        $('#MainPanel').off('scroll');
        $(window).scroll(schoolshowMoreVisible);
        $('#MainPanel').scroll(schoolshowMoreVisible);
        $('.main-panel').scroll(schoolshowMoreVisible);
      }

   });
}
Template.ClaimSchool.rendered = function(){
  Session.set("school_filter_limit",20)
  /*isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
  if(md.misc.sidebar_mini_active == false && isWindows == false){
    $('.main-panel').scroll(schoolshowMoreVisible);
  }else{
    $(window).scroll(schoolshowMoreVisible);
    document.addEventListener('ps-y-reach-end',schoolshowMoreVisible);
  }*/
  if(Meteor.user()){
    claimOrder = ClaimOrder.find().fetch();
    if (claimOrder.length){
      Router.go('/schoolAdmin/'+claimOrder[0].schoolId);
    }
  }
  Meteor.subscribe("SkillType");
  initialize= function() {
        var input = document.getElementById('clocation');
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        console.log($('#clocation').val());
        Session.set("ClaimLocation",$('#clocation').val())
        var coords = [];
        coords[0] = place.geometry['location'].lat();
        coords[1] = place.geometry['location'].lng();
        console.log(place.geometry['location'].lat());
        console.log(place.geometry['location'].lng());
        Session.set("Claimcoords",coords)
      });
  }
  setTimeout(function(){
    initialize();
  }, 400)
}
