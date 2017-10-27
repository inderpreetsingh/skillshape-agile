Template.ClassEdit.rendered = function(){
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
    $('.timepicker').datetimepicker({
        format: 'h:mm A',
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
    $('.cc_locationt').select2();
    $('.cc_instructor').select2();
    $('.cc_assistants').select2();

    $('.repeat_box').hide();

}
Template.ClassEdit.events({
  "click .load-class": function(event, template){
    $('#class-template').appendTo("body").modal('show');
  },
  "click .repeating": function(event, template){
    if($('.repeating').is(":checked")){
      $('.repeat_box').show();
    }else{
      $('.repeat_box').hide();
    }
  },
  "click .close_rep": function(event, template){
      $('.repeat_box').hide();
  }
});
