Template.ClassArchive.events({
  "click .class-template": function(event, template){
    $('#class-template').appendTo("body").modal('show');
  },
  "click .searchModal": function(event, template){
    $('#searchModal').appendTo("body").modal('show');
  }
});
