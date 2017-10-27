Template.Schools.events({
  "click #event": function(event, template){

  }
});
Template.Schools.helpers({
  school_list : function(){
    return School.find({});
  }
});
