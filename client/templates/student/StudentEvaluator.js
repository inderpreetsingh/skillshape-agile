Template.StudentEvaluator.events({
  "click .evaluate": function(event, template){
    $('#class-evaluation').appendTo("body").modal('show');
    $('.el_student').select2({
       dropdownParent: $('.box2'),
     });
     $('.el_level').select2({
        dropdownParent: $('.box2'),
    });
    $('.el_skill').select2({
      dropdownParent: $('.box2'),
    });

    $('.ac_student1').select2({
      dropdownParent: $('.box3'),
    });
    $('.ac_student2').select2({
      dropdownParent: $('.box3'),
    });
    $('.ac_accidental').select2({
     dropdownParent: $('.box3'),
    });

    $('.co_skill').select2({
      dropdownParent: $('.box1'),
    });
    $('.co_student').select2({
       dropdownParent: $('.box1'),
     });
     $('.co_citation').select2({
        dropdownParent: $('.box1'),
      });
  },
  "click .permission": function(event, template){
    $('#PermissionsModal').appendTo("body").modal('show');
  },
  "click .change_password": function(event, template){
    $('#change_password').appendTo("body").modal('show');
  },
  "click .role": function(event, template){
    $('#RoleModal').appendTo("body").modal('show');
  },
  "click .toggle_active": function(event, template){
    if($('.toggle_active').text() == "Activate User"){
      $('.toggle_active').text("Deactive User");
      $('.toggle_active').addClass("btn-rose");
    }
    else{
      $('.toggle_active').text("Activate User");
      $('.toggle_active').removeClass("btn-rose");
    }

  }
});
