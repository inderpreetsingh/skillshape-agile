Template.MediaUpload.events({
  "click .btn_upload": function(event, template){
    $('#media-upload-modal').appendTo("body").modal('show');
    $('.el_student').select2({
       dropdownParent: $('.box2'),
     });
     $('.el_skill').select2({
        dropdownParent: $('.box2'),
    });
  },
 "click .upload": function(event, template){
    $('#RoleModal1').appendTo("body").modal('show');
 },
    "click .link": function(event, template){
    $('#RoleModal2').appendTo("body").modal('show');
},
"click .btn_submit_link" : function(e,b){
  $('#RoleModal2').appendTo("body").modal('show');
  $('#RoleModal1').appendTo("body").modal('show');
}
});
Template.MediaUpload.rendered = function(){
    $('.dropdown-toggle').dropdown();
    $('.el_student').select2();
    $('.el_skill').select2();
}
