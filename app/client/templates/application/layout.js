Template.iframeembed.helpers({
  style_size : function(){
    if(Session.get("embed_height") && Session.get("embed_width")){
      style = "height:"+Session.get("embed_height")+"px;width:"+Session.get("embed_width")+"px;overflow: auto;"
      console.log(style);
      return "height:"+Session.get("embed_height")+"px;width:"+Session.get("embed_width")+"px;overflow: auto;"
    }else if(Session.get("embed_height")){
      return "height:"+Session.get("embed_height")+"px;overflow: auto;"
    }
  }
});
 debounce = function(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
};
join_school_events = function(){
  console.log("init");
  $(".join_school").off("click");
  $(".login").off("click");
  $("#btnTextSearch").off("click");
  $('#btnTextSearch').click(function(e){
    searchParams = $('#searchParams').val()
    Session.set("textSearch",searchParams)
    Session.set("initNearByLocation",false)
    var currentRoute = Router.current().originalUrl;
    if(Router.current().route.getName() != 'Home'){
      Router.go('/')
    }
  });
  $('.join_school').click(function(e){
    var active = $(e.target).attr("data-action");
    console.log(active);
    $('#'+active+'-tab').trigger("click")
    var currentRoute = Router.current().originalUrl;
    $('#loginmodal').modal('hide')
    $('#forget_pass_modal').modal('hide')
    $('#Join').modal('show')
    setTimeout(function(){
        if($('.navbar-toggle')){
          $('html').removeClass('nav-open');
          $('.close-layer').remove();
          $('.navbar-toggle').removeClass('toggled');
        }
    }, 400);
    // $('.navbar-toggle').trigger("click");
  });
  $('.login').click(function(){
      var currentRoute = Router.current().originalUrl;
      $('#forget_pass_modal').modal('hide')
      $('#Join').modal('hide')
      $('#loginmodal').modal('show')
      // $('.navbar-toggle').trigger("click");
      setTimeout(function(){
        if($('.navbar-toggle')){
          $('html').removeClass('nav-open');
          $('.close-layer').remove();
          $('.navbar-toggle').removeClass('toggled');
        }
      }, 400);
  });
}
if(Meteor.isClient){
  demo = {
      checkFullPageBackgroundImage: function(){
          $page = $('.full-page');
          image_src = $page.data('image');

          if(image_src !== undefined){
              image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
              $page.append(image_container);
          }
      },

      initFormExtendedDatetimepickers: function(){
          $('.datetimepicker').datetimepicker({
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
      },

      initMaterialWizard: function(){
          // Code for the Validator
          var $validator = $('.wizard-card form').validate({
      		  rules: {
      		    firstname: {
      		      required: true,
      		      minlength: 3
      		    },
      		    lastname: {
      		      required: true,
      		      minlength: 3
      		    },
      		    email: {
      		      required: true,
      		      minlength: 3,
      		    }
              },

              errorPlacement: function(error, element) {
                  $(element).parent('div').addClass('has-error');
               }
      	});


          // Prepare the preview for profile picture
          $("#wizard-picture").change(function(){
              readURL(this);
          });

          $('[data-toggle="wizard-radio"]').click(function(){
              wizard = $(this).closest('.wizard-card');
              wizard.find('[data-toggle="wizard-radio"]').removeClass('active');
              $(this).addClass('active');
              $(wizard).find('[type="radio"]').removeAttr('checked');
              $(this).find('[type="radio"]').attr('checked','true');
          });

          $('[data-toggle="wizard-checkbox"]').click(function(){
              if( $(this).hasClass('active')){
                  $(this).removeClass('active');
                  $(this).find('[type="checkbox"]').removeAttr('checked');
              } else {
                  $(this).addClass('active');
                  $(this).find('[type="checkbox"]').attr('checked','true');
              }
          });

          $('.set-full-height').css('height', 'auto');

           //Function to show image before upload

          function readURL(input) {
              if (input.files && input.files[0]) {
                  var reader = new FileReader();

                  reader.onload = function (e) {
                      $('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
                  }
                  reader.readAsDataURL(input.files[0]);
              }
          }

          $(window).resize(function(){
              $('.wizard-card').each(function(){
                  $wizard = $(this);
                  index = $wizard.bootstrapWizard('currentIndex');
                  refreshAnimation($wizard, index);

                  $('.moving-tab').css({
                      'transition': 'transform 0s'
                  });
              });
          });

          function refreshAnimation($wizard, index){
              total_steps = $wizard.find('li').length;
              move_distance = $wizard.width() / total_steps;
              step_width = move_distance;
              move_distance *= index;

              $current = index + 1;

              if($current == 1){
                  move_distance -= 8;
              } else if($current == total_steps){
                  move_distance += 8;
              }

              $wizard.find('.moving-tab').css('width', step_width);
              $('.moving-tab').css({
                  'transform':'translate3d(' + move_distance + 'px, 0, 0)',
                  'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

              });
          }
      }

  }

 var breakCards = true;

 var searchVisible = 0;
 var transparent = true;

 var transparentDemo = true;
 var fixedTop = false;

var  mobile_menu_visible = 0,
     mobile_menu_initialized = false,
     toggle_initialized = false,
     bootstrap_nav_initialized = false;

 var seq = 0, delays = 80, durations = 500;
 var seq2 = 0, delays2 = 80, durations2 = 500;


 // activate collapse right menu when the windows is resized
 // $(window).resize(function(){
 //     md.initSidebarsCheck();
 //     // reset the seq for charts drawing animations
 //     seq = seq2 = 0;
 // });

 md = {
     misc:{
         navbar_menu_visible: 0,
         active_collapse: true,
         disabled_collapse_init: 0,
     },

     checkSidebarImage: function(){
         $sidebar = $('.sidebar');
         image_src = $sidebar.data('image');

         if(image_src !== undefined){
             sidebar_container = '<div class="sidebar-background" style="background-image: url(' + image_src + ') "/>';
             $sidebar.append(sidebar_container);
         }
     },

     initSliders: function(){
         // Sliders for demo purpose
         $('#sliderRegular').noUiSlider({
             start: 40,
             connect: "lower",
             range: {
                 min: 0,
                 max: 100
             }
         });

         $('#sliderDouble').noUiSlider({
             start: [20, 60] ,
             connect: true,
             range: {
                 min: 0,
                 max: 100
             }
         });
     },

     initSidebarsCheck: function(){
         if($(window).width() <= 991){
             if($sidebar.length != 0){
                 md.initRightMenu();
             } else {
                 md.initBootstrapNavbarMenu();
             }
         }

     },

     initMinimizeSidebar:function(){

         // when we are on a Desktop Screen and the collapse is triggered we check if the sidebar mini is active or not. If it is active then we don't let the collapse to show the elements because the elements from the collapse are showing on the hover state over the icons in sidebar mini, not on the click.
         $('.sidebar .collapse').on('show.bs.collapse',function(){
             if($(window).width() > 991 && md.misc.sidebar_mini_active == true){
                 return false;
             } else{
                 return true;
             }
         });
         $('#minimizeSidebar').unbind('click');
         $('#minimizeSidebar').click(function(){
             var $btn = $(this);
             isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
             if(md.misc.sidebar_mini_active == true){
                 $('body').removeClass('sidebar-mini');
                 md.misc.sidebar_mini_active = false;
                 if(isWindows){
                     $('body').css('overflow','hidden');
                     $('.sidebar .sidebar-wrapper').perfectScrollbar();
                     $('.main-panel, .perfectScroll').perfectScrollbar({suppressScrollX:true});
                 }else{
                   $('body').css('overflow','hidden');
                   $('.main-panel').css('overflow-y','auto');
                   $('.perfectScroll').css('overflow-y','auto')
                 }

             }else{

                 $('.sidebar .collapse').collapse('hide').on('hidden.bs.collapse',function(){
                     $(this).css('height','auto');
                 });
                 setTimeout(function(){
                     $('body').addClass('sidebar-mini');
                     $('.sidebar .collapse').css('height','auto');
                     md.misc.sidebar_mini_active = true;
                 },100);
                 if(isWindows){
                     $('body').css('overflow','auto');
                     $('.sidebar .sidebar-wrapper').perfectScrollbar('destroy');
                      setTimeout(function(){
                       $('.main-panel, .perfectScroll').perfectScrollbar({suppressScrollX:true});
                       $('.main-panel, .perfectScroll').perfectScrollbar();
                     },500);
                 }else{
                   setTimeout(function(){
                     $('body').css('overflow','auto');
                     $('.main-panel').css('overflow','hidden');
                     $('.perfectScroll').css('overflow','hidden')
                     },200);
                 }
             }

             // we simulate the window Resize so the charts will get updated in realtime.
             var simulateWindowResize = setInterval(function(){
                 window.dispatchEvent(new Event('resize'));
             },180);

             // we stop the simulation of Window Resize after the animations are completed
             setTimeout(function(){
                 clearInterval(simulateWindowResize);
             },1000);
         });
     },

     checkScrollForTransparentNavbar: debounce(function() {
             if($(document).scrollTop() > 260 ) {
                 if(transparent) {
                     transparent = false;
                     $('.navbar-color-on-scroll').removeClass('navbar-transparent');
                 }
             } else {
                 if( !transparent ) {
                     transparent = true;
                     $('.navbar-color-on-scroll').addClass('navbar-transparent');
                 }
             }
     }, 17),


     initRightMenu: debounce(function(){
          $sidebar_wrapper = $('.sidebar-wrapper');
           if(!mobile_menu_initialized){

               $navbar = $('nav').find('.navbar-collapse').first().clone(true);
              //  console.log($navbar);
               nav_content = '';
               mobile_menu_content = '';

               $navbar.children('ul').each(function(){
                   content_buff = $(this).html();
                   nav_content = nav_content + content_buff;
               });

               nav_content = '<ul class="nav nav-mobile-menu">' + nav_content + '</ul>';

               $navbar_form = $('nav').find('.navbar-form').clone(true);

               $sidebar_nav = $sidebar_wrapper.find(' > .nav');

               // insert the navbar form before the sidebar list
               $nav_content = $(nav_content);
               $nav_content.insertBefore($sidebar_nav);
               $navbar_form.insertBefore($nav_content);

               $(".sidebar-wrapper .dropdown .dropdown-menu > li > a").click(function(event) {
                   event.stopPropagation();
               });

               // simulate resize so all the charts/maps will be redrawn
               window.dispatchEvent(new Event('resize'));

               mobile_menu_initialized = true;

               $(".close-nav").click(function(event) {
                   $('html').removeClass('nav-open');
                   $('.close-layer').remove();
                   setTimeout(function(){
                       if($toggle){
                         $toggle.removeClass('toggled');
                       }
                   }, 400);
                   mobile_menu_visible = 0;
               });

           } else {
               if($(window).width() > 991){
                   // reset all the additions that we made for the sidebar wrapper only if the screen is bigger than 991px
                   $sidebar_wrapper.find('.navbar-form').remove();
                   $sidebar_wrapper.find('.nav-mobile-menu').remove();
                   $(".close-nav").off("click");

                   mobile_menu_initialized = false;
               }
           }
            join_school_events();
            $('.off-canvas-sidebar').remove()
             $logout = $('.logout');
             $logout.off('click');
             $logout.click(function (){
               Meteor.logout();
               bootstrap_nav_initialized = false;
               mobile_menu_initialized = false;
               $('body').removeAttr('style');
               setTimeout(function () {
                 Router.go('/');
               }, 1000);
             });
             $toggle = $('.navbar-toggle');
             $toggle.off('click');
             $toggle.click(function (){

                 if(mobile_menu_visible == 1) {
                     $('html').removeClass('nav-open');
                     $('.close-layer').remove();
                     setTimeout(function(){
                         $toggle.removeClass('toggled');
                     }, 400);
                     mobile_menu_visible = 0;
                 } else {
                     setTimeout(function(){
                         $toggle.addClass('toggled');
                     }, 430);


                     main_panel_height = $('.main-panel')[0].scrollHeight;
                     $layer = $('<div class="close-layer"></div>');
                     $layer.css('height',main_panel_height + 'px');
                     $layer.appendTo(".main-panel");

                     setTimeout(function(){
                         $layer.addClass('visible');
                     }, 100);

                     $layer.click(function() {
                         $('html').removeClass('nav-open');
                         mobile_menu_visible = 0;

                         $layer.removeClass('visible');

                          setTimeout(function(){
                             $layer.remove();
                             $toggle.removeClass('toggled');

                          }, 400);
                     });

                     $('html').addClass('nav-open');
                     mobile_menu_visible = 1;

                 }
             });

             toggle_initialized = true;

     }, 500),


     initBootstrapNavbarMenu: debounce(function(){

         if(!bootstrap_nav_initialized){
             $navbar = $('nav').find('.navbar-collapse').first().clone(true);

             nav_content = '';
             mobile_menu_content = '';

             //add the content from the regular header to the mobile menu
             $navbar.children('ul').each(function(){
                 content_buff = $(this).html();
                 nav_content = nav_content + content_buff;
             });

             nav_content = '<ul class="nav nav-mobile-menu">' + nav_content + '</ul>';

             $navbar.html(nav_content);
             $navbar.addClass('off-canvas-sidebar');

             // append it to the body, so it will come from the right side of the screen
             $('body').append($navbar);
             $navbar.find('a').removeClass('btn btn-round btn-default');
             $navbar.find('button').removeClass('btn-round btn-fill btn-info btn-primary btn-success btn-danger btn-warning btn-neutral');
             $navbar.find('button').addClass('btn-simple btn-block');
             bootstrap_nav_initialized = true;
             $toggle = $('.navbar-toggle');
             $toggle.off('click');
             $toggle.click(function (){
                 if(mobile_menu_visible == 1) {
                     $('html').removeClass('nav-open');

                     $('.close-layer').remove();
                     setTimeout(function(){
                         $toggle.removeClass('toggled');
                     }, 400);

                     mobile_menu_visible = 0;
                 } else {
                     setTimeout(function(){
                         $toggle.addClass('toggled');
                     }, 430);

                     $layer = $('<div class="close-layer"></div>');
                     $layer.appendTo(".wrapper-full-page");

                     setTimeout(function(){
                         $layer.addClass('visible');
                     }, 100);


                     $layer.click(function() {
                         $('html').removeClass('nav-open');
                         mobile_menu_visible = 0;

                         $layer.removeClass('visible');

                          setTimeout(function(){
                             $layer.remove();
                             $toggle.removeClass('toggled');

                          }, 400);
                     });

                     $('html').addClass('nav-open');
                     mobile_menu_visible = 1;

                 }

             });
         }
         console.log("initBootstrapNavbarMenu");
         join_school_events();
     }, 800),

     startAnimationForLineChart: function(chart){

         chart.on('draw', function(data) {
           if(data.type === 'line' || data.type === 'area') {
             data.element.animate({
               d: {
                 begin: 600,
                 dur: 700,
                 from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                 to: data.path.clone().stringify(),
                 easing: Chartist.Svg.Easing.easeOutQuint
               }
             });
           } else if(data.type === 'point') {
                 seq++;
                 data.element.animate({
                   opacity: {
                     begin: seq * delays,
                     dur: durations,
                     from: 0,
                     to: 1,
                     easing: 'ease'
                   }
                 });
             }
         });

         seq = 0;
     },
     startAnimationForBarChart: function(chart){

         chart.on('draw', function(data) {
           if(data.type === 'bar'){
               seq2++;
               data.element.animate({
                 opacity: {
                   begin: seq2 * delays2,
                   dur: durations2,
                   from: 0,
                   to: 1,
                   easing: 'ease'
                 }
               });
           }
         });

         seq2 = 0;
     }
 }


 // Returns a function, that, as long as it continues to be invoked, will not
 // be triggered. The function will be called after it stops being called for
 // N milliseconds. If `immediate` is passed, trigger the function on the
 // leading edge, instead of the trailing.


}
 debounce= function(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
};
Template.Layout.rendered = function(){

}
Meteor.startup(function()
{
  // activate collapse right menu when the windows is resized
    $(window).resize(function(){
        md.initSidebarsCheck();
        // reset the seq for charts drawing animations
        seq = seq2 = 0;
    });
    for(var property in Template){
        if(Blaze.isTemplate(Template[property])){
            var template = Template[property];
            // assign the template an onRendered callback who simply prints the view name
            template.onRendered(function(){
              $('.main-panel').load().scrollTop(0);
                demo.checkFullPageBackgroundImage();
                $sidebar = $('.sidebar');
                if($.material){
                  $.material.init();
                }
                md.initSidebarsCheck();
                // // We put modals out of wrapper to working properly
                // $('.modal').appendTo("body");
                //

                //
                if($('body').hasClass('sidebar-mini')){
                    md.misc.sidebar_mini_active = true;
                }
                //
                window_width = $(window).width();
                //
                // check if there is an image set for the sidebar's background
                md.checkSidebarImage();
                //
                md.initMinimizeSidebar();
                $('body').removeAttr('style');
              //
              // //    Activate bootstrap-select
              // if($(".selectpicker").length != 0){
              //     $(".selectpicker").selectpicker();
              // }
              //
              // //  Activate the tooltips
              $('[rel="tooltip"]').tooltip();
                setTimeout(function() {
                    $('.card').removeClass('card-hidden');
                }, 700)
                isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

                if (isWindows && !$('body').hasClass('sidebar-mini'))
                {
                  //shawn - removed the perfect scroll bar as 2 scroll bars were coming
                   // if we are on windows OS we activate the perfectScrollbar function
                   setTimeout(function(){
                     $('.sidebar .sidebar-wrapper').perfectScrollbar();
                     $('.main-panel, .perfectScroll').perfectScrollbar({suppressScrollX:true});
                     $('html').addClass('perfect-scrollbar-on');
                     $('html').removeClass('perfect-scrollbar-off');

                   }, 200);
                }
                else
                {
                  if($('body').hasClass('sidebar-mini')){
                    $('body').css('overflow','auto')
                    setTimeout(function(){
                       $('.main-panel').css('overflow','hidden');
                       $('.perfectScroll').css('overflow','hidden');
                       $('html').addClass('perfect-scrollbar-off');
                       $('html').removeClass('perfect-scrollbar-on');
                     }, 200);
                  }else{
                    $('body').css('overflow','hidden')
                    setTimeout(function(){
                       $('.main-panel').css('overflow-y','auto');
                       $('.perfectScroll').css('overflow-y','auto');
                       $('html').addClass('perfect-scrollbar-off');
                       $('html').removeClass('perfect-scrollbar-on');
                     }, 200);
                  }

                }

                if(isWindows){
                  setTimeout(function(){
                     if($('.ps-active-y').length == 0){
                        $('body').css('overflow','auto');
                     }else{
                       $('body').css('overflow','hidden');
                     }
                  }, 200);
                }
              //
              // //removed class label and label-color from tag span and replaced with data-color
              // var tagClass = $('.tagsinput').data('color');
              //
              // $('.tagsinput').tagsinput({
              //     tagClass: ' tag-'+ tagClass +' '
              // });
              //
              // //    Activate bootstrap-select
              // $(".select").dropdown({ "dropdownClass": "dropdown-menu", "optionClass": "" });
              //
              // $('.form-control').on("focus", function(){
              //     $(this).parent('.input-group').addClass("input-group-focus");
              // }).on("blur", function(){
              //     $(this).parent(".input-group").removeClass("input-group-focus");
              // });


              // if(breakCards == true){
              //     // We break the cards headers if there is too much stress on them :-)
              //     $('[data-header-animation="true"]').each(function(){
              //         var $fix_button = $(this)
              //         var $card = $(this).parent('.card');
              //
              //         $card.find('.fix-broken-card').click(function(){
              //             console.log(this);
              //             var $header = $(this).parent().parent().siblings('.card-header, .card-image');
              //
              //             $header.removeClass('hinge').addClass('fadeInDown');
              //
              //             $card.attr('data-count',0);
              //
              //             setTimeout(function(){
              //                 $header.removeClass('fadeInDown animate');
              //             },480);
              //         });
              //
              //         $card.mouseenter(function(){
              //             var $this = $(this);
              //             hover_count = parseInt($this.attr('data-count'), 10) + 1 || 0;
              //             $this.attr("data-count", hover_count);
              //
              //             if (hover_count >= 20){
              //                 $(this).children('.card-header, .card-image').addClass('hinge animated');
              //             }
              //         });
              //     });
              // }

            });
        }
    }
});


Template.Layout.helpers({
  is_coming_soon_page: function(){
    var routeName = Router.current().route.getName();
    console.log(routeName)
    if (routeName == "ComingSoon"){
      return "wrapper wrapper-full-page"
    }else{
      return "main-panel"
    }
  },
  coming_soon_page_style : function(){
    var routeName = Router.current().route.getName();
    console.log(routeName)
    if (routeName == "ComingSoon"){
      return "margin-top:0px !important;padding:0px !important;"
    }else{
      return ""
    }
  },
  is_demo_user : function(){
    user = Meteor.user();
    if(user.profile && user.profile.is_demo_user && user.profile.is_demo_user == true){
        return true;
    }else{
      return false;
    }
  }
});
Template.Layout.events({
  "click .join_school": function(event, template) {
      event.preventDefault();
      var active = $(event.currentTarget).attr("data-action");
      $('#'+active+'-tab').trigger("click")
      var currentRoute = Router.current().originalUrl;
        $('#forget_pass_modal').modal('hide')
        $('#Join').modal('show')
        $('#loginmodal').modal('hide')

  },
  "click .login": function(event, template) {
      event.preventDefault();
      var currentRoute = Router.current().originalUrl;
        $('#forget_pass_modal').modal('hide')
        $('#loginmodal').modal('show')
        $('#Join').modal('hide')
  },
  "click .goBack":function(){
      window.history.back();
  },
  'click .resend-verification-link' ( event, template ) {
   Meteor.call( 'sendVerificationLink', function( error, response )  {
     if ( error ) {
       toastr.error(error.reason,"Error");
     } else {
       var email = Meteor.user().emails[ 0 ].address;
       toastr.success("Verification sent to "+email+"","Success");
     }
   });
 },
 "click .logout": function(event, template) {
     event.preventDefault();
     Meteor.logout();
     $('body').removeAttr('style');
     setTimeout(function () {
       Router.go('/');
     }, 1000);
 }
});
