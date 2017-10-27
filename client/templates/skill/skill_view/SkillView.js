Template.SkillView.events({
  "click .skil_group": function(event, template){
    if($('.skil_group').is(":checked")){
      $('#skil_group').show();
    }else{
      $('#skil_group').hide();
    }
  }
});
Template.SkillView.rendered = function(){
    $('.dropdown-toggle').dropdown()
    // $('#skil_group').hide();
}
