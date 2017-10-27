moveTab = function (nextOrPrev) {
  var currentTab = "";
  $('.nav-pills li,.nav-pills-one li').each(function () {
    if ($(this).hasClass('active')) {
      currentTab = $(this);
    }
  });
  if (nextOrPrev == "Next") {
    if (currentTab.next().length) {
      var atag1 = currentTab.next().find("a").trigger('click');
    } else { }
  } else {
    if (currentTab.prev().length) {
      var atag1 = currentTab.prev().find("a").trigger("click");
    } else { }
  }
}
Template.schoolAdmin.created = function () {
  var self = this;
  self.tagsData = new ReactiveVar();
  this.autorun(function () {
    /*self.subscribe("school")*/
    self.subscribe("salocation");
    self.subscribe("classtype");
    self.subscribe("SkillType");
    self.subscribe("SkillClassbySchool", Router.current().params.schoolId);
    self.subscribe("MonthlyPricing", Router.current().params.schoolId);
    self.subscribe("ClassPricing", Router.current().params.schoolId);
  });
};
Template.schoolAdmin.rendered = function () {
  $('#summernote1').summernote();
  $('#summernote2').summernote();
  $('.dropdown-toggle').dropdown();

  if (!Meteor.userId()) {
    Router.go('/');
  }

  // Meteor.subscribe("priceMonth");
  // Meteor.subscribe("priceClass");
  $(".selectdate").datetimepicker({ format: 'MM/DD/YYYY' });
  $('.StTime').datetimepicker({ format: "LT" });
  if (Router.current().params.schoolId) {
    if (Roles.userIsInRole(Meteor.userId(), "Superadmin")) {

    } else {
      if (Meteor.user().profile.schoolId != Router.current().params.schoolId) {
        Router.go('/');
      }
    }

    setTimeout(function () {
      console.log(Router.current().params.schoolId);
      school = School.findOne({ _id: Router.current().params.schoolId }) //School.findOne({_id:Router.current().params.schoolId})
      $("#summernote1").summernote("code", school.aboutHtml);
      $("#summernote2").summernote("code", school.descHtml);
      $('.select2classtype').select2();

      $('#myCarousel').carousel({
        interval: 10000
      })
      $('.fdi-Carousel .item').each(function () {
        var next = $(this).next();
        if (!next.length) {
          next = $(this).siblings(':first');
        }
        next.children(':first-child').clone().appendTo($(this));

        if (next.next().length > 0) {
          next.next().children(':first-child').clone().appendTo($(this));
        }
        else {
          $(this).siblings(':first').children(':first-child').clone().appendTo($(this));
        }
      });

    }, 1000);
  } else {
    if (Roles.userIsInRole(Meteor.userId(), "Superadmin")) {

    }
    else {
      if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.schoolId && Meteor.user().profile.schoolId.length > 1) {
        Router.go('/schoolAdmin/' + Meteor.user().profile.schoolId);
      }
    }
  }
  $('.datepicker').datetimepicker({
    format: 'MM/DD/YYYY',
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
  $('#start_date').on('dp.change', function (e) {
    $('#rstart_date').val($('#start_date').val())
    day = moment($('#start_date').val(), "MM/DD/YYYY")
    day_name = day.format("dddd");
    $($('.repeat_on:checkbox')).each(function (i, e) { $(e).attr('checked', false); });
    $("input:checkbox[value='" + day_name + "']").prop('checked', 'checked');
  })
  $('.timepicker').datetimepicker({
    //          format: 'H:mm',    // use this format if you want the 24hours timepicker
    format: 'H:mm',    //use this format if you want the 12hours timpiecker with AM/PM toggle
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
  $('#start_time').on('dp.change', function (e) {
    $($('.repeat_on:checkbox')).each(function (i, e) {
      value = $(e).is(':checked');
      if (value == true) {
        if ($('#' + $(e).val() + "_start_time").val() == "00") {
          $('#' + $(e).val() + "_start_time").val($('#start_time').val())
        }
      }
    });
  });
  $('#end_time').on('dp.change', function (e) {
    $($('.repeat_on:checkbox')).each(function (i, e) {
      value = $(e).is(':checked');
      if (value == true) {
        if ($('#' + $(e).val() + "_end_time").val() == "00") {
          $('#' + $(e).val() + "_end_time").val($('#end_time').val())
        }
      }
    });
  });
}
Template.schoolAdmin.helpers({
  calendar_code: function () {
    school = School.findOne({});
    return '<iframe src="' + Meteor.absoluteUrl('embed/schools/' + school.slug + '/calendar') + '?height=800" seamless="seamless" id="skillshape-embed" name="skillshape" frameborder="0" scrolling="no" style="width: 100%;height:840px;"></iframe>'
  },
  price_code: function () {
    school = School.findOne({});
    return '<iframe src="' + Meteor.absoluteUrl('embed/schools/' + school.slug + '/pricing') + '?height=800" seamless="seamless" id="skillshape-embed" name="skillshape" frameborder="0" scrolling="no" style="width: 100%;height:700px;"></iframe>'
  },
  getTags: function () {
    return Template.instance().tagsData.get();
  },
  schoolClassTypes: function () {
    var schoolId = Router.current().params.schoolId;
    if (schoolId) {
      return ClassType.find({ "schoolId": Router.current().params.schoolId })
    }
  },
  use_has_school: function () {
    if (Roles.userIsInRole(Meteor.userId(), "Superadmin") && Router.current().params.schoolId == undefined) {
      return false;
    } else {
      if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.schoolId && Meteor.user().profile.schoolId.length > 1) {
        return true;
      } else {

        return false;
      }
    }
  },
  check_active: function (index) {
    return index == 0 ? "active" : ""
  },
  repeat_end: function () {
    repeats = JSON.parse(this.repeats)
    console.log(repeats);
    console.log(repeats.end_option == "rend_date");
    if (repeats.end_option == "rend_date") {
      return repeats.end_option_value
    } else {
      return "-"
    }
  },
  locations: function () {
    return SLocation.find({ schoolId: Router.current().params.schoolId })
  },
  class_name: function (classTypeId) {
    return ClassType.findOne({ _id: classTypeId }).name
  },
  class_name_array: function (classTypeIds) {
    if (classTypeIds) {
      classtypes = ClassType.find({ _id: { $in: classTypeIds.split(",") } }).fetch();
      class_names = classtypes.map(function (i) { return i.name })
      return class_names.join(",")
    } else {
      return "";
    }

  },
  schoolClasses: function (id) {
    return SkillClass.find({ "classTypeId": id })
  },
  format_date: function (skill) {
    if (skill.isRecurring == "true") {
      if (skill.repeats) {
        json = JSON.parse(skill.repeats);
        if (json.start_date) {
          return json.start_date
        } else {
          return ""
        }
      }
    } else {
      return skill.plannedStart;
    }
  },
  AllMonthlyPrice: function () {
    return MonthlyPricing.find({ schoolId: Router.current().params.schoolId })
  },
  AllClassPrice: function () {
    return ClassPricing.find({ schoolId: Router.current().params.schoolId })
  },
  skill_type: function () {
    return SkillType.find({});
  },
  "files": function () {
    return S3.collection.find();
  },
  image_group: function () {
    school = School.findOne({ _id: Router.current().params.schoolId })
    if (Router.current().params.schoolId && school && school.mediaList) {
      imageList = []
      return_list = []
      school.mediaList.map(function (a) { if (a && a.mediaType) { if (a.mediaType.toLowerCase() == "Image".toLowerCase()) { imageList.push(a) } } })
      var size = 1;
      for (var i = 0; i < imageList.length; i += size) {
        var smallarray = imageList.slice(i, i + size);
        return_list.push({ "item": smallarray })
        // do something with smallarray
      }
      return return_list;
    } else {
      return [];
    }
  },
  other_media: function () {
    school = School.findOne({ _id: Router.current().params.schoolId })
    if (Router.current().params.schoolId && school && school.mediaList) {
      imageList = []
      return_list = []
      school.mediaList.map(function (a) { if (a && a.mediaType) { if (a.mediaType.toLowerCase() != "Image".toLowerCase()) { imageList.push(a) } } })
      var size = 1;
      for (var i = 0; i < imageList.length; i += size) {
        var smallarray = imageList.slice(i, i + size);
        return_list.push({ "item": smallarray })
        // do something with smallarray
      }
      return return_list;
    } else {
      return [];
    }
  }
});
Template.LocationAdd.events({
  "click #AddLocOnclick": function () {
    if ($('.addLocationForm').valid() == false) {
      return false;
    }
    var obj = {}
    obj.createdBy = Meteor.userId();
    obj.schoolId = Router.current().params.schoolId;
    obj.title = $("#Nloc").val();
    obj.address = $("#NStAddress").val();
    obj.city = $("#Ncity").val();
    obj.neighbourhood = $("#Nneighbor").val();
    obj.state = $("#Nstate").val();
    obj.zip = $("#Nzcode").val();
    obj.country = $("#Ncountry").val();
    slocation_detail = obj.address + "," + obj.city + "," + obj.zip + "," + obj.country
    $('#myModal').modal('hide');
    getLatLong(slocation_detail, function (data) {
      if (data == null) {
        slocation_detail = obj.city + "," + obj.zip + "," + obj.country
        getLatLong(slocation_detail, function (data) {
          if (data == null) {
            toastr.error("Please enter valid address details", "Error");
            return false;
          } else {
            obj.geoLat = data.lat
            obj.geoLong = data.lng
            obj.loc = [data.lat, data.lng]
            Meteor.call("editLocation", $('#Eid').val(), obj, function (error, result) {
              if (error) {
                console.log("error", error);
              }
              if (result) {

              }
            });
          }
        });
      } else {
        obj.geoLat = data.lat
        obj.geoLong = data.lng
        obj.loc = [data.lat, data.lng]
        Meteor.call("addLocation", obj, function (error, result) {
          if (error) {
            console.log("error", error);
          }
          if (result) {

          }
        });
      }
    });
  },
});
Template.EditLocationModal.events({
  "click #EditLocClick": function () {
    var obj = {}
    if ($('.LocationEditModal').valid() == false) {
      return false;
    }
    obj.createdBy = Meteor.userId();
    obj.schoolId = Router.current().params.schoolId;
    obj.title = $("#Eloc1").val()
    obj.address = $("#EStAddress").val()
    obj.city = $("#Ecity").val()
    obj.neighbourhood = $("#Eneighbor").val()
    obj.state = $("#Estate").val()
    obj.zip = $("#Ezcode").val()
    obj.country = $("#Ecountry").val();
    $('#EditLocModal').modal('hide');
    slocation_detail = obj.address + "," + obj.city + "," + obj.zip + "," + obj.country
    getLatLong(slocation_detail, function (data) {
      if (data == null) {
        slocation_detail = obj.city + "," + obj.zip + "," + obj.country
        getLatLong(slocation_detail, function (data) {
          if (data == null) {
            toastr.error("Please enter valid address details", "Error");
            return false;
          } else {
            obj.geoLat = data.lat
            obj.geoLong = data.lng
            obj.loc = [data.lat, data.lng]
            Meteor.call("editLocation", $('#Eid').val(), obj, function (error, result) {
              if (error) {
                console.log("error", error);
              }
              if (result) {

              }
            });
          }
        });

      } else {
        obj.geoLat = data.lat
        obj.geoLong = data.lng
        obj.loc = [data.lat, data.lng]
        Meteor.call("editLocation", $('#Eid').val(), obj, function (error, result) {
          if (error) {
            console.log("error", error);
          }
          if (result) {

          }
        });
      }
    });

  }
});
Template.roomTemplate.events({
  "click #add-room": function (event, template) {
    var name = $('#room_name').val()
    var capacity = $('#room_capacity').val()
    if (capacity && capacity.length > 0) {
      capicity = eval(capacity)
    } else {
      capicity = 0;
    }
    var id = $('#room_id').val()
    var location_id = $('#location_id').val()
    if ($('#room-form').valid() == false) {
      return false;
    }
    action = "new"
    if (id) {
      action = "update"
    } else {
      id = getUID()
    }
    data = {
      name: name,
      capicity: capicity,
      id: id
    }
    Meteor.call("addRoom", data, location_id, action, function (e, r) {
      if (e) { } else {
        $('#roomModel').modal('hide');
      }
    });
    console.log(data);

  }
});
Template.AddSkillTypeModalTemplate.events({
  "click #addSkillType": function (event, template) {
    if ($('.AddSkillTypeModalForm').valid() == false) {
      return false;
    }
    var name = $("#newSkillNmae").val()
    skill = SkillType.findOne({ name: { '$regex': '' + name + '', '$options': 'i' } });
    if (skill) {
      toastr.info("Skill type already exists.Please don't add duplicates", "Warning");
    } else {
      $('#skillTypeModal').modal('hide');

      obj = {}
      obj.name = name
      Meteor.call("addSkillType", obj, function (e, r) {
        if (e) {

        } else {
          toastr.success("New skill type created.", "success");
        }
      });
    }

  }
});
Template.LinkUploadTemplate.events({
  "click .btn_submit_link": function (event, template) {
    url = $('#link_url').val();
    if (url) {
      var fileobj = {}
      fileobj.filePath = url
      fileobj.mediaType = "Image"
      schoolId = Router.current().params.schoolId
      console.log(fileobj);
      Meteor.call("addMedia", schoolId, fileobj, function (error, result) {
        if (error) {
          console.log("error", error);
        }
        if (result) {
          toastr.success("Link is uploded.", "Success");
        }
      });
    } else {
      toastr.error("Please enter URL.", "Error");
    }
  }
});
Template.schoolAdmin.events({
  "click .btn_upload": function (event, template) {
    $('#LinkUpload').appendTo("body").modal('show');
  },
  "click #addSkillType": function () {
    $('#skillTypeModal').appendTo("body").modal('show');
    $(".AddSkillTypeModalForm").trigger("reset")
  },
  "click #image_upload": function (event, template) {
    if ($("#schoolImageGroup")[0].files.length > 0) {
      var files = $("#schoolImageGroup")[0].files
      var fileName = files[0].name;
      fileobj = {}
      fileobj.fileName = fileName;
      uploadType = ""
      console.log(files[0].type);
      if (files[0].type.match('image/*')) {
        uploadType = "Image"
      } else if (files[0].type.match('video/*') || files[0].type.match('audio/*')) {
        uploadType = "Media"
      } else {
        uploadType = "Document"
      }
      $('.progress').fadeIn();
      fileobj.fileSize = (files[0].size / 1024);
      S3.upload({
        files: files,
        path: "schools"
      }, function (e, r) {
        $('.progress').fadeOut();
        $('.progress-bar').remove();
        fileobj.filePath = r.secure_url
        fileobj.mediaType = uploadType
        fileobj.contentType = files[0].type
        schoolId = Router.current().params.schoolId
        setTimeout(function () {
          $(".fileinput").fileinput('clear')
        }, 1000);
        Meteor.call("addMedia", schoolId, fileobj, function (error, result) {
          if (error) {
            console.log("error", error);
          }
          if (result) {
            $(".fileinput").fileinput('clear')
          }
        });
      });
    }
  },
  "click #media_upload": function (event, template) {
    if ($("#schoolMediaGroup")[0].files.length > 0) {
      var files = $("#schoolMediaGroup")[0].files
      var fileName = files[0].name;
      fileobj = {}
      fileobj.fileName = fileName;
      fileobj.fileSize = (files[0].size / 1024);
      S3.upload({
        files: files,
        path: "schools"
      }, function (e, r) {
        fileobj.filePath = r.secure_url
        fileobj.mediaType = "Media"
        schoolId = Router.current().params.schoolId
        setTimeout(function () {
          $(".fileinput").fileinput('clear')
        }, 1000);
        Meteor.call("addMedia", schoolId, fileobj, function (error, result) {
          if (error) {
            console.log("error", error);
          }
          if (result) {
            $(".fileinput").fileinput('clear')
          }
        });
      });
    }
  },
  "click #document_upload": function (event, template) {
    if ($("#schoolDocumentGroup")[0].files.length > 0) {
      var files = $("#schoolDocumentGroup")[0].files
      var fileName = files[0].name;
      fileobj = {}
      fileobj.fileName = fileName;
      fileobj.fileSize = (files[0].size / 1024);
      S3.upload({
        files: files,
        path: "schools"
      }, function (e, r) {
        fileobj.filePath = r.secure_url
        fileobj.mediaType = "Document"
        schoolId = Router.current().params.schoolId
        setTimeout(function () {
          $(".fileinput").fileinput('clear')
        }, 1000);
        Meteor.call("addMedia", schoolId, fileobj, function (error, result) {
          if (error) {
            console.log("error", error);
          }
          if (result) {
            $(".fileinput").fileinput('clear')
          }
        });
      });
    }
  },
  "click #addSchool": function (event, template) {
    if ($('.schoolForm').valid() == false) {
      return false
    }
    var obj = {}
    obj.userId = Meteor.userId();
    obj.name = $("#sname").val();
    obj.website = $("#Website").val();
    obj.backGroundVideoUrl = $('#backGroundVideoUrl').val()
    obj.phone = $("#phone").val();
    if (Roles.userIsInRole(Meteor.userId(), "Superadmin")) {
      obj.claimed = "N";
    } else {
      obj.claimed = "Y";
    }
    obj.aboutHtml = $('#summernote1').summernote('code');
    obj.descHtml = $('#summernote2').summernote('code');
    if ($("#schoolImage")[0].files.length > 0) {
      var files = $("#schoolImage")[0].files
      var fileName = files[0].name;
      if (!(/\.(gif|jpg|jpeg|tiff|png)$/i).test(fileName)) {
        toastr.error("Please enter valid Image file", "Error");
        return false;
      }

      S3.upload({
        files: files,
        path: "schools"
      }, function (e, r) {
        obj.mainImage = r.secure_url
        Meteor.call("addSchool", obj, function (error, result) {
          if (error) {
            console.log("error", error);
          }
          if (result) {
            setTimeout(function () {
              moveTab("Next");
            }, 1000);
            loadMySchool();
            Router.go('/schoolAdmin/' + result + '/edit');
          }
        });
      });
    } else {
      Meteor.call("addSchool", obj, function (error, result) {
        if (error) {
          console.log("error", error);
        }
        if (result) {
          setTimeout(function () {
            moveTab("Next");
          }, 1000);
          loadMySchool();
          Router.go('/schoolAdmin/' + result + '/edit');
        }
      });
    }
  },
  "click #editSchool": function (event, template) {
    if ($('.schoolForm').valid() == false) {
      return false
    }
    var obj = {}
    if (Roles.userIsInRole(Meteor.userId(), "Superadmin")) {

    } else {
      obj.userId = Meteor.userId();
    }
    obj.name = $("#sname").val();
    obj.website = $("#Website").val();
    obj.phone = $("#phone").val();
    obj.backGroundVideoUrl = $('#backGroundVideoUrl').val()
    obj.aboutHtml = $('#summernote1').summernote('code');
    obj.descHtml = $('#summernote2').summernote('code');
    if ($("#schoolImage")[0].files.length > 0) {
      var files = $("#schoolImage")[0].files
      var fileName = files[0].name;
      if (!(/\.(gif|jpg|jpeg|tiff|png)$/i).test(fileName)) {
        toastr.error("Please enter valid Image file", "Error");
        return false;
      }
      S3.upload({
        files: files,
        path: "schools"
      }, function (e, r) {
        obj.mainImage = r.secure_url
        Meteor.call("editSchool", Router.current().params.schoolId, obj, function (error, result) {
          if (error) {
            console.log("error", error);
          }
          if (result) {
            setTimeout(function () {
              moveTab("Next");
            }, 1000);
            // Router.go('/schoolAdmin/'+result);
          }
        });
      });
    } else {
      Meteor.call("editSchool", Router.current().params.schoolId, obj, function (error, result) {
        if (error) {
          console.log("error", error);
        }
        if (result) {
          setTimeout(function () {
            moveTab("Next");
          }, 1000);
          // Router.go('/schoolAdmin/'+result);
        }
      });
    }

  },
  "click #add_location": function (event, template) {
    setTimeout(function () {
      $('#myModal').appendTo("body").modal('show');
      /*$('#myModal').modal({*/
      /*show: true*/
      /*});*/
    }, 100);
    $(".formmyModal").trigger("reset")
  },
  "click #addRoomsModel": function (event, template) {
    var location_id = $(event.currentTarget).attr("data-id");
    setTimeout(function () {
      $(".room-form").trigger("reset")
      $('#roomModel').appendTo("body").modal('show');
      $('#location_id').val(location_id);
      $('#room_id').val('')
      /*$('#myModal').modal({*/
      /*show: true*/
      /*});*/
    }, 100);
    $(".formmyModal").trigger("reset")
  },
  "click #deleteRoom": function (event, template) {
    var location_id = $(event.currentTarget).attr("data-location");
    var id = $(event.currentTarget).attr("data-id");
    Meteor.call("roomRemove", id, location_id, function (e, r) {

    });
  },
  "click .editRoomLocat": function (event, template) {
    var location_id = $(event.currentTarget).attr("data-location");
    var id = $(event.currentTarget).attr("data-id");
    var name = $(event.currentTarget).attr("data-name");
    var capicity = $(event.currentTarget).attr("data-capicity");
    $('#roomModel').appendTo("body").modal('show');
    $('#location_id').val(location_id);
    $('#room_name').val(name);
    $('#room_capacity').val(capicity);
    $('#room_id').val(id);

  },
  "click #editLocation": function (event, template) {
    var location_id = $(event.currentTarget).attr("data-id");
    var slocation = SLocation.findOne({ _id: location_id })
    $("#Eloc1").val(slocation.title)
    $("#EStAddress").val(slocation.address)
    $("#Ecity").val(slocation.city)
    $("#Eneighbor").val(slocation.neighbourhood)
    $("#Estate").val(slocation.state)
    $("#Ezcode").val(slocation.zip)
    $("#Ecountry").val(slocation.country);
    $("#Eid").val(slocation._id)
    setTimeout(function () {
      $('#EditLocModal').appendTo("body").modal('show');
      /*$('#EditLocModal').modal({
          show: true
      });*/
    }, 100);
  },

  "click #deleteLocation": function (event, template) {
    var location_id = $(event.currentTarget).attr("data-id");
    Meteor.call("removeLocation", location_id, function (error, result) {
      if (error) {
        console.log("error", error);
      }
      if (result) {

      }
    });
  },
  "click #nxt": function () {
    moveTab("Next");
  },
  "click #prv": function () {
    moveTab("Previous");
  },
  "click #newClasstype": function () {
    setTimeout(function () {
      $("#ClassTypeModal").appendTo("body").modal('show');
    }, 100);
    $(".formClassTypeModal").trigger("reset")
    // $('.repeating').click(function(){
    //   if($('.repeating').is(":checked")){
    //     $('.repeat_box').show();
    //   }else{
    //     $('.repeat_box').hide();
    //   }
    // });
  },
  "click #AddNewClass": function (event, template) {
    var ClassTypeId = $(event.currentTarget).attr("data-id");
    $(".repeating").attr("checked", false);
    $('.repeat_box').hide();
    setTimeout(function () {
      $("#addClass1").appendTo("body").modal('show');
      Session.set("slectedLocation", $('#class_location').val());
    }, 100);
    $(".formaddClass1").trigger("reset")
    $("#newclassTypeId").val(ClassTypeId);

    $('#addClass').text("Add Class");
  },
  "click #editClassType": function (event, template) {
   var classType_id = $(event.currentTarget).attr("data-id");
    setTimeout(function () {
      var classTypeobj = ClassType.findOne({ _id: classType_id });
      try {
        $(".editformClassTypeModal").trigger("reset")
      } catch (e) {
      }
      template.tagsData.set(classTypeobj);
      Session.set('tagStr', classTypeobj.tags);
      $("#EclassType1").val(classTypeobj.name);
      $("#EskillTypeId").val(classTypeobj.skillTypeId);
      $("#EclassDesc").val(classTypeobj.desc);
      if (classTypeobj.classTypeImg) {
        console.log(classTypeobj.classTypeImg);
        $("#EclassTypeImg").attr("src", classTypeobj.classTypeImg);
      } else {
        $("#EclassTypeImg").attr("src", "http://img.freepik.com/free-icon/high-school_318-137014.jpg?size=338c&ext=jpg");
      }
      $('#editClassTypeIdValue').val(classTypeobj._id);
      $('#EditClassTypeModal').appendTo("body").modal('show');

    }, 100);
  }, "click #deleteClassType": function (event, template) {
    var classType = $(event.currentTarget).attr("data-id");
    Meteor.call("removeClassType", classType, function (error, result) {
      if (error) {
        console.log("error", error);
      }
      if (result) {

      }
    });
  },
  "click #deleteClass": function (event, template) {
    var classId = $(event.currentTarget).attr("data-id");
    Meteor.call("removeSkillClass", classId, function (error, result) {
      if (error) {
        console.log("error", error);
      }
      if (result) {

      }
    });
  },
  "click #newMonth": function () {
    setTimeout(function () {
      $('.onMonthPrice').select2({ dropdownParent: $("#MonthModal") })
      $("#MonthModal").appendTo("body").modal('show');
    }, 100);
    $(".formMonthModal").trigger("reset")
  },
  "click #newClass": function () {
    setTimeout(function () {
      $('.onClassPrice').select2({ dropdownParent: $("#ClassModal") })
      $("#ClassModal").appendTo("body").modal('show');
    }, 100);
    $('#addClassPrice').text("Add")
    $(".formClassModal").trigger("reset")
  },
  "click #editpriceMonth": function (event, template) {
    var id = $(event.currentTarget).attr("data-id");
    var obj = MonthlyPricing.findOne({ _id: id })
    $('#MonthlyPackagesId').val(id);
    $('#EpackageName').val(obj.packageName);
    $('#EpymtType').val(obj.pymtType);
    if (obj.classTypeId) {
      /*$('#EclassTypeId').val(obj.classTypeId.split(","));*/
      $("#EclassTypeId").select2("val", obj.classTypeId.split(","))
    }

    $('#EoneMonCost').val(obj.oneMonCost);
    $("#EthreeMonCost").val(obj.threeMonCost);
    $("#EsixMonCost").val(obj.sixMonCost);
    $("#EannualCost").val(obj.annualCost);
    $("#ElifetimeCost").val(obj.lifetimeCost);

    setTimeout(function () {
      $('.onEMonthPrice').select2({ dropdownParent: $("#EditPriceMonth") })
      $('#EditPriceMonth').appendTo("body").modal('show');
    }, 100);
  },
  "click #deletepriceMonth": function (event, template) {
    var id = $(event.currentTarget).attr("data-id");
    Meteor.call("removeMonthlyPackages", id, function (error, result) {
      if (error) {
        console.log("error", error);
      }
      if (result) {

      }
    });
  },
  "click #editPriceClass": function (event, template) {
    var id = $(event.currentTarget).attr("data-id");
    obj = ClassPricing.findOne({ _id: id });
    $('#classCostsId').val(id)
    $('#CpackageName').val(obj.packageName);
    $('#Ccost').val(obj.cost);
    if (obj.classTypeId) {
      $('#CclassTypeId').val(obj.classTypeId.split(","));
    }
    $('#CnoClasses').val(obj.noClasses);
    $("#Cstart").val(obj.start);
    $("#Cfinish").val(obj.finish);
    $('#addClassPrice').text("Edit")
    setTimeout(function () {
      $('.onClassPrice').select2({ dropdownParent: $("#ClassModal") })
      $("#ClassModal").appendTo("body").modal('show');
    }, 100);
  },
  "click #deletePriceClass": function (event, template) {
    var id = $(event.currentTarget).attr("data-id");
    Meteor.call("removeClassPricing", id, function (error, result) {
      if (error) {
        console.log("error", error);
      }
      if (result) {

      }
    });
  },
  "click #finalAccess": function (event, template) {
    Router.go('/schoolAdmin/' + Router.current().params.schoolId);
  },
  "click .validate": function (event, template) {
    if (Router.current().params.schoolId) {
      if ($('.schoolForm').valid() == false) {
        setTimeout(function () {
          toastr.error("Please Enter Required field", "Error");
          $($('.nav-navigation li')[0]).find("a").trigger("click");
        }, 100);
      }
    } else {
      setTimeout(function () {
        $('.schoolForm').valid()
        /*document.location.reload(true);*/
        $($('.nav-navigation li')[0]).find("a").trigger("click");
      }, 500);
      toastr.error("Please Enter School details first", "Error");
    }
  },
  "click .delete-file": function (event, template) {
    var imagePath = $(event.currentTarget).attr("data-src");
    src = imagePath.split("skillshape")[1]
    S3.delete(src, function (error, result) {
      if (error) {
        console.log('error:', error)
        Meteor.call("removeMedia", Router.current().params.schoolId, imagePath, function (error, result) {
          if (error) {
            console.log("error", error);
          }
          if (result) {
            console.log('result:', result)
          }
        });
      } else {
        Meteor.call("removeMedia", Router.current().params.schoolId, imagePath, function (error, result) {
          if (error) {
            console.log("error", error);
          }
          if (result) {
            console.log('result:', result)
          }
        });
        console.log('result:', result)
      }
    });
  },
  "click #editClass": function (event, template) {
    $('.formClassTypeModal').valid()
    var classId = $(event.currentTarget).attr("data-id");
    console.log(classId);
    obj = SkillClass.findOne({ _id: classId })
    var selected_option = obj.tab_option
    $('#' + selected_option).addClass('active').siblings().removeClass('active');
    $('.navigation-tab').removeClass('active');
    $($($('#' + selected_option).find('a')[0]).attr('href')).addClass('active');
    console.log(obj);
    $('#addClass').text("Edit Class");
    $('#class_name').val(obj.className);
    $('#class_location').val(obj.locationId);
    $("#newclassTypeId").val(obj.classTypeId);
    $("#start_date").val(obj.plannedStart);
    $("#end_time").val(obj.planEndTime);
    $("#start_time").val(obj.planStartTime);
    $("#classDescription").val(obj.classDescription);
    Session.set("slectedLocation", obj.locationId);
    $('#class_room').val(obj.room);
    $("#currentClassId").val(classId)
    $.each($('.repeat_on'), function (i, val) {
      $(val).prop('checked', '');
    });
    if (selected_option == "RepeatingClass" || selected_option == "OngoingClass") {
      repeats = JSON.parse(obj.repeats)

      if (repeats.end_option == "Never") {
        $("input:radio[value='" + repeats.end_option + "']").prop('checked', 'checked');
      } else {
        $("input:radio[value='" + repeats.end_option + "']").prop('checked', 'checked');
        $('#' + repeats.end_option).val(repeats.end_option_value)
      }
      if (selected_option == "RepeatingClass") {
        $("#RepeatingClass_start_date").val(repeats.start_date)
        $("#RepeatingClass_end_date").val(repeats.end_option_value)
      }
      $.each(repeats.repeat_on, function (i, val) {
        $("input:checkbox[value='" + val + "']").prop('checked', 'checked');
      });
      $.each(repeats.repeat_details, function (i, val) {
        $("#" + selected_option + "_" + val["day"] + "_start_time").val(val["start_time"])
        $("#" + selected_option + "_" + val["day"] + "_end_time").val(val["end_time"])
        $("#" + selected_option + "_" + val["day"] + "_location").val(val["location"])
        /*repeat_details.push({"day":$(i).val(),"start_time":$("#"+$(i).val()+"_start_time").val(),"end_time":$("#"+$(i).val()+"_end_time").val(),"location":$("#"+$(i).val()+"_location").val()})*/
      });
    }
    setTimeout(function () {
      $("#addClass1").appendTo("body").modal('show');

    }, 100);
  }
});
Template.EditPriceClassTemplate.events({
  "click #addClassPrice": function (event, template) {
    var obj = {}
    obj.packageName = $('#CpackageName').val();
    obj.cost = $('#Ccost').val();
    obj.classTypeId = $('#CclassTypeId').val();
    obj.noClasses = $('#CnoClasses').val();
    obj.start = $("#Cstart").val();
    obj.finish = $("#Cfinish").val();
    if (obj.classTypeId) {
      obj.classTypeId = obj.classTypeId.join(",")
    }
    obj.schoolId = Router.current().params.schoolId;
    console.log(obj);
    if ($('#addClassPrice').text() == "Add") {
      Meteor.call("addClassPricing", obj, function (error, result) {
        if (error) {
          console.log("error", error);
        }
        if (result) {

        }
      });
    } else {
      var id = $("#classCostsId").val()
      Meteor.call("updateClassPricing", id, obj, function (error, result) {
        if (error) {
          console.log("error", error);
        }
        if (result) {

        }
      });
    }
  }
});
Template.AddClassType.events({
  "change #NskillTypeId": function (event, template) {
    template.selectedSkillType.set($(event.currentTarget).val());
    Session.set('tagStr', null);
  },
  "click #AddClassTypeClick": function (event, template) {
    if ($('.formClassTypeModal').valid() == false) {
      return false;
    }
    var obj = {}
    obj.createdBy = Meteor.userId();
    obj.schoolId = Router.current().params.schoolId;
    obj.name = $("#NclassType1").val()
    obj.skillTypeId = $("#NskillTypeId").val()
    obj.desc = $("#NclassDesc").val()
    obj.tags = Session.get('tagStr');
    $('#ClassTypeModal').modal('hide');
    if ($("#nclassTypeImg")[0].files.length > 0) {
      var files = $("#nclassTypeImg")[0].files
      var fileName = files[0].name;
      if (!(/\.(gif|jpg|jpeg|tiff|png)$/i).test(fileName)) {
        toastr.error("Please enter valid Image file", "Error");
        return false;
      }
      S3.upload({
        files: files,
        path: "class"
      }, function (e, r) {
        console.log(r);
        obj.classTypeImg = r.secure_url
        console.log(obj);
        Meteor.call("addClassType", obj, function (error, result) {
          Session.set('tagStr', null);
          if (error) {
            console.log("error", error);
          }
          if (result) {

          }
        });
      });
    } else {
      Meteor.call("addClassType", obj, function (error, result) {
        if (error) {
          console.log("error", error);
        }
        if (result) {
          console.log(result);
        }
      });
    }
  }
});
Template.AddMonthlyPackageTemplate.events({
  "click #addMonthlyPackages": function (event, template) {
    var obj = {}
    obj.packageName = $('#packageName').val();
    obj.pymtType = $('#pymtType').val();
    obj.classTypeId = $('#classTypeId').val();
    if (obj.classTypeId) {
      obj.classTypeId = obj.classTypeId.join(",")
    }
    obj.oneMonCost = $('#oneMonCost').val();
    obj.threeMonCost = $("#threeMonCost").val();
    obj.sixMonCost = $("#sixMonCost").val();
    obj.annualCost = $("#annualCost").val();
    obj.lifetimeCost = $("#lifetimeCost").val();
    obj.schoolId = Router.current().params.schoolId;
    console.log(obj);
    Meteor.call("addMonthlyPackages", obj, function (error, result) {
      if (error) {
        console.log("error", error);
      }
      if (result) {

      }
    });
  }
});
Template.AddMonthlyPackageTemplate.rendered = function () {
  $('.onMonthPrice').select2({ dropdownParent: $("#classTypeId") })
}
Template.EditMonthlyPackageTemplate.rendered = function () {
  $('.onEMonthPrice').select2({ dropdownParent: $("#EclassTypeId") })
}
Template.EditPriceClassTemplate.rendered = function () {
  $('.onClassPrice').select2({ dropdownParent: $("#ClassModal") })
}
Template.EditPriceClassTemplate.helpers({
  schoolClassTypes: function () {
    var schoolId = Router.current().params.schoolId;
    if (schoolId) {
      return ClassType.find({ "schoolId": Router.current().params.schoolId }).fetch()
    }
  }
});
Template.AddMonthlyPackageTemplate.helpers({
  schoolClassTypes: function () {
    var schoolId = Router.current().params.schoolId;
    if (schoolId) {
      console.log("AddMonthlyPackageTemplate");
      /*console.log(ClassType.find({"schoolId": Router.current().params.schoolId }).fetch());*/
      return ClassType.find({ "schoolId": Router.current().params.schoolId }).fetch()
    }
  }
});
Template.EditMonthlyPackageTemplate.helpers({
  schoolClassTypes: function () {
    var schoolId = Router.current().params.schoolId;
    if (schoolId) {
      return ClassType.find({ "schoolId": Router.current().params.schoolId })
    }
  }
});
Template.EditMonthlyPackageTemplate.events({
  "click #updateMonth": function (event, template) {
    var obj = {}
    obj.packageName = $('#EpackageName').val();
    obj.pymtType = $('#EpymtType').val();
    obj.classTypeId = $('#EclassTypeId').val();
    if (obj.classTypeId) {
      obj.classTypeId = obj.classTypeId.join(",")
    }
    obj.oneMonCost = $('#EoneMonCost').val();
    obj.threeMonCost = $("#EthreeMonCost").val();
    obj.sixMonCost = $("#EsixMonCost").val();
    obj.annualCost = $("#EannualCost").val();
    obj.lifetimeCost = $("#ElifetimeCost").val();
    obj.schoolId = Router.current().params.schoolId;
    var id = $('#MonthlyPackagesId').val();
    Meteor.call("updateMonthlyPackages", id, obj, function (error, result) {
      if (error) {
        console.log("error", error);
      }
      if (result) {

      }
    });
  }
});
Template.AddClassType.created = function () {
  const self = this;
  self.selectedSkillType = new ReactiveVar();
}
Template.AddClassType.helpers({
  skill_type: function () {
    return SkillType.find({});
  },
  getSelectedSkill: function () {
    return Template.instance().selectedSkillType.get();
  }
});
Template.EditClassType.created = function () {
  const self = this;
  self.selectedSkillType = new ReactiveVar();
}
Template.EditClassType.helpers({
  skill_type: function () {
    return SkillType.find({});
  },
  getSelectedSkill: function () {
    return Template.instance().selectedSkillType.get() || this.classType.skillTypeId;
  }
});
Template.EditClassType.events({

  "change #EskillTypeId": function (event, template) {
    template.selectedSkillType.set($(event.currentTarget).val());
    Session.set('tagStr', null)
  },
  "click #EditClassTypeClick": function (event, template) {
    if ($('.editformClassTypeModal').valid() == false) {
      return false;
    }
    var classType = $('#editClassTypeIdValue').val();
    var obj = {}
    obj.createdBy = Meteor.userId();
    obj.schoolId = Router.current().params.schoolId;
    obj.name = $("#EclassType1").val()
    obj.skillTypeId = $("#EskillTypeId").val()
    obj.desc = $("#EclassDesc").val()
    obj.tags = Session.get("tagStr")
    $('#EditClassTypeModal').modal('hide');
    if ($("#eclassTypeImg")[0].files.length > 0) {
      var files = $("#eclassTypeImg")[0].files
      var fileName = files[0].name;
      if (!(/\.(gif|jpg|jpeg|tiff|png)$/i).test(fileName)) {
        toastr.error("Please enter valid Image file", "Error");
        return false;
      }
      S3.upload({
        files: files,
        path: "class"
      }, function (e, r) {
        console.log(r);
        obj.classTypeImg = r.secure_url
        console.log(obj);
        Meteor.call("updateClassType", classType, obj, function (error, result) {
          Session.set("tagStr", null)
          if (error) {
            console.log("error", error);
          }
          if (result) {

          }
        });
      });
    } else {
      Meteor.call("updateClassType", classType, obj, function (error, result) {
        Session.set("tagStr", null)
        if (error) {
          console.log("error", error);
        }
        if (result) {

        }
      });
    }
  }
});
Template.classTemplate.events({

 "change .cc_locationt":(event,template)=>{
    Session.set("slectedLocation", template.$(event.currentTarget).val())
 },

  "change #class_location": function (event, template) {
    Session.set("slectedLocation", $('#class_location').val());
    value = $('#class_location').val();
    if (value) {
      $($('.repeat_on:checkbox')).each(function (i, e) {
        if ($('#' + $(e).val() + "_location").val() == null || $('#' + $(e).val() + "_location").val() == "") {
          $('#' + $(e).val() + "_location").val(value)
        }
      });
    }

  },
  "click #addClass": function (event, template) {
    if ($('.formaddClass1').valid() == false) {
      return false;
    }
    var selected_option = $('#wizard-navigation-class-edit').find('.active').attr('id');
    if (selected_option == "RepeatingClass") {
      start_date = $("#" + selected_option + "_start_date").val();
      end_date = $("#" + selected_option + "_end_date").val()
      console.log(start_date);
      console.log(end_date);
      if (start_date.length > 1 && end_date.length > 1) {
      } else {
        toastr.error("Please enter valid start and end date", "Error");
        return false;
      }
    }
    $('#addClass1').modal('hide');
    var obj = {}
    obj.tab_option = selected_option;
    obj.className = $('#class_name').val();
    obj.schoolId = Router.current().params.schoolId;
    obj.locationId = $('#class_location').val();
    obj.classTypeId = $("#newclassTypeId").val();
    obj.plannedStart = $("#start_date").val();
    obj.plannedEnd = $("#start_date").val();//$("#end_date").val();
    obj.classDescription = $("#classDescription").val();
    obj.room = $('#class_room').val();
    var repeat = {}
    obj.planEndTime = $("#end_time").val();
    obj.planStartTime = $("#start_time").val();
    if (obj.plannedStart) {

    } else {
      obj.plannedStart = moment(new Date).format('MM/DD/YYYY');
    }
    repeat.repeat_type = 'W';
    /*repeat_every = $("#repeat_every").val();*/
    repeat.repeat_every = 1;
    /*start_date = $("#rstart_date").val();*/

    if (selected_option == "RepeatingClass" || selected_option == "OngoingClass") {
      start_date = $("#" + selected_option + "start_date").val();
      if (start_date) {
      } else {
        start_date = moment(new Date).format('MM/DD/YYYY');
      }
      repeat.start_date = start_date
      obj.isRecurring = true
      repeat_on_item = $('.' + selected_option + '_repeat_on:checked');
      repeat_on = [];
      repeat_details = []
      $(repeat_on_item).each(function (y, i) {
        repeat_on.push($(i).val())
        repeat_details.push({ "day": $(i).val(), "start_time": $("#" + selected_option + "_" + $(i).val() + "_start_time").val(), "end_time": $("#" + selected_option + "_" + $(i).val() + "_end_time").val(), "location": $("#" + selected_option + "_" + $(i).val() + "_location").val(), "room": $("#" + selected_option + "_" + $(i).val() + "_room").val() })
      })
      repeat.repeat_on = repeat_on
      repeat.repeat_details = repeat_details
      end_option_item = $(".end_option:checked");
      end_option = ''
      if (selected_option == "OngoingClass") {
        end_option = "Never"
        end_option_value = "Never";
      } else if (selected_option == "RepeatingClass") {
        end_option = "rend_date"
        end_option_value = $('#RepeatingClass_end_date').val()
      }
      repeat.end_option = end_option
      repeat.end_option_value = end_option_value
      obj.repeats = JSON.stringify(repeat)
    } else {
      obj.isRecurring = false
      obj.repeats = "{}"
    }
    if ($('#addClass').text() == "Edit Class") {
      class_id = $("#currentClassId").val()

      Meteor.call("updateSkillClass", class_id, obj, function (error, result) {
        if (error) {
          console.log("error", error);
        }
        if (result) {

        }
      });
    } else {

      Meteor.call("addSkillClass", obj, function (error, result) {
        if (error) {
          console.log("error", error);
        }
        if (result) {

        }
      });
    }
  },
  "click .repeating": function (event, template) {
    $('#rstart_date').val($('#start_date').val())
    if ($('.repeating').is(":checked")) {
      $('.repeat_box').show();
    } else {
      $('.repeat_box').hide();
    }
  },
});
Template.classTemplate.helpers({
  locations: function () {
    var currentRoute = Router.current().originalUrl;
    if (currentRoute.includes("MyCalendar")) {
      schoolId = Session.get("MyCalendarCurrentSchool")
    } else {
      schoolId = Router.current().params.schoolId
    }
    return SLocation.find({ schoolId: schoolId })
  },
  rooms: function () {
    location_id = Session.get("slectedLocation")
    if (location_id) {
      locationitem = SLocation.findOne({ _id: location_id })
      if (locationitem) {
        return locationitem.rooms
      }
    }
  },

  locationhelper: () => {
    var currentRoute = Router.current();
    return {
      schoolId: currentRoute.originalUrl.includes("MyCalendar") ? Session.get("MyCalendarCurrentSchool") : currentRoute.params.schoolId,
      AfterlocationSelected: (selectedLocation) => {
       Session.set("slectedLocation", selectedLocation);
      }
    }
  }

});
Template.classTemplate.rendered = function () {
  $('.datepicker').datetimepicker({
    format: 'MM/DD/YYYY',
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
  $('#start_date').on('dp.change', function (e) {
    $('#rstart_date').val($('#start_date').val())
  })
  $('.timepicker').datetimepicker({
    //          format: 'H:mm',    // use this format if you want the 24hours timepicker
    format: 'H:mm',    //use this format if you want the 12hours timpiecker with AM/PM toggle
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
}
