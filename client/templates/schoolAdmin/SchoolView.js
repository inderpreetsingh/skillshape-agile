Template.SchoolView.created = function(){
  const schoolViewSubscribe = this;
   this.autorun(function () {
     var currentRoute = Router.current().originalUrl;
     console.log(Router.current().params.schoolId);
     if(currentRoute.includes("schools")){
       schoolId = School.findOne({slug:Router.current().params.schoolId})._id;
     }else{
       schoolId = Router.current().params.schoolId
     }
     console.log(schoolId);
     schoolViewSubscribe.subscribe("MonthlyPricing",schoolId);
     schoolViewSubscribe.subscribe("ClassPricing",schoolId);
     schoolViewSubscribe.subscribe("SchoolLocation",schoolId);
     schoolViewSubscribe.subscribe("classTypeBySchool",schoolId);
   });
};
Template.SchoolView.rendered = function(){
  setTimeout(function(){
    initialize_map_view();
  }, 1000);
  if(Meteor.user()){
    claimOrder = ClaimOrder.find().fetch();
    if(Meteor.user().profile && Meteor.user().profile.schoolId && Meteor.user().profile.schoolId.length > 1){
      Meteor.call("removeClaimOrder",claimOrder,function(e,r){
        if(r){
        }
      });
    }else{
      if (claimOrder.length){
        setTimeout(function(){
          BootstrapDialog.show({
              type: BootstrapDialog.TYPE_SUCCESS,
              title: 'Confirmation ?',
              message: 'Are you sure you like to claim this school?',
              buttons: [{
                label: 'Cancel',
                cssClass: 'btn-danger btn_wi',
                hotkey: 13, // Enter.
                action: function(dialogRef) {
                  Meteor.call("removeClaimOrder",claimOrder,function(e,r){
                    if(r){
                    }
                  });
                  dialogRef.close();
                }
              },{
                label: 'Yes',
                cssClass: 'btn-success btn_wi',
                hotkey: 13, // Enter.
                action: function(dialogRef) {
                    school = School.findOne({_id:Router.current().params.schoolId})
                    doc = {
                      userId: Meteor.userId(),
                      schoolId: Router.current().params.schoolId,
                      currentUserId: school.userId,
                      schoolName: school.name,
                      Status:"new"
                    }
                    console.log(doc)
                    Meteor.call("addClaimRequest",doc,function(e,r){
                      console.log(e);
                      if(r){
                        toastr.error("You have requested to manage a school that has already been claimed. We will investigate this double claim and inform you as soon as a decision has been made. If you are found to be the rightful manager of the listing, you will be able to edit the school listing.","Success");
                      }
                    });
                    dialogRef.close();
                }
              }]
            });
        }, 200);
      }
    }

  }
}

initialize_map_view = function() {
  var gmarkers = [];
  var bounds = new google.maps.LatLngBounds();
  if(document.getElementById('google-map')){
    document.getElementById('google-map').innerHTML = ""
    var mapOptions = {
      zoom: 8,
      scrollwheel: false,
      center:myLatlng,
      zoomControl: true
    };
    gmarkers = []
    var map = new google.maps.Map(document.getElementById('google-map'),mapOptions);
    var currentRoute = Router.current().originalUrl;
    if(currentRoute.includes("schools")){
      schoolId = School.findOne({slug:Router.current().params.schoolId})._id;
    }else{
      schoolId = Router.current().params.schoolId
    }
    locationList = SLocation.find({schoolId:schoolId}).fetch()
    for(var i = 0 ;locationList.length > i ; i++){
        class_location = locationList[i]
        console.log(class_location);
        if(class_location && class_location.geoLat && class_location.geoLong){
          var myLatlng = new google.maps.LatLng(eval(class_location.geoLat),eval(class_location.geoLong));
          console.log(myLatlng);
          bounds.extend(myLatlng);
          var marker = new google.maps.Marker({
            position: myLatlng,
            map: map
          });
          gmarkers.push(marker)
        }
    }
    map.fitBounds(bounds);
    map.panToBounds(bounds);
    var mcOptions = {gridSize: 10,maxZoom: 1,zoomControl: true};
    mc = new MarkerClusterer(map, gmarkers, mcOptions);
  }
  console.log(gmarkers.length);
  if(gmarkers.length < 2){
    setTimeout(function() {
      if(map){
        map.setZoom(15)  
      }
    },500);
  }
}
Template.SchoolView.helpers({
  school_status :function(is_publish){
    return is_publish == 'Y' || is_publish == '' ||  is_publish == undefined ? "checked" : ""
  },
  validAmount : function(value){
    if(value && eval(value) > 0){
      return true;
    }else{
      return false;
    }
  },
  checkNamePresent : function(name){
    return (name && name.trim().length > 0)
  },
  HtmlPresent : function(descHtml){
    return (descHtml && descHtml.trim().length > 0)
  },
  checkIndex : function(value){
    return value == 0
  },
  cutSchoolViewStr:function(str1,str2){
    str = str1+" offer the "+str2
    return cutstring(str,30);
  },
  special_view : function(){
  var currentRoute = Router.current().originalUrl;
    if(currentRoute.includes("calendar") || currentRoute.includes("pricing")){
      return true;
    }else{
      return false;
    }
  },
  calendar_view: function(){
    var currentRoute = Router.current().originalUrl;
    if(currentRoute.includes("calendar")){
      return true;
    }else{
      return false;
    }
  },
  price_view : function(){
    var currentRoute = Router.current().originalUrl;
    if(currentRoute.includes("pricing")){
      return true;
    }else{
      return false;
    }
  },
  checkArrayRecord : function(price_name,school){
    show = false
    if(school){
      if(price_name == "AllClassPrice"){
        show = ClassPricing.find({schoolId:school._id}).fetch().length > 0;
      }else{
        show = MonthlyPricing.find({schoolId:school._id}).fetch().length > 0;
      }
    }
    return show;
  },
  school: function(){
    var currentRoute = Router.current().originalUrl;
    if(currentRoute.includes("schools")){
      return School.findOne({slug:Router.current().params.schoolId});
    }else{
        return School.findOne({_id:Router.current().params.schoolId});
    }
  },
  checkOwnerAccess : function(user_id){
    if(Meteor.userId()){
      return Meteor.userId() == user_id
    }else{
      return false;
    }
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
  checkAccessBySchool : function(schoolId){
    if(Meteor.user() && Meteor.user().profile && Meteor.user().profile.schoolId && Meteor.user().profile.schoolId.length > 1){
      return Meteor.user().profile.schoolId == schoolId
    }
  },
  ClaimBtnCSS : function(claimed){
      if(Meteor.user() && Meteor.user().profile && Meteor.user().profile.schoolId && Meteor.user().profile.schoolId.length > 1){
        return "btn-default"
      }else if(claimed == "Y"){
        return "btn-danger"
      }else{
        return "btn-success"
      }
  },
  IsClaim:function(claimed,schoolId){
    needToView = true
    needToView == claimed != "Y"
    var currentRoute = Router.current().originalUrl;
    if(Meteor.user() && Meteor.user().profile && Meteor.user().profile.schoolId && Meteor.user().profile.schoolId.length > 1){
       if(Meteor.user().profile.schoolId == schoolId){
         needToView = false;
       }
    }
    if(currentRoute.includes("schools")){
      needToView = false
    }
    return needToView;
  },
  locations:function(){
    return SLocation.find({schoolId:this._id})
  },
  class_type : function(){
    return ClassType.find({schoolId:this._id})
  },
  skill_list : function(classTypeId){
    return SkillClass.find({ classTypeId:classTypeId})
  },
  validate_class_price : function(classType){
    classPrice = ClassPricing.findOne({classTypeId:{ '$regex': ''+classType+'', '$options' : 'i' }})
    if(classPrice && classPrice.cost && eval(classPrice.cost) > 0){
      return true;
    }else{
      return false;
    }
  },
  view_class_price : function(classType){
    classPrice = ClassPricing.findOne({classTypeId:{ '$regex': ''+classType+'', '$options' : 'i' }})
    if(classPrice){
    return classPrice.cost;
    }else{
      return "";
    }
  },
  view_image : function(classType,classImagePath){
    image = ClassType.findOne({_id:classType}).classTypeImg
    if(image && image.length){
      return image
    }else{
      if(classImagePath && classImagePath.length > 1){
        return classImagePath;
      }else{
        return "http://img.freepik.com/free-icon/high-school_318-137014.jpg?size=338c&ext=jpg";
      }
    }
  },
  view_school_image : function(image){
    if(image && image.length){
      return image
    }else{
        return "http://img.freepik.com/free-icon/high-school_318-137014.jpg?size=338c&ext=jpg";
    }
  },
  view_desc : function(classType){
    return ClassType.findOne({_id:classType}).desc
  },
  address_view:function(locationId){
    class_location = SLocation.findOne({_id:locationId})
    return class_location.address+","+class_location.country;
  },
  check_join : function(class_id){
    default_value  = false;
    if(Meteor.user()){
      if(Meteor.user().profile && Meteor.user().profile.classIds){
        default_value = Meteor.user().profile.classIds.includes(class_id)
      }
    }
    return default_value;
  },
  AllMonthlyPrice:function(school){
    if(!school){
      return [];
    }
    return MonthlyPricing.find({schoolId:school._id}).fetch();
  },
  AllClassPrice:function(school){
    if(!school){
      return [];
    }
    return ClassPricing.find({schoolId:school._id}).fetch();
  },class_name : function(classTypeId){
    if(classTypeId){
      classTypeIds = classTypeId.split(",")
      classTypeList = ClassType.find({_id:{$in:classTypeIds}}).fetch();
      str_name = []
      classTypeList.map(function(a){ str_name.push(a.name)})
      return str_name.join(",")
    }else{
      return ""
    }

  },
  image_group:function(school){
    if(!school){
      return [];
    }
    school = School.findOne({_id:school._id})
    if(school.mediaList){
    imageList =  []
    return_list = []
    school.mediaList.map(function(a) { if(a && a.mediaType){ if(a.mediaType.toLowerCase() == "Image".toLowerCase()){imageList.push(a)}}})
    var size = 1;
    for (var i=0; i< imageList.length; i+=size) {
        var smallarray = imageList.slice(i,i+size);
        return_list.push({"item":smallarray})
        // do something with smallarray
    }
    return return_list;
    }else{
      return [];
    }
  },check_active: function(index){
      return index == 0 ? "active" : ""
  },other_media:function(school){
    if(!school){
      return [];
    }
    school = School.findOne({_id:school._id})
    if(school.mediaList){
    imageList =  []
    return_list = []
    school.mediaList.map(function(a) { if(a && a.mediaType){ if(a.mediaType.toLowerCase() != "Image".toLowerCase()){imageList.push(a)}}})
    var size = 1;
    for (var i=0; i< imageList.length; i+=size) {
        var smallarray = imageList.slice(i,i+size);
        return_list.push({"item":smallarray})
        // do something with smallarray
    }
    return return_list;
    }else{
      return [];
    }
  },
  view_schedule : function(skillclass){
    var str = ""
    if(skillclass.isRecurring == "true"){
      repeats = skillclass.repeats
      if(repeats){
        repeats = JSON.parse(repeats)
        repeat_details = repeats.repeat_details
        if(!repeat_details){
          repeat_details = []
        }
      str = "Start from "+repeats.start_date+"</br>"
      for (var i=0; i< repeat_details.length; i++) {
        class_location = SLocation.findOne({_id:repeat_details[i].location})
        str += "<b>"+repeat_details[i].day+"</b> "+repeat_details[i].start_time+" to "+repeat_details[i].end_time+" at "+validateString(class_location.neighbourhood)+", "+class_location.city +"</br>"
      }
    }
    }else{
      class_location = SLocation.findOne({_id:skillclass.locationId})
      str = "Start from "+validateString(skillclass.plannedStart)+"  to "+validateString(skillclass.plannedEnd)+"</br>"+validateString(skillclass.planEndTime)+" to "+validateString(skillclass.planStartTime)+" at "+validateString(class_location.neighbourhood)+", "+class_location.city
    }
    return str;
  }
});
Template.SchoolView.events({
  "click .toggelSchoolStatus" : function(event, template){
    console.log("message");
    var schoolId = $(event.currentTarget).attr("data-school_id");
    publish_state = 'N'
    if($('.schoolStatus').is(':checked')){
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

        }else{

          if(Meteor.user() && Meteor.user().profile && Meteor.user().profile.schoolId && Meteor.user().profile.schoolId.length > 1){
            toastr.error("You already manage a school. You cannot claim another School. Please contact admin for more details","Error");
          }else{
            claimRequest = ClaimRequest.find().fetch()
            if(claimRequest.length> 0){
              toastr.info("We are in the process of resolving your claim. We will contact you as soon as we reach a verdict or need more information. Thanks for your patience.","");
              return false;
            }
            var school_id = $(event.currentTarget).attr("data-id");
            school = School.findOne({_id:Router.current().params.schoolId})
            if(school.claimed == "Y"){
              if(Meteor.user()){
                BootstrapDialog.show({
                           title: 'This school is already claimed. Do you want to continue?',
                           buttons: [{
                               label: 'No',
                               action: function(dialog) {
                                     dialog.close();
                               }
                           }, {
                               label: 'Yes',
                                cssClass: 'btn-success btn_wi',
                               action: function(dialog) {
                                 doc = {
                                   userId: Meteor.userId(),
                                   schoolId: Router.current().params.schoolId,
                                   currentUserId: school.userId,
                                   schoolName:school.name,
                                   Status:"new"
                                 }
                                 console.log(doc)
                                 Meteor.call("addClaimRequest",doc,function(e,r){
                                   console.log(e);
                                   if(r){
                                     toastr.error("You have requested to manage a school that has already been claimed. We will investigate this double claim and inform you as soon as a decision has been made. If you are found to be the rightful manager of the listing, you will be able to edit the school listing.","Success");
                                   }
                                 });
                                  dialog.close();
                               }
                               }]
                         });
                       }
              }else{
                BootstrapDialog.show({
                           title: 'Are you sure You Claim this school?',
                           buttons: [{
                               label: 'No',
                               action: function(dialog) {
                                     dialog.close();
                               }
                           }, {
                               label: 'Yes',
                                cssClass: 'btn-success btn_wi',
                               action: function(dialog) {
                                 Meteor.call("claimSchool",Meteor.userId(),Router.current().params.schoolId, function(error, result){
                                   if(error){
                                     console.log("error", error);
                                   }
                                   if(result){
                                     setTimeout(function() {
                                       BootstrapDialog.show({
                                           type: BootstrapDialog.TYPE_SUCCESS,
                                           title: 'Claim Status',
                                           message: '<div class="row text-center"><h4>You are now owner of '+school.name+'</br>Would you like to edit ?</h4></div>',
                                           buttons: [{
                                             label: 'Continue',
                                             cssClass: 'btn-danger btn_wi',
                                             hotkey: 13, // Enter.
                                             action: function(dialogRef) {
                                               dialogRef.close();
                                             }
                                           },{
                                             label: 'Yes',
                                             cssClass: 'btn-success btn_wi',
                                             hotkey: 13, // Enter.
                                             action: function(dialogRef) {
                                               dialogRef.close();
                                               Router.go('/schoolAdmin/'+school._id+'/edit');
                                             }
                                           }]
                                         });
                                         loadConnectedSchool();
                                         loadMySchool();
                                     },1500);
                                     toastr.error("Thanks for claim School","Success");
                                   }
                                 });
                                   dialog.close();
                               }
                           }]
                       });

              }
          }
        }
      },1000);
    }else{
      // Router.go('Join');
      Meteor.setTimeout(function(){
        $('#join_school').trigger("click");
      }, 1000);
      doc = {
        schoolId: Router.current().params.schoolId,
      }
      Meteor.call("addClaimOrder",doc,function(e,r){
        if(r){
        }
      });
      toastr.error("Please register yourself as an individual member before claiming your school","Error");
    }

  },
  "click #claimSchool": function(event, template){
    if(Meteor.user() && Meteor.user().profile && Meteor.user().profile.schoolId && Meteor.user().profile.schoolId.length > 1){
      toastr.error("You already have a school. You cannot claim another School. Please contact admin for more details","Error");
    }else{
      school = School.findOne({_id:Router.current().params.schoolId})
      if(school.claimed == "Y"){
        swal({
          title: "Are you sure?",
          text: "This school has already been claimed, would you still like to claim?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, Claim it!",
          closeOnConfirm: false
        },
        function(){
          swal("Deleted!", "Thanks for Claiming this School. Admin will contact you for next steps.", "success");
        });
      }else{
        var result = confirm("Are you sure You Claim this School ?");
          if (result) {
            Meteor.call("claimSchool",Meteor.userId(),Router.current().params.schoolId, function(error, result){
              if(error){
                console.log("error", error);
              }
              if(result){
                setTimeout(function() {
                  document.location.reload(true);
                },1500);
                toastr.error("Thanks for claim School","Success");
              }
            });
          }
      }

    }
  },
  "click .targetImage" : function(event, template){
      var src = $(event.currentTarget).attr("data-src");
       $('#mimg').attr('src',src);
       $('#imageModal').modal('show');
    },
  "click .btn_join_check" : function(event, template){
    if(Meteor.user()){
      var skill_class = $(event.currentTarget).attr("data-class");
      var class_type = $(event.currentTarget).attr("data-class-type");
      var data = {
        "classId" : skill_class,
        "classTypeId": class_type,
        "userId": Meteor.userId()
      }
      console.log(data);
      Meteor.call("addDemand", data, function(error, result){
        if(error){
          console.log("error", error);
        }
        if(result){
          loadConnectedSchool();
          toastr.success("Thanks for joining this class","Success");
          setTimeout(function(){
              loadConnectedSchool();
              Router.go('MyCalendar');
          }, 500);
        }
      });
    }else{
      // Router.go('Join');
      toastr.error("Please register before joining a class","Error");
      Meteor.setTimeout(function(){
        $('#join_school').trigger("click");
      }, 500);
    }
  },
  "click .toggeleview":function(event, template){
    var class_id = $(event.currentTarget).attr("data-id");
    skillClassIds = Session.get('classfilter');
    if(skillClassIds){
      if(skillClassIds.indexOf(class_id) > -1){
        var index = skillClassIds.indexOf(class_id);
        skillClassIds.splice(index, 1);
      }else{
        skillClassIds.push(class_id)
      }
    }
    Session.set('classfilter', skillClassIds);
    fullCalendar.fullCalendar('refetchEvents');
    fullCalendar.fullCalendar('removeEvents',class_id)
  }
});
