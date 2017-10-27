Template.ProgramManager.events({
  "click .class-requirement": function(event, template){
    $('#class-requirement').appendTo("body").modal('show');
  }
});
