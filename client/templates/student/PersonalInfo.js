Template.PersonalInfo.events({
  "click .change_password": function(event, template){
    $('#change_password').appendTo("body").modal('show');
  }
});
