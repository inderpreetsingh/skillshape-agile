Template.EvaluationArchive.events({
  "click .filter-evaluation": function(event, template){
    $('#evaluation-filter-modal').appendTo("body").modal('show');
    $('.el_evaluation').select2({
       dropdownParent: $('.box2'),
     });
   $('.el_instructor').select2({
      dropdownParent: $('.box2'),
    });
    $('.el_student').select2({
       dropdownParent: $('.box2'),
     });
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

  }
});
