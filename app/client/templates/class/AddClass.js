Template.AddClass.rendered = function(){
  $('.datepicker').datetimepicker({
     format: 'MM/DD/YYYY',
     icons: {
         time: "fa fa-clock-o",
         date: "fa fa-calendar",
         up: "fa fa-chevron-up",
         down: "fa fa-chevron-down",
         previous: 'fa fa-chevron-left',
         next: 'fa fa-chevron-right',
         today: 'fa fa-screenshot',
         clear: 'fa fa-trash',
         close: 'fa fa-remove',
         inline: true
     }
  });
  $('.dropdown-toggle').dropdown();

  $('.timepicker').datetimepicker({
  //          format: 'H:mm',    // use this format if you want the 24hours timepicker
     format: 'h:mm A',    //use this format if you want the 12hours timpiecker with AM/PM toggle
     icons: {
         time: "fa fa-clock-o",
         date: "fa fa-calendar",
         up: "fa fa-chevron-up",
         down: "fa fa-chevron-down",
         previous: 'fa fa-chevron-left',
         next: 'fa fa-chevron-right',
         today: 'fa fa-screenshot',
         clear: 'fa fa-trash',
         close: 'fa fa-remove',
         inline: true

     }
  });
 $(".selectpicker").selectpicker();
 $('.cc_locationt').select2();
 $('.cc_instructor').select2();
 $('.cc_assistants').select2();

   $('.repeat_box').hide();
}
Template.AddClass.events({
  "click .repeating": function(event, template){
    if($('.repeating').is(":checked")){
      $('.repeat_box').show();
    }else{
      $('.repeat_box').hide();
    }
  },
  "click .close_rep": function(event, template){
      $('.repeat_box').hide();
  },
  "click .load-class": function(event, template){
    $('#class-builder').appendTo("body").modal('show');
  }
});
