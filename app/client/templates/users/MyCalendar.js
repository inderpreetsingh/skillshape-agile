Template.UserDetailModalTemplate.helpers({
userDetails: function(){
  return Meteor.users.findOne({_id:Session.get('current_embad_user')})
},
email: function(){
  var user = Meteor.users.findOne({_id:Session.get('current_embad_user')})
  if ( user ) {
    if(user.profile){
      return user.emails[0].address
    }
  }
}
});
Template.regTemplate.events({
  "click .login":function(){
    $("#embedloginmodal").appendTo("body").modal('show');
    $("#embedJoin").modal('hide');
  },
  "click .btn_sign_up":function(){
    var eamil = $('#embedJoin').find('#email').val();
    var password = $('#embedJoin').find('#password').val();
    var re_password = $('#embedJoin').find('#re_password').val();
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
      skill_class = SkillClass.findOne({_id:Session.get("current_class")});
      school = School.findOne({_id:skill_class.schoolId})
      console.log(eamil);
      Meteor.call("checkUserByEmail",eamil,function(error, result){
      if(error){
        console.log("error", error);
      }else{
        console.log(result);
        if(result == false){
          profile = {
            "acess_type":"school"
          }
          user = {email: eamil,password: password,profile:profile}
          var data = {
            "classId" : skill_class._id,
            "classTypeId": skill_class.classTypeId
          }
          Meteor.call("addEmbadDemandWithUser",user,data,school,skill_class,function(error, result){
            if(error){
              console.log("error", error);
            }else{
              if(result == true){
                toastr.success("Your join class request is send ","Success");
                $("#embedJoin").modal('hide');
              }else{
                toastr.success("Your already join this class","Success");
                $("#embedJoin").modal('hide');
              }
            }
          });
        }else{
          toastr.success("Your email already register  !!","Success");
          var data = {
            "classId" : skill_class._id,
            "classTypeId": skill_class.classTypeId,
            "userId": result._id
          }
          Meteor.call("addEmbadDemand",data,school,skill_class,function(error, result){
            if(error){
              console.log("error", error);
            }else{
              if(result == true){
                toastr.success("Your join class request is send ","Success");
                $("#embedJoin").modal('hide');
              }else{
                toastr.success("Your already join this class","Success");
                $("#embedJoin").modal('hide');
              }
            }
          });
        }
      }
      });

  }
});
Template.loginTemplate.events({
  "click .join_school":function(){
    $("#embedJoin").appendTo("body").modal('show');
    $("#embedloginmodal").modal('hide');
  },
  "click #btn_login": function(event, template){
    event.preventDefault();
    console.log("test");
    var eamil = $('#embedloginmodal').find('#email').val();
    var password = $('#embedloginmodal').find('#password').val();
    Meteor.loginWithPassword(eamil, password,function(error)
     {
         if(error)
         {
           toastr.error(error.reason,"Eroor");
         }else{

         }
     });
   }
});
Template.ClassDetailModalTemplate.events({
  "click .viewUser": function(event, template) {
    var user_id = $(event.currentTarget).attr("data-user-id");
    Session.set("current_embad_user",user_id)
    $("#UserDetailModal").appendTo("body").modal('show');
  },
  "click .btn_join_check" : function(event, template){
      toastr.error("Please register before joining a class","Error");
      $("body").find('#ClassDetailModal').modal('hide');
      Meteor.setTimeout(function(){
        $("#embedJoin").appendTo("body").modal('show');
      }, 500);
  },
  "click #btn-update_class": function(event, template) {
    var class_id = $(event.currentTarget).attr("data-id");
    var locationId = $('#ClassDetailModal_location').val();
    var start_time = $('#start_time').val()
    var end_time = $('#end_time').val()
    var data = {
      id : $('#current_schedule_id').val(),
      classId: Session.get("current_class"),
      allDay: Session.get("current_class_allDay"),
      date_name: Session.get("current_date_name"),
      start_time: start_time,
      end_time: end_time,
      locationId: locationId
    }
    Meteor.call("updateClassDetail", data, function(e, r) {
      if (e) {
        console.log(e);
      } else {
        $('.main-detail-box').fadeIn();
        $('.change-detail-box').fadeOut();
        $('#detail-edit').fadeIn();
        toastr.success("Class detail updated", "Success");
        fullCalendar.fullCalendar('refetchEvents');
        $('#ClassDetailModal').modal('hide');
      }
    });

  },
  "click #removeEvent" :  function(event, template) {
      var id = $('#current_schedule_id').val();
      Meteor.call("removeEvent", id, function(e, r) {
        $('#ClassDetailModal').modal('hide');
        fullCalendar.fullCalendar('refetchEvents');
      });
  },
  'click .link-redirect' : function(event, template) {
      $('#ClassDetailModal').modal('hide');
      var path = $(event.currentTarget).attr("data-target");
      console.log(path);
      location.href = path
  },
  "click #editClass": function(event,template) {
    $('#ClassDetailModal').modal('hide');

    var classId = $(event.currentTarget).attr("data-id");
    obj = SkillClass.findOne({_id:classId})
    console.log(obj);
    Session.set("MyCalendarCurrentSchool",obj.schoolId)
    var selected_option = obj.tab_option
    $('#'+selected_option).addClass('active').siblings().removeClass('active');
    $('.navigation-tab').removeClass('active');
    $($($('#'+selected_option).find('a')[0]).attr('href')).addClass('active');
    console.log(obj);
    $('#addClass').text("Edit Class");
    $('#class_name').val(obj.className);
    $('#class_location').val(obj.locationId);
    $("#newclassTypeId").val(obj.classTypeId);
    $("#start_date").val(obj.plannedStart);
    $("#end_time").val(obj.planEndTime);
    $("#start_time").val(obj.planStartTime);
    $("#start_time").val(obj.planStartTime);
    console.log(obj.planStartTime);
    console.log($("#start_time").val());
    $("#classDescription").val(obj.classDescription);
    Session.set("slectedLocation",obj.locationId);
    $('#class_room').val(obj.room);
    $("#currentClassId").val(classId)
    $.each($('.repeat_on'), function(i, val){
      $(val).prop('checked','');
    });
    if(selected_option == "RepeatingClass" || selected_option == "OngoingClass" ){
      repeats = JSON.parse(obj.repeats)
      if(repeats.end_option == "Never"){
        $("input:radio[value='" + repeats.end_option + "']").prop('checked','checked');
      }else{
        $("input:radio[value='" + repeats.end_option + "']").prop('checked','checked');
        $('#'+repeats.end_option).val(repeats.end_option_value)
      }
      if(selected_option == "RepeatingClass" ){
        $("#RepeatingClass_start_date").val(repeats.start_date)
        $("#RepeatingClass_end_date").val(repeats.end_option_value)
      }
      $.each(repeats.repeat_on, function(i, val){
        $("input:checkbox[value='" + val + "']").prop('checked','checked');
      });
      $.each(repeats.repeat_details, function(i, val){
        $("#"+selected_option+"_"+val["day"]+"_start_time").val(val["start_time"])
        $("#"+selected_option+"_"+val["day"]+"_end_time").val(val["end_time"])
        $("#"+selected_option+"_"+val["day"]+"_location").val(val["location"])
        /*repeat_details.push({"day":$(i).val(),"start_time":$("#"+$(i).val()+"_start_time").val(),"end_time":$("#"+$(i).val()+"_end_time").val(),"location":$("#"+$(i).val()+"_location").val()})*/
      });
    }
    setTimeout(function() {
        /*$('#ClassDetailModal').modal('hide');*/
        $("#addClass1").appendTo("body").modal('show');
        $("#addClass1").css('overflow-y','auto');
    }, 100);

  }
});
Template.ClassDetailModalTemplate.rendered = function() {
  var classDetailModalsubscribe = this ;
  var currentRoute = Router.current().originalUrl;
  if (currentRoute.includes("embed/schools")) {

    classDetailModalsubscribe.autorun(function()
    {
      classId = Session.get("current_class")
      console.log(classId);
      if(event){
        classDetailModalsubscribe.subscribe("demandUser",classId,function(){
         console.log("subscribe done !! 1")
       })
      }
    });
  }
}
Template.ClassDetailModalTemplate.helpers({
  student_join : function(){
    demand = Demand.find().fetch();
    user_ids = demand.map(function(e){return e.userId})
    return Meteor.users.find({_id:{$in:user_ids}});
  },
  display_time: function(){

  },
  is_embed : function(){
    var currentRoute = Router.current().originalUrl;
    if (currentRoute.includes("embed/schools")) {
       return true;
    }{
      return false;
    }
  },
  is_selected : function(id){
    return JSON.parse(Session.get("current_event"))['locationId'] == id ? "selected" : ""
  },
  current_date : function(){
    return Session.get("current_event_date");
  },
  current_date_name : function(){
    return Session.get("current_date_name");
  },
  current_event : function(){
    return JSON.parse(Session.get("current_event"));
  },
  ownClass: function(classId) {
    skillClass = SkillClass.find({
      schoolId: Meteor.user().profile.schoolId
    }).fetch();
    myClassIds = skillClass.map(function(a) {
      return a._id
    });
    if (myClassIds.indexOf(classId) > -1 || Roles.userIsInRole(Meteor.userId(),"Superadmin")) {
      return true;
    } else {
      return false;
    }
  },
  locations: function(schoolId) {
    console.log(schoolId);
    return SLocation.find({
      schoolId: schoolId
    })
  },
  current_class: function() {
    return SkillClass.findOne({
      _id: Session.get("current_class")
    });
  },
  schoolName: function(schoolId) {
    school = School.findOne({_id: schoolId})
    if(school){
      return school.name;
    }else{
      return ""
    }
  },
  schoolNameSlug: function(schoolId) {
    school = School.findOne({_id: schoolId})
    if(school){
      return school.slug;
    }else{
      return ""
    }
  },
  view_image: function(classType, classImagePath,schoolId) {
    image = ClassType.findOne({
      _id: classType
    }).classTypeImg
    if (image && image.length) {
      return image
    } else {
      if (classImagePath && classImagePath.length > 1) {
        return classImagePath;
      } else {
        school = School.findOne({_id: schoolId})
        if(school && school.mainImage){
          return school.mainImage;
        }else{
          return "/images/logo-location.png";
        }

      }
    }
  },
  view_class_price: function(classType) {
    return ClassPricing.findOne({
      classTypeId: classType
    }).cost;
  },
  class_type_detail: function() {
    return ClassType.findOne({
      _id: Session.get("current_class_type")
    })
  },
  checkSkill : function(skill){
   return skill && skill.length > 0
  },
  view_desc: function(classType) {
    return ClassType.findOne({
      _id: classType
    }).desc
  },
  address_view: function(locationId) {
    class_location = SLocation.findOne({
      _id: locationId
    })
    return class_location.address + ", " + class_location.city + ", " + validateString(class_location.state);
  },
  view_schedule: function(skillclass) {
    var str = ""
    if (skillclass.isRecurring == "true") {
      repeats = skillclass.repeats
      if (repeats) {
        repeats = JSON.parse(repeats)
        repeat_details = repeats.repeat_details
        if (!repeat_details) {
          repeat_details = []
        }
        str = ""
        for (var i = 0; i < repeat_details.length; i++) {

          str += "<b>" + repeat_details[i].day + "</b> " + repeat_details[i].start_time + " to " + repeat_details[i].end_time +" "
        }
      }
    } else {
      str = skillclass.plannedStart + "  to " + skillclass.plannedEnd + " " + skillclass.planEndTime + " to " + skillclass.planStartTime
    }
    return str;
  },
  disply_str: function(skillclass){
    var str = ""
    if (skillclass.isRecurring == "true") {
      json = JSON.parse(skillclass.repeats);
      if(json.end_option == "Never"){
        str = "This is an ongoing class."
      }else{
        str = "This is a class series with start and end dates"
      }
    }
    else{
      str = "This is single class."
    }
    return str;
  },
  disply_date : function(skillclass){
    if (skillclass.isRecurring == "true") {
      json = JSON.parse(skillclass.repeats);
      return json;
    }else{
     return null;
    }
  },
  checkValue : function(value){
    return value != "Never"
  },
  view_schedule_with_location: function(skillclass) {
    var str = ""
    if (skillclass.isRecurring == "true") {
      repeats = skillclass.repeats
      if (repeats) {
        repeats = JSON.parse(repeats)
        repeat_details = repeats.repeat_details
        if (!repeat_details) {
          repeat_details = []
        }
        str = ""
        for (var i = 0; i < repeat_details.length; i++) {
          class_location = SLocation.findOne({
            _id: repeat_details[i].location
          })
          address = ''
          if(class_location){
            address = class_location.address + ", " + class_location.city + ", " + validateString(class_location.state);
          }

          str += "<b>" + repeat_details[i].day + "</b> " + repeat_details[i].start_time + " to " + repeat_details[i].end_time +" at "+address+"<br>"
        }
      }
    } else {
      str = skillclass.plannedStart + "  to " + skillclass.plannedEnd + " " + skillclass.planEndTime + " to " + skillclass.planStartTime
    }
    return str;
  },
  needToShowFilter: function() {
    var currentRoute = Router.current().originalUrl;
    if (currentRoute.includes("MyCalendar")) {
      return true;
    } else {
      return false;
    }
  }
});
Template.MyCalendar.events({

  "click .uncheckMyclass": function(event, template) {
    skillClass = SkillClass.find({
      schoolId: Meteor.user().profile.schoolId
    }).fetch();
    skill_ids = skillClass.map(function(a) {
      return a._id
    })
    skillClass = SkillClass.find({
      _id: {
        $nin: skill_ids
      }
    }).fetch()
    skill_ids = skillClass.map(function(a) {
      return a._id
    })
    skillClassIds = Session.get('classfilter');
    checked_status = $('#uncheckMyclass').is(":checked");

    for (var k = 0; k < skill_ids.length; k++) {
      if (checked_status == false) {
        if (skillClassIds.indexOf(skill_ids[k]) > -1) {
          var index = skillClassIds.indexOf(skill_ids[k]);
          skillClassIds.splice(index, 1);
          $('#' + skill_ids[k]).attr('checked', false)
          fullCalendar.fullCalendar('removeEvents', skill_ids[k])
        }
      } else {
        if (skillClassIds.indexOf(skill_ids[k]) > -1) {} else {
          $('#' + skill_ids[k]).prop("checked", true);
          skillClassIds.push(skill_ids[k])
        }
      }
    }
    console.log(skillClassIds);

    Session.set('classfilter', skillClassIds);
  },
  "click .class_remove": function(event, template) {
    var class_id = $(event.currentTarget).attr("data-id");
    var currentRoute = Router.current().originalUrl;
    Meteor.call("RemoveFromUser", class_id, Meteor.userId(), function(error, result) {
      if (error) {
        console.log("error", error);
      }
      if (result) {
        toastr.success("Class Remove from User", "Success");
        document.location.reload(true);
      }
    });
  },
  "click .ignore_list": function(event, template) {
    var class_id = $(event.currentTarget).attr("data-id");
    skillClassIds = Session.get('classfilter');
    if (skillClassIds) {
      if (skillClassIds.indexOf(class_id) > -1) {
        var index = skillClassIds.indexOf(class_id);
        skillClassIds.splice(index, 1);
      } else {
        skillClassIds.push(class_id)
      }
    }
    Session.set('classfilter', skillClassIds);
    fullCalendar.fullCalendar('refetchEvents');
    fullCalendar.fullCalendar('removeEvents', class_id)
    fullCalendar.fullCalendar('prev');
    fullCalendar.fullCalendar('next');
  }
});
Template.MyCalendar.helpers({
  is_embed : function(){
    var currentRoute = Router.current().originalUrl;
    if (currentRoute.includes("embed/schools")) {
       return true;
    }{
      return false;
    }
  },
  AllClassToSchool : function(){
    return SkillClass.find({});
  },
  needToShowFilter: function() {
    var currentRoute = Router.current().originalUrl;
    if (currentRoute.includes("MyCalendar")) {
      return true;
    } else {
      return false;
    }
  },
  currentEventTitle: function() {
    return Session.get("current_event_title");
  },
  MyClass: function() {
    return SkillClass.find({
      schoolId: Meteor.user().profile.schoolId
    }).fetch();
  },
  joinClass: function() {
    skillClass = SkillClass.find({
      schoolId: Meteor.user().profile.schoolId
    }).fetch();
    skill_ids = skillClass.map(function(a) {
      return a._id
    })
    return SkillClass.find({
      _id: {
        $nin: skill_ids
      }
    }).fetch()
  },
  ownClassAvailable: function() {
    skillClass = SkillClass.find({
      schoolId: Meteor.user().profile.schoolId
    }).fetch();
    if (skillClass.length > 0) {
      return true;
    } else {
      return false;
    }
  },
  schoolName: function(schoolId) {
    return School.findOne({
      _id: schoolId
    }).name
  },
  checkDeleteAllow: function(classId) {
    defaultValue = true
    if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.schoolId && Meteor.user().profile.schoolId.length > 1) {
      skillClass = SkillClass.find({
        schoolId: Meteor.user().profile.schoolId
      });
      skill_ids = skillClass.map(function(a) {
        return a._id
      })
      if (skill_ids.indexOf(classId) > -1) {
        defaultValue = false
      }
    }
    return defaultValue;
  },
  checkUserAccess: function(user_id) {
    if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.schoolId && Meteor.user().profile.schoolId.length > 1) {
      return Meteor.user().profile.schoolId == user_id
    }
  },

  checkIgnore: function(value) {
    return !("checked" == value)
  },


  allclass: function() {
    return SkillClass.find({}).fetch();
  },
  checkfilter: function(id) {
    var schoolIgnoreList = Session.get("SchoolIgnoreList")
    if (schoolIgnoreList) {
      if (schoolIgnoreList.indexOf(id) > -1) {
        return "checked"
      }
    }
  }
});
build_calander = function() {
  sevents = [];
  if (Meteor.user()) {
    schoolId = Meteor.user().profile.schoolId
  } else {
    schoolId = School.findOne()._id
  }
  skillClass = SkillClass.find({
    schoolId: schoolId
  }).fetch();
  myClassIds = skillClass.map(function(a) {
    return a._id
  })
  skillClassIds = Session.get('classfilter');
  if (skillClassIds && skillClassIds.length > 0 || skillClassIds && skillClassIds.length == 0) {
    skillClass = SkillClass.find({
      _id: {
        $in: skillClassIds
      }
    }).fetch()
  } else {
    skillClass = SkillClass.find({}).fetch()
  }
  for (var i = 0; i < skillClass.length; i++) {
    sclass = skillClass[i];
    try {
      classSchedule = ClassSchedule.find({skillClassId:sclass._id}).fetch()
      for(var s = 0 ; s < classSchedule.length;s++){
        sevent = {};
        sevent.title = sclass.className;
        sevent.id = classSchedule[s]._id
        sevent.start = moment(classSchedule[s].eventDate).format("YYYY-MM-DD");
        sevent.classTypeId = sclass.classTypeId;
        sevent.eventStartTime = classSchedule[s].eventStartTime;
        sevent.locationId = classSchedule[s].locationId;
        sevent.eventEndTime = classSchedule[s].eventEndTime
        sevent.eventDay = classSchedule[s].eventDay
        sevent.title = sclass.className + " " + classSchedule[s].eventStartTime + " to " + classSchedule[s].eventEndTime;
        if (myClassIds.indexOf(sclass._id) > -1) {
          sevent.className = "event-green"
        } else {
          sevent.className = "event-azure"
        }
        sevent.classId = sclass._id
        sevents.push(sevent)
      }
    } catch (err) {
      console.log("Error");
      console.log(err);
      console.log(sclass);
    }
  }
  console.log(sevents);
  return sevents;
}

groupBy = function(array, f) {
  var groups = {};
  array.forEach(function(o) {
    var group = JSON.stringify(f(o));
    groups[group] = groups[group] || [];
    groups[group].push(o);
  });
  return Object.keys(groups).map(function(group) {
    return groups[group];
  })
}
Template.MyCalendar.rendered = function() {
 var myCalendarsubscribe = this ;
 var currentRoute = Router.current().originalUrl;
 if (currentRoute.includes("MyCalendar")) {

   myCalendarsubscribe.autorun(function()
   {
     date = Session.get("currentCalanderDate")
     console.log(date);
     if(date && fullCalendar && fullCalendar.fullCalendar){
       skillClassIds = SkillClass.find().fetch().map(function(i) {
         return i._id
       });
       fullCalendar.fullCalendar('refetchEvents');
       myCalendarsubscribe.subscribe("ClassSchedulebyClassIds",skillClassIds,date,function(){
        console.log("subscribe done !! 1")
        fullCalendar.fullCalendar('refetchEvents');
      })
     }
   });
   /*this.subscribe("ClassSchedule",slug,date)*/
 } else {
   myCalendarsubscribe.autorun(function()
   {
     var date = Session.get("currentCalanderDate")
     if(date && fullCalendar && fullCalendar.fullCalendar){
       fullCalendar.fullCalendar('refetchEvents');
       var schoolId = Router.current().params.schoolId
        myCalendarsubscribe.subscribe("ClassSchedule",schoolId,date,{onReady: function () {
          console.log("subscribe done !! 2")
          fullCalendar.fullCalendar('refetchEvents');
        }});
        /*myCalendarsubscribe.subscribe("ClassSchedule",schoolId,date,function(){

      });*/
     }
   });
 }
  setTimeout(function() {
    skillClassIds = SkillClass.find().fetch().map(function(i) {
      return i._id
    });
    Session.set('classfilter', skillClassIds);
  }, 1000)
  var sevents = []
  sevents = build_calander()
  if (sevents == null || sevents == undefined) {
    sevents = []
  }
  today = new Date();
  y = today.getFullYear();
  m = today.getMonth();
  d = today.getDate();
  option = {
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay,listWeek'
    },
    defaultDate: today,
    selectable: true,
    selectHelper: true,
    navLinks: false, // can click day/week names to navigate views
    editable: false,
    eventLimit: true, // allow "more" link when too many events
    /*eventSources :[sevents],*/
    eventSources: function(start, end, timezone, callback) {
      var date = new Date(start)
      Session.set("currentCalanderDate",date)
      var sevents = []
      sevents = build_calander()
      if (sevents == null || sevents == undefined) {
        sevents = []
      }
      console.log(sevents);
      callback(sevents);
    },
    dayRender: function(date, cell) {
    },
    eventClick: function(event) {

      if (event.classId && event.classTypeId) {
        var current_event = event;
        console.log(event.locationId);
        Session.set("current_event", JSON.stringify(current_event))
        Session.set("current_class", event.classId)
        Session.set("current_date_name", event.date_name)
        Session.set("current_class_allDay", event.allDay)
        Session.set("current_event_title", event.title)
        Session.set("current_class_type", event.classTypeId)
        Session.set("current_event_date", event.start.format("MM/DD/YYYY"))
        skillclass = SkillClass.findOne({
          _id: event.classId
        })
        $('#ClassDetailModal').appendTo("body").modal('show');
        console.log(event);
        setTimeout(function() {
          if (skillclass.isRecurring == "true") {
            repeats = skillclass.repeats
            repeats = JSON.parse(repeats)
            repeat_details = repeats.repeat_details
            console.log(repeat_details);
            console.log(event.eventDay);
            for (var i = 0; i < repeats.repeat_details.length; i++) {
              if (repeat_details[i].day == event.eventDay) {
                console.log(event.eventEndTime);
                /*$('#ClassDetailModal_location').val(event.locationId);*/
              }
            }
          } else {
            /*$('#ClassDetailModal_location').val(skillclass.locationId);*/
          }
          $('.timepicker').datetimepicker({
            //          format: 'H:mm',    // use this format if you want the 24hours timepicker
            format: 'H:mm', //use this format if you want the 12hours timpiecker with AM/PM toggle
            icons: {
              time: "fa fa-clock-o",
              date: "fa fa-calendar",
              up: "fa fa-chevron-up",
              down: "fa fa-chevron-down",
              previous: 'fa fa-chevron-left',
              next: 'fa fa-chevron-right',
              today: 'fa fa-screenshot',
              clear: 'fa fa-trash',
              close: 'fa fa-remove',
              inline: true

            }
          });
          var currentRoute = Router.current().originalUrl;
          if (currentRoute.includes("SchoolAdmin")) {
            $('.action_btn').hide();
          } else {
            $('.action_btn').show();
          }
          $('.main-detail-box').fadeIn();
          $('.change-detail-box').fadeOut();
          $('#detail-edit').fadeIn();
          $(".class_remove").off("click")
          $(".class_remove").click(function(event) {
            var class_id = $(event.currentTarget).attr("data-id");
            Meteor.call("RemoveFromUser", class_id, Meteor.userId(), function(error, result) {
              if (error) {
                console.log("error", error);
              }
              if (result) {
                console.log("result");
                $('#ClassDetailModal').modal('hide');
                toastr.success("Class Remove from User", "Success");
                sevents = build_calander()
                document.location.reload(true);
              }
            });

          });
          $("#detail-edit").off("click")
          $('#detail-edit').click(function() {
            $('.main-detail-box').hide();
            $('.change-detail-box').show();
            $('#detail-edit').hide();
          });
          $('#save-box,#EditClassdetailClick,#CancelClassdetailClick').off("click")
          $('#save-box,#EditClassdetailClick,#CancelClassdetailClick').click(function() {
            $('.main-detail-box').show();
            $('.change-detail-box').hide();
            $('#detail-edit').show();
          });
        }, 200);
      }
    }
  }
  setTimeout(function() {
    fullCalendar = $('#fullCalendar').fullCalendar(option);
    fullCalendar.fullCalendar('prev');
    fullCalendar.fullCalendar('next');
    var currentRoute = Router.current().originalUrl;
    if (currentRoute.includes("embed/schools")) {
      console.log(Session.get('embed_height'))
      fullCalendar.fullCalendar('option', 'height', (Session.get('embed_height') - 100));
    }
  }, 1000);

  //editable code start here

  //editable code End here
}
