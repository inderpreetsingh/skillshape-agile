const breakCards = true;
const searchVisible = 0;
let transparent = true;
const transparentDemo = true;
const fixedTop = false;
let mobile_menu_visible = 0;
let mobile_menu_initialized = false;
let toggle_initialized = false;
let bootstrap_nav_initialized = false;
let seq = 0; let delays = 80; let
  durations = 500;
let seq2 = 0; let delays2 = 80; let
  durations2 = 500;

debounce = function (func, wait, immediate) {
  let timeout;
  return function () {
    const context = this; let
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
};

export function initializeLayout() {
  $(window).resize(() => {
    md.initSidebarsCheck();
    // reset the seq for charts drawing animations
    seq = seq2 = 0;
  });
  // $('.main-panel').load().scrollTop(0);
  $sidebar = $('.sidebar');
  if ($.material) {
    $.material.init();
  }
  md.initSidebarsCheck();
  if ($('body').hasClass('sidebar-mini')) {
    md.misc.sidebar_mini_active = true;
  }
  window_width = $(window).width();
  // md.checkSidebarImage();

  md.initMinimizeSidebar();
  $('body').removeAttr('style');
  $('[rel="tooltip"]').tooltip();
  setTimeout(() => {
    $('.card').removeClass('card-hidden');
  }, 700);
  isWindows = navigator.platform.indexOf('Win') > -1;
  if (isWindows && !$('body').hasClass('sidebar-mini')) {
    // shawn - removed the perfect scroll bar as 2 scroll bars were coming
    // if we are on windows OS we activate the perfectScrollbar function
    setTimeout(() => {
      $('.sidebar .sidebar-wrapper').perfectScrollbar();
      $('.main-panel, .perfectScroll').perfectScrollbar({ suppressScrollX: true });
      $('html').addClass('perfect-scrollbar-on');
      $('html').removeClass('perfect-scrollbar-off');
    }, 200);
  } else if ($('body').hasClass('sidebar-mini')) {
    $('body').css('overflow', 'auto');
    setTimeout(() => {
         $('.main-panel').css('overflow','hidden');
         $('.perfectScroll').css('overflow','hidden');
         $('html').addClass('perfect-scrollbar-off');
         $('html').removeClass('perfect-scrollbar-on');
       }, 200);
  } else {
    $('body').css('overflow', 'hidden');
    setTimeout(() => {
         $('.main-panel').css('overflow-y','auto');
         $('.perfectScroll').css('overflow-y','auto');
         $('html').addClass('perfect-scrollbar-off');
         $('html').removeClass('perfect-scrollbar-on');
       }, 200);
  }

  if (isWindows) {
    setTimeout(() => {
      if ($('.ps-active-y').length == 0) {
        $('body').css('overflow', 'auto');
      }else {
        $('body').css('overflow', 'hidden');
      }
    }, 200);
  }
}


let md = {
  misc: {
    navbar_menu_visible: 0,
    active_collapse: true,
    disabled_collapse_init: 0,
  },

  checkSidebarImage() {
    $sidebar = $('.sidebar');
    image_src = $sidebar.data('image');

    if (image_src !== undefined) {
      sidebar_container = `<div class="sidebar-background" style="background-image: url(${  image_src  }) "/>`;
      $sidebar.append(sidebar_container);
    }
  },

  initSliders() {
    // Sliders for demo purpose
    $('#sliderRegular').noUiSlider({
      start: 40,
      connect: 'lower',
      range: {
        min: 0,
        max: 100,
      },
    });

    $('#sliderDouble').noUiSlider({
      start: [20, 60],
      connect: true,
      range: {
        min: 0,
        max: 100,
      },
    });
  },

  initSidebarsCheck() {
    if ($(window).width() <= 991) {
      if ($sidebar.length != 0) {
        md.initRightMenu();
      } else {
        md.initBootstrapNavbarMenu();
      }
    }
  },

  initMinimizeSidebar() {
    // when we are on a Desktop Screen and the collapse is triggered we check if the sidebar mini is active or not. If it is active then we don't let the collapse to show the elements because the elements from the collapse are showing on the hover state over the icons in sidebar mini, not on the click.
    $('.sidebar .collapse').on('show.bs.collapse', function(){
             if($(window).width() > 991 && md.misc.sidebar_mini_active == true){
                 return false;
             } 
                 return true;
             
         });
    $('#minimizeSidebar').unbind('click');
    $('#minimizeSidebar').click(function () {
      isWindows = navigator.platform.indexOf('Win') > -1;
      if (md.misc.sidebar_mini_active == true) {
        $('body').removeClass('sidebar-mini');
        md.misc.sidebar_mini_active = false;
        if (isWindows) {
          $('body').css('overflow', 'hidden');
          $('.sidebar .sidebar-wrapper').perfectScrollbar();
          $('.main-panel, .perfectScroll').perfectScrollbar({ suppressScrollX: true });
        }else {
          $('body').css('overflow', 'hidden');
          $('.main-panel').css('overflow-y', 'auto');
          $('.perfectScroll').css('overflow-y', 'auto');
        }
      } else{
        $('.sidebar .collapse').collapse('hide').on('hidden.bs.collapse', function () {
          $(this).css('height', 'auto');
        });
        setTimeout(() => {
                     $('body').addClass('sidebar-mini');
                     $('.sidebar .collapse').css('height','auto');
                     md.misc.sidebar_mini_active = true;
                 }, 100);
        if (isWindows) {
          $('body').css('overflow', 'auto');
          $('.sidebar .sidebar-wrapper').perfectScrollbar('destroy');
          setTimeout(() => {
                       $('.main-panel, .perfectScroll').perfectScrollbar({suppressScrollX:true});
                       $('.main-panel, .perfectScroll').perfectScrollbar();
                     }, 500);
        }else {
          setTimeout(() => {
                     $('body').css('overflow','auto');
                     $('.main-panel').css('overflow','hidden');
                     $('.perfectScroll').css('overflow','hidden')
                     }, 200);
        }
      }

      // we simulate the window Resize so the charts will get updated in realtime.
      let simulateWindowResize = setInterval(() => {
                 window.dispatchEvent(new Event('resize'));
             }, 180);

      // we stop the simulation of Window Resize after the animations are completed
      setTimeout(() => {
                 clearInterval(simulateWindowResize);
             }, 1000);
    });
  },

  checkScrollForTransparentNavbar: debounce(() => {
    if ($(document).scrollTop() > 260) {
      if (transparent) {
        transparent = false;
        $('.navbar-color-on-scroll').removeClass('navbar-transparent');
      }
    } else if( !transparent ) {
                     transparent = true;
                     $('.navbar-color-on-scroll').addClass('navbar-transparent');
                 }
  }, 17),


  initRightMenu: debounce(() => {
    $sidebar_wrapper = $('.sidebar-wrapper');
    if (!mobile_menu_initialized) {
      $navbar = $('nav').find('.navbar-collapse').first().clone(true);
      nav_content = '';
      mobile_menu_content = '';

      $navbar.children('ul').each(function () {
        content_buff = $(this).html();
        nav_content += content_buff;
      });

      nav_content = `<ul class="nav nav-mobile-menu">${  nav_content  }</ul>`;

      $navbar_form = $('nav').find('.navbar-form').clone(true);

      $sidebar_nav = $sidebar_wrapper.find(' > .nav');

      // insert the navbar form before the sidebar list
      $nav_content = $(nav_content);
      $nav_content.insertBefore($sidebar_nav);
      $navbar_form.insertBefore($nav_content);

      $('.sidebar-wrapper .dropdown .dropdown-menu > li > a').click((event) => {
                   event.stopPropagation();
               });

      // simulate resize so all the charts/maps will be redrawn
      window.dispatchEvent(new Event('resize'));

      mobile_menu_initialized = true;

      $('.close-nav').click((event) => {
                   $('html').removeClass('nav-open');
                   $('.close-layer').remove();
                   setTimeout(function(){
                       if($toggle){
                         $toggle.removeClass('toggled');
                       }
                   }, 400);
                   mobile_menu_visible = 0;
               });
    } else if($(window).width() > 991){
                   // reset all the additions that we made for the sidebar wrapper only if the screen is bigger than 991px
                   $sidebar_wrapper.find('.navbar-form').remove();
                   $sidebar_wrapper.find('.nav-mobile-menu').remove();
                   $(".close-nav").off("click");

                   mobile_menu_initialized = false;
               }
    // join_school_events();
    $('.off-canvas-sidebar').remove();
    $logout = $('.logout');
    $logout.off('click');
    $logout.click(() => {
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
    $toggle.click(() => {

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


  initBootstrapNavbarMenu: debounce(() => {
    if (!bootstrap_nav_initialized) {
      $navbar = $('nav').find('.navbar-collapse').first().clone(true);

      nav_content = '';
      mobile_menu_content = '';

      // add the content from the regular header to the mobile menu
      $navbar.children('ul').each(function () {
        content_buff = $(this).html();
        nav_content += content_buff;
      });

      nav_content = `<ul class="nav nav-mobile-menu">${  nav_content  }</ul>`;

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
      $toggle.click(() => {
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
    // join_school_events();
  }, 800),

  startAnimationForLineChart(chart) {
    chart.on('draw', (data) => {
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
  startAnimationForBarChart(chart) {
    chart.on('draw', (data) => {
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
  },
};

