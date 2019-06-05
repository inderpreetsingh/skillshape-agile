import '/imports/startup/client';

if (Meteor.isClient) {
  $toggle = null;
  // toastr.options = {
  //     "closeButton": false,
  //     "debug": false,
  //     "newestOnTop": false,
  //     "progressBar": false,
  //     "positionClass": "toast-top-center",
  //     "preventDuplicates": false,
  //     "onclick": null,
  //     "showDuration": "300",
  //     "hideDuration": "1000",
  //     "timeOut": "5000",
  //     "extendedTimeOut": "1000",
  //     "showEasing": "swing",
  //     "hideEasing": "linear",
  //     "showMethod": "fadeIn",
  //     "hideMethod": "fadeOut"
  // }
  Tracker.autorun(() => {
    Meteor.subscribe('roles');
    Meteor.subscribe('tags');
  });

  Tracker.autorun(() => {
  });
  $.fn.extend({
    animateCss(animationName) {
      const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
      this.addClass(`animated ${  animationName}`).one(animationEnd, function () {
        $(this).removeClass(`animated ${  animationName}`);
      });
    },
  });
  getUID = function () {
    return Math.random()
      .toString(36)
      .substr(2, 16);
  };
  encodeData = function (data) {
    return Object.keys(data)
      .map(key => [key, data[key]].map(encodeURIComponent).join('='))
      .join('&');
  };
  clean = function (obj) {
    const new_object = {};
    Object.keys(obj).forEach((key) => {
      if (
        typeof obj[key] !== 'undefined'
        && obj[key] != null
        && obj[key] != ''
      ) {
        new_object[key] = obj[key];
      }
    });
    return new_object;
  };
  validateString = function (value) {
    if (typeof value !== 'undefined' && value) {
      return value;
    }
    return '';
  };
  cutstring = function (name, len) {
    if (!name) return name;

    if (!len) len = 200;

    let cutstr;
    if (name.length > len) {
      cutstr = name.substr(0, len - 3);
      cutstr += '...';
    } else cutstr = name.substr(0, len);

    return cutstr;
  };

  setModalMaxHeight = function (element) {
    this.$element = $(element);
    this.$content = this.$element.find('.modal-content');
    const borderWidth = this.$content.outerHeight() - this.$content.innerHeight();
    const dialogMargin = $(window).width() < 768 ? 20 : 60;
    const contentHeight = $(window).height() - (dialogMargin + borderWidth);
    const headerHeight = this.$element.find('.modal-header').outerHeight() || 0;
    const footerHeight = this.$element.find('.modal-footer').outerHeight() || 0;
    const maxHeight = contentHeight - (headerHeight + footerHeight);

    this.$content.css({
      overflow: 'hidden',
    });

    this.$element.find('.modal-body').css({
      'max-height': maxHeight,
      'overflow-y': 'auto',
    });
  };

  $('.modal').on('show.bs.modal', function () {
    $(this).show();
    setModalMaxHeight(this);
  });

  $(window).resize(() => {
    if ($('.modal.in').length != 0) {
      setModalMaxHeight($('.modal.in'));
    }
  });
}

url_validate = function (url) {
  let url_regx = new RegExp(
    /(http(s)?:\\)?([\w-]+\.)+[\w-]+[.com|.in|.org]+(\[\?%&=]*)?/,
  );
  if (url_regx.test(url)) {
    if (url.includes('http://') || url.includes('https://')) {
      return url;
    }
    return 'http://' + url;
  }
  return false;
};
getLatLong = function (address, callback) {
  // address = address.replace(" ","+")
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${
    address
  }&key=AIzaSyBtQoiRR6Ft0wGTajMd8uTZb71h8kwD5Ew`;
  let_long = null;
  $.ajax({
    type: 'GET',
    async: 'false',
    url,
    dataType: 'json', // added this so the response is in json
    success(data) {
      if (
        data.results[0]
        && data.results[0].geometry
        && data.results[0].geometry.location
      ) {
        let_long = data.results[0].geometry.location;
        let_long.formatted_address = data.results[0].formatted_address;
      }
      callback(let_long);
    },
    error(XMLHttpRequest, textStatus, errorThrown) {
      callback(null);
    },
  });
};

// Template.registerHelper('ValidateImage', function(image) {
//     var user = Meteor.user()
//     if (image && image.length > 1) {
//         return image;
//     } else {
//         return "/images/profile.png";
//     }
// });
// Template.registerHelper('cutString', function(str) {
//     return cutstring(str, 30);
// });
// Template.registerHelper('cutStringBySize', function(str, num) {
//     return cutstring(str, num);
// });

// Template.registerHelper('SchoolImageValidate', function(image) {
//     var user = Meteor.user()
//     if (image && image.length > 1) {
//         return image;
//     } else {
//         return "http://img.freepik.com/free-icon/high-school_318-137014.jpg?size=338c&ext=jpg";
//     }
// });

// Template.registerHelper('IsInstructor', function() {
//     var user = Meteor.user()
//     if (user) {
//         return Roles.userIsInRole(Meteor.userId(), "Instructor") || Roles.userIsInRole(Meteor.userId(), "Admin") || Roles.userIsInRole(Meteor.userId(), "Superadmin")
//     } else {
//         return false;
//     }
// });
// Template.registerHelper('IsSuperadmin', function() {
//     var user = Meteor.user()
//     if (user) {
//         return Roles.userIsInRole(Meteor.userId(), "Superadmin") || Roles.userIsInRole(Meteor.userId(), "Admin")
//     } else {
//         return false;
//     }
// });
// Template.registerHelper('IsOnlySuperadmin', function() {
//     var user = Meteor.user()
//     if (user) {
//         return Roles.userIsInRole(Meteor.userId(), "Superadmin")
//     } else {
//         return false;
//     }
// });

// Template.registerHelper('IsAdmin', function() {
//     var user = Meteor.user()
//     if (user) {
//         return Roles.userIsInRole(Meteor.userId(), "Admin") || Roles.userIsInRole(Meteor.userId(), "Superadmin")
//     } else {
//         return false;
//     }
// });
// Template.registerHelper('IsDemoUser', function() {
//     var user = Meteor.user()
//     if (user) {
//         if (user.profile && user.profile.is_demo_user && user.profile.is_demo_user == true) {
//             return true;
//         } else {
//             return false;
//         }
//     } else {
//         return false;
//     }
// });
// Template.registerHelper('IsStaff', function() {
//     var user = Meteor.user()
//     if (user) {
//         return Roles.userIsInRole(Meteor.userId(), "Staff")
//     } else {
//         return false;
//     }
// });

// Template.registerHelper('IsStudent', function() {
//     var user = Meteor.user()
//     if (user) {
//         return Roles.userIsInRole(Meteor.userId(), "Student")
//     } else {
//         return false;
//     }
// });
IsDemoUser = function () {
  let user = Meteor.user();
  if (user) {
    if (
      user.profile
      && user.profile.is_demo_user
      && user.profile.is_demo_user == true
    ) {
      return true;
    }
    return false;
  }
  return false;
};
IsStudent = function () {
  const user = Meteor.user();
  if (user) {
    return Roles.userIsInRole(Meteor.userId(), 'Student');
  }
  return false;
};
IsInstructor = function () {
  const user = Meteor.user();
  if (user) {
    return (
      Roles.userIsInRole(Meteor.userId(), 'Instructor')
      || Roles.userIsInRole(Meteor.userId(), 'Admin')
      || Roles.userIsInRole(Meteor.userId(), 'Superadmin')
    );
  }
  return false;
};
// Template.registerHelper('and', function(a, b) {
//     return a && b;
// });
// Template.registerHelper('or', function(a, b) {
//     return a || b;
// });
// Template.registerHelper('or_check', function(a, b, c) {
//     return a || b || c;
// });
