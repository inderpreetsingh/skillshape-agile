Template.ContactUs.events({
"click #sendfeedback":function(e,t)
{
    var selected_option = $("input[name=optionsRadios]:checked").val();
    var message = $('#message').val()
    var name = $('#name').val()
    var email = $('#email').val()


    if( !email )
    {
      toastr.error("Please enter your Email address","Error");
      return ; 
    } 

    if( !message )
    {
      toastr.error("Please enter your message","Error");
      return ; 
    } 

    Meteor.call("sendfeedbackToAdmin", name,email,message,selected_option, function(error, result){
      if(error){
        console.log("error", error);
      }
      if(result){
        toastr.success("Thanks for provide your feedback","Success");
        setTimeout(function () {
          Router.go('Home');
        }, 200);
      }
    });
}
});
Template.ContactUs.rendered = function()
{

}
Template.howitworks.rendered = function()
{


$(function() {
  'use strict';
  
  var selector = $('.ac-title');

  $('.accordion-wrapper').each(function() {
    if ($(this).find('.ac-pane').hasClass('active')) {
      $('.ac-pane.active .ac-content').css('display', 'block');
    }
  });
  
  selector.on('click', function(event) {
    event.preventDefault();

    // get the attr value
    var attr = selector.attr('data-accordion');
    var getparent = $(this).closest('.accordion-wrapper');

    if ( $(this).attr('data-accordion') == 'true' ) {

        if ($(this).next('.ac-content').is(':visible')) {
          return false;
        }else {

          getparent.find('.ac-content').slideUp();
          $(this).next('.ac-content').slideDown();
          getparent.find('.ac-pane').removeClass('active');
          $(this).parent().addClass('active');
        }

    } else {
        $(this).next('.ac-content').slideToggle();
        $(this).parent().toggleClass('active');
    }
    
  });
});

}