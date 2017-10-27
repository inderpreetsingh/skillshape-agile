Template.MemberDetailsStudent.events({
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
