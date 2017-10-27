/**
 * Created by PejaComputer on 4/6/2017.
 */
Template.SkillEditor.rendered = function(){
    $('.dropdown-toggle').dropdown()
    // $('#skil_group').hide();
}
Template.SkillEditor.events({
  "click .skil_group": function(event, template){
    if($('.skil_group').is(":checked")){
      $('#skil_group').show();
    }else{
      $('#skil_group').hide();
    }
  }
});
