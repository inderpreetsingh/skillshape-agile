Template.classToolBar.events(
{
  "mouseover  .btn_animate" : function(event, template){
    current_element = $(event.currentTarget);
    $(current_element).attr('data-header-animation',"true");
    var $card = $(current_element).parent('.card');
    $card.mouseleave(function(){
      $(current_element).removeAttr("data-header-animation");
    });
  },
  "click .btn_upload": function(event, template)
  {
    $('#media-upload-modal').appendTo("body").modal('show');

    $('.el_student').select2(
    {
       dropdownParent: $('.box2'),
    });

    $('.el_skill').select2(
    {
        dropdownParent: $('.box2'),
    });

  },
    "click #fa_list": function (event, template) {
        if ($('#fa_list').hasClass("fa-list-alt")){
            $('#fa_list').removeClass("fa-list-alt").addClass("fa-info");
        }
        else {
            $('#fa_list').removeClass("fa-info").addClass("fa-list-alt");
        }
    },
});



Template.classToolBar.helpers(
{
    helperMobileHeight : function ()
    {
        if( Meteor.Device.isPhone())
          return 'height:400px;' ; 
        else if( Meteor.Device.isTablet())
          return 'height:80px;' ;
        else 
          return 'height:80px;' ;
    }
}) ;   
