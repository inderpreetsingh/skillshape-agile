Template.ClassDetail.rendered = function(){
  $('#class_end').hide()
  $('.dropdown-toggle').dropdown()  
}
Template.ClassDetail.events({
  "click .add_evaluation": function(event, template){
    $('#class-evaluation').appendTo("body").modal('show');
    $('.el_student').select2({
       dropdownParent: $('.box2'),
     });
     $('.el_level').select2({
        dropdownParent: $('.box2'),
    });
    $('.el_skill').select2({
      dropdownParent: $('.box2'),
    });

    $('.ac_student1').select2({
      dropdownParent: $('.box3'),
    });
    $('.ac_student2').select2({
      dropdownParent: $('.box3'),
    });
    $('.ac_accidental').select2({
     dropdownParent: $('.box3'),
    });

    $('.co_skill').select2({
      dropdownParent: $('.box1'),
    });
    $('.co_student').select2({
       dropdownParent: $('.box1'),
     });
     $('.co_citation').select2({
        dropdownParent: $('.box1'),
      });
  },
  "click .btn_end": function(event, template){
    $('#class_join').show()
    $('#class_end').hide()
  },
  "click .btn_im_in": function(event, template){
    $('#class_join').hide()
    $('#class_end').show()
  }
});
