Template.MemberChooser.events({
  "click .filter-member": function(event, template){
    $('#member_filter').appendTo("body").modal('show');
  }
});
