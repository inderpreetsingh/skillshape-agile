Template.SkillList.rendered = function(){
  $('#group_subject').hide();
  $('#subject_details').hide();

}
Template.SkillList.events({
  "click .catagory-item": function(event, template){
    event.preventDefault();
    $('#group_subject').hide();
    $('#group_subject').show();
    $('#subject_details').hide();
    $('#group_subject').animateCss('fadeIn');
  },
  "click .subject-item": function(event, template){
    event.preventDefault();
    $('#subject_details').hide();
    $('#subject_details').show();
    $('#subject_details').animateCss('fadeIn');
  }

});
