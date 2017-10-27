Session.set("initNearByLocation",true)
Session.set("SubscribeReady",false)
var newsfeed_increment = 20;
var fixedHeader = function() {
  console.log($(this).scrollTop());
  if ($(this).scrollTop() >= 200) {
     $('#scr_affix').addClass('fixed-header');
     if($('.sidebar').length > 0)
     $('#scr_affix').css({'position': 'relative', 'top': ($(this).scrollTop() - 100)+'px'});
  }
  else {
     $('#scr_affix').removeClass('fixed-header');
     $('#scr_affix').attr('style','')
  }
};
var showMoreVisible = function() {

     var threshold, target = $("#showMoreResults");
     if (!target.length) return;
     threshold = $(window).scrollTop() + $(window).height() - target.height();
     if (target.offset().top < threshold) {
         if (!target.data("visible")) {
             // console.log("target became visible (inside viewable area)");
             target.data("visible", true);
             Session.set("filter_limit",
             Session.get("filter_limit") + newsfeed_increment);
         }
     } else {
         if (target.data("visible")) {
             // console.log("target became invisible (below viewable arae)");
             target.data("visible", false);
         }
     }
 }
Template.Home.created = function(){
  const HomeSubscribe = this;
   HomeSubscribe.autorun(function () {
        Session.set("SubscribeReady",false)
        school =  HomeSubscribe.subscribe("School", Meteor.userId(),Session.get("coords"),Session.get("Hskill"),Session.get("HclassPrice"),Session.get("HmonthPrice"),Session.get("textSearch"),Session.get("filter_limit"),Session.get('clickedTag'));
        demand = HomeSubscribe.subscribe("Demand",Meteor.userId());
        if(school.ready() && demand.ready()){
            $(window).off('scroll');
            $('.main-panel').off('scroll');
            $('#MainPanel').off('scroll');
            $(window).scroll(showMoreVisible);
            $('#MainPanel').scroll(showMoreVisible);
            $('.main-panel').scroll(showMoreVisible);
            $(window).scroll(fixedHeader);
            $('#MainPanel').scroll(fixedHeader);
            $('.main-panel').scroll(fixedHeader);
            Session.set("SubscribeReady",true)
            initialize_map();
        }
   });
}
Template.Home.rendered = function(){
  Session.set("filter_limit",20)

  $('html').removeClass('nav-open');
  $('.close-layer').remove();
  setTimeout(function(){
      if($toggle){
        $toggle.removeClass('toggled');
      }
  }, 400);
  mobile_menu_visible = 0;

  initNearByLocation = function()
  {
    coords = Session.get("coords")
    if(!!navigator.geolocation)
    {
      navigator.geolocation.getCurrentPosition(function(position)
      {

               var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

               if(Session.get("initNearByLocation"))
               {
                 $('#google-map').hide();
                 var coords = [];
                 coords[0] = position.coords.latitude
                 coords[1] = position.coords.longitude
                 geocoder = new google.maps.Geocoder();
                 var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                 geocoder.geocode({'latLng': latlng}, function(results, status) {
                  if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                    Session.set("SLocation",results[0].formatted_address)
                    } else {
                      Session.set("SLocation","near by me")
                    }
                  } else {
                      Session.set("SLocation","near by me")
                  }
                });
                 toastr.success("Showing classes around you...","Found your location");
                 Session.set("coords",coords)

               }
               Session.set("initNearByLocation",false)
       });
    }
  }
  initialize = function() {
      var input = document.getElementById('location');
      var autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.addListener('place_changed', function () {
      var place = autocomplete.getPlace();
      console.log($('#location').val());


      var coords = [];
      coords[0] = place.geometry['location'].lat();
      coords[1] = place.geometry['location'].lng();
      console.log(place.geometry['location'].lat());
      console.log(place.geometry['location'].lng());
      Session.set("coords",coords)
      Session.set("SLocation",$('#location').val())
      });
  }
  setTimeout(function(){
    initialize();
    initNearByLocation();
  }, 400)
}
initialize_map = function()
{
  var bounds = new google.maps.LatLngBounds();

  if(document.getElementById('google-map'))
  {
    document.getElementById('google-map').innerHTML = ""
    skill_class = SkillClass.find({}).fetch()
    var gmarkers = [];
    var mapOptions = {
      zoom: 8,
      scrollwheel: true,
      minZoom:1
    };
    var map = new google.maps.Map(document.getElementById('google-map'),mapOptions);
    for(var i = 0; i < skill_class.length; i++){
      class_location = SLocation.findOne({_id:skill_class[i].locationId})
      if(class_location && class_location.geoLat && class_location.geoLong){
        cost = 0
        console.log(skill_class[i].classTypeId);
        class_price = ClassPricing.findOne({classTypeId: { '$regex': ''+skill_class[i].classTypeId+'', '$options' : 'i' }})
        console.log(class_price);
        if(class_price){
          cost = class_price.cost;
        }
        school = School.findOne({_id:skill_class[i].schoolId})
        if (school && school.slug){
          content = "<b><a href='/schools/"+school.slug+"'>"+skill_class[i].className+"</a></b>"+"</br> $"+cost+" Cost";
          /*console.log(content);*/
          var myLatlng = new google.maps.LatLng(eval(class_location.geoLat),eval(class_location.geoLong));
          var marker = new google.maps.Marker({
            position: myLatlng,
            title: skill_class[i].className,
            map: map,
            contentString:content,
            classId:skill_class[i]._id
          });
          bounds.extend(myLatlng);
          gmarkers.push(marker)
          var infowindow = new google.maps.InfoWindow();
          google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(this.contentString);
            infowindow.open(map,this);
            $('#MainPanel').scrollTop($('#'+this.classId).offset().top);
            $('#'+this.classId).animateCss("wobble");
          });
        }
      }
    }
    map.fitBounds(bounds);
    map.panToBounds(bounds);
    var mcOptions = {gridSize: 10,   minZoom:1};
    mc = new MarkerClusterer(map, gmarkers, mcOptions);
    skill = Session.get("Hskill")
    classPrice = Session.get("HclassPrice")
    monthPrice = Session.get("HmonthPrice")
    coords = Session.get("coords")
    //&& !!skill && !!classPrice && !!monthPrice && !!coords
    if(!!navigator.geolocation)
    {
      navigator.geolocation.getCurrentPosition(function(position)
      {
               var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
               if(!skill && !classPrice && !monthPrice && !coords){
                 map.setCenter(geolocate);
               }
               /*var infowindow = new google.maps.InfoWindow({map: map,position: geolocate,content:'Your Location!'});*/
               var infowindow = new google.maps.InfoWindow();
               // map.setZoom(8);

               bounds.extend(geolocate);
               map.fitBounds(bounds);
                map.panToBounds(bounds);


               var marker = new google.maps.Marker({
                position: geolocate,
                icon: '/images/bluecircle.png',
                map: map
              });
              google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent('Your Location!');
                infowindow.open(map,this);
              });
       });
    } else {
        // No support
    }
    $('#google-map').show();
     /*map.setOptions({ minZoom:1,maxZoom: 13 });*/
  }
}
Template.Home.helpers({
  is_subscribe_ready : function(){
    return Session.get("SubscribeReady");
  },
  moreResults: function() {
    return !(SkillClass.find().count() < Session.get("filter_limit"));
  },
  validateCost : function(value){
    if(value && eval(value) > 0){
      return true;
    }else{
      return false;
    }
  },
  isMyClass : function(schoolId){
    if(Meteor.user() && Meteor.user().profile.schoolId){
      return Meteor.user().profile.schoolId == schoolId;
    }else{
      return false
    }
  },
  classTypeList : function(){
    return ClassType.find({})
  },
  classByClassType : function(classTypeId){
    return SkillClass.find({classTypeId:classTypeId})
  },
  curSchoolName : function(schoolId){
    school = School.findOne({_id:schoolId})
    str = ''
    if(school){
      classType = ClassType.findOne(this.classTypeId)
      if(classType && classType.skillTypeId){
        str += classType.skillTypeId+" at "
      }
      str += school.name;
      /*return cutstring(str,25)*/
      return str;
    }
  },
  SchoolNameByClass : function(schoolId,classTypeId){
    school = School.findOne({_id:schoolId})
    str = ''
    if(school){
      classType = ClassType.findOne(classTypeId)
      if( classType && classType.skillTypeId){
          str += classType.skillTypeId+" at "
      }
      str += school.name;
      /*return cutstring(str,25)*/
      return str;
    }
  },
  schoolName : function(schoolId){
    school = School.findOne({_id:schoolId});
    if(school){
      return school.name
    }

  },
  schoolslug : function(schoolId){
    school = School.findOne({_id:schoolId});
    if(school){
      return school.slug
    }
  },
  location_value : function(){
    return Session.get("SLocation");
  },
  skillvalue : function(){
    return Session.get("Hskill")
  },
  hasSkillValue:()=>{

    return typeof Session.get("Hskill") !=="undefined";

  },
  classPriceValue:function(){
    return Session.get("HclassPrice")
  },
  monthPriceValue : function(){
    return Session.get("HmonthPrice")
  },
  digi_page_url :function(){
    return Cookie.get('digi_page_url') == undefined ? "" : Cookie.get('digi_page_url')
  },
  change_view : function(){
    if(Session.get('list') == "map_view"){
      setTimeout(function(){
        initialize_map();
      }, 1000)

    }
    return Session.get('list') == "map_view";
  },
  class_list : function(){
    return SkillClass.find({});
  },
  view_class_price : function(classType){
    class_pricing = ClassPricing.findOne({classTypeId:{ '$regex': ''+classType+'', '$options' : 'i' }})
    return class_pricing
  },
  view_image : function(classType,classImagePath,schoolId){
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
          return "images/SkillShape-Whitesmoke.png";
        }

      }
    }
  },
  view_desc : function(classType){
    return ClassType.findOne({_id:classType}).desc
  },
  address_view:function(locationId){
    class_location = SLocation.findOne({_id:locationId})
    if(class_location){
      return (class_location.city == undefined  || class_location.city.length < 1 ? "" : class_location.city+", ")+""+(class_location.state == undefined ? "" : class_location.state);
    }

  },
  address_view_by_school : function(schoolId){
    class_location = SLocation.findOne({schoolId:schoolId})
    if(class_location){
      return (class_location.city == undefined  || class_location.city.length < 1 ? "" : class_location.city+", ")+""+(class_location.state == undefined ? "" : class_location.state);
    }
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
  skill_type : function(){
    return SkillType.find({});
  },
  selectedItem:function(key,value){
   if(key == value){
      return "selected";
    }else{
      return "";
    }
  }
});

Template.Home.events({
  "click .class_request" :function(event, template){
    if(Meteor.user()){
      var skill_class = $(event.currentTarget).attr("data-school");
      var class_type = $(event.currentTarget).attr("data-class-type");
        var data = {
          "schoolId" : skill_class,
          "classTypeId": class_type,
          "userId": Meteor.userId()
        }
        console.log(data);
        Meteor.call("addClassDemand", data, function(error, result){
          if(error){
            console.log("error", error);
          }
          if(result){
            toastr.success("Thank you for requesting this class.School will get back to you.","Success");
          }
        });
      }else{
        toastr.error("Please register before request this class","Error");
        Meteor.setTimeout(function(){
          $('#join_student').trigger("click");
        }, 1000);
      }
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
          toastr.success("Thank you for joining this class","Success");
          setTimeout(function(){
              loadConnectedSchool();
              Router.go('MyCalendar');
          }, 500);

        }
      });
    }else{
      // Router.go('Join');
      toastr.error("Please register before joining this class","Error");
      Meteor.setTimeout(function(){
        $('#join_student').trigger("click");
      }, 1000);
    }
  },
  "click #map_view" : function(event, template){
    Session.set('list', "map_view");

  },
  "click .location_searching" :function(event, template){
    Session.set("initNearByLocation",true);
    Session.set("coords",[])
  },
  "click .clear_filter":function(event, template){
    Session.set("SLocation","")
    Session.set("Hskill",null)
    Session.set("HclassPrice",null)
    Session.set("HmonthPrice",null)
    Session.set("coords",null)
    Session.set("textSearch",null)
    Session.set("initNearByLocation",false)
  },
  "click #view_list": function(event, template){
    Session.set('list', "view_list");
  },
  "click #btn_go": function(event, template){
    var url = $('#txt_digi_go').val();
    url = url_validate(url)
    console.log(url);
    if(url ==  false){
      var notify = $.notify('<strong>Invalid URL</strong>',
      	 {
      		type: 'success',
    			allow_dismiss: true,
    			showProgressbar: false,
          delay:0
    		});
      Router.go('Home');
    }else{
      Cookie.set('digi_page_url', url, {path: '/',expires: 60});
      Router.go('Assessment');
    }
  },
  'change select[name="cskill"]':function(event, template){
    console.log($('#cskill').val());
    Session.set("Hskill",$('#cskill').val());
  },
  'change select[name="HclassPrice"]':function(event, template){
    Session.set("HclassPrice",$('#HclassPrice').val());
  },
  'change select[name="HmonthPrice"]':function(event, template){
    Session.set("HmonthPrice",$('#HmonthPrice').val());
  }
});
