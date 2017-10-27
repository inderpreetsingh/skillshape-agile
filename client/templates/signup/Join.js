Template.Join.rendered = function(){
  $('html').removeClass('nav-open');

  $('.close-layer').remove();
  setTimeout(function(){
    if($toggle){
      $toggle.removeClass('toggled');
    }
  }, 400);
  mobile_menu_visible = 0;
}
Template.Join.events({
});
