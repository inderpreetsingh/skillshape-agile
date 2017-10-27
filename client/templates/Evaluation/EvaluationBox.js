Template.EvaluationBox.rendered = function(){
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
}
