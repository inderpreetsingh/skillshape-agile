Template.EditSchool.rendered = function() {
    $(".description").summernote({
        height: 130, //set editable area's height
        codemirror: { // codemirror options
            theme: 'monokai'
        },
        placeholder: 'Enter School description',
        dialogsInBody: true
    });
    $('.color-picker').colorpicker();
}