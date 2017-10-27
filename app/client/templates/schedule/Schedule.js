Template.Schedule.events({
  "click #event": function(event, template){

  }
});


Template.Schedule.rendered = function(){
  $calendar = $('#fullCalendar');

  today = new Date();
  y = today.getFullYear();
  m = today.getMonth();
  d = today.getDate();

  //  if (IsInstructor || IsStudent){
  //    header = {
  //       left: 'title',
  //       center: '',
  //       right: 'prev,next,today'
  //     }
  //  }else{
     header = {
        left: 'title',
        center: 'month,agendaWeek,agendaDay',
        right: 'prev,next,today'
      }
  //  }
  $calendar.fullCalendar({
      // aspectRatio: 1.605,
      viewRender: function(view, element) {
          // We make sure that we activate the perfect scrollbar when the view isn't on Month
          if (view.name != 'month'){
              $(element).find('.fc-scroller').perfectScrollbar();
            }
        },
      header:header,
      defaultDate: today,
      selectable: true,
      selectHelper: true,
      views: {
          month: { // name of view
              titleFormat: 'MMMM YYYY'
              // other view-specific options here
          },
          week: {
              titleFormat: " MMMM D YYYY"
          },
          day: {
              titleFormat: 'D MMM, YYYY'
          }
      },

select: function(start, end) {

          // on select we show the Sweet Alert modal with an input
  // swal({
  //     title: 'Create an Event',
  //     html: '<div class="form-group">' +
  //                     '<input class="form-control" placeholder="Event Title" id="input-field">' +
  //                 '</div>',
  //     showCancelButton: true,
  //             confirmButtonClass: 'btn btn-success',
  //             cancelButtonClass: 'btn btn-danger',
  //             buttonsStyling: false
  //         }).then(function(result) {
  //
  //             var eventData;
  //             event_title = $('#input-field').val();
  //
  //             if (event_title) {
  //       eventData = {
  //         title: event_title,
  //         start: start,
  //         end: end
  //       };
  //       $calendar.fullCalendar('renderEvent', eventData, true); // stick? = true
  //     }
  //
  //     $calendar.fullCalendar('unselect');
  //
  //         });
},
editable: true,
eventLimit: true, // allow "more" link when too many events


      // color classes: [ event-blue | event-azure | event-green | event-orange | event-red ]
      events: [
  {
    title: 'Parkour Jumping	 | Instructor-Doris Greene',
    start: new Date(y, m, 1),
    r_url :'/class_detail/1',
    className: 'event-default'
  },
  {
    id: 999,
    title: 'Basic Boxing | Instructor-Philip Chaney	',
    start: new Date(y, m, d-4, 6, 0),
    allDay: false,
    r_url :'/class_detail/1',
    className: 'event-rose'
  },
  {
    id: 999,
    title: 'Basic Boxing | Instructor-Philip Chaney',
    start: new Date(y, m, d+3, 6, 0),
    allDay: false,
    url :'/class_detail/1',
    className: 'event-rose'

  },
  {
    title: 'Capoeira Material Art	| Instructor-Minerva Hooper',
    start: new Date(y, m, d-1, 10, 30),
    allDay: false,
    r_url :'/class_detail/1',
    className: 'event-green'
  },
  {
    title: 'Lunch',
    start: new Date(y, m, d+7, 12, 0),
    end: new Date(y, m, d+7, 14, 0),
    allDay: false,
    r_url :'/class_detail/1',
    className: 'event-red'
  },
  {
    title: 'Basic Boxing | Instructor-Philip Chaney',
    start: new Date(y, m, d-2, 12, 0),
    allDay: true,
    r_url :'/class_detail/1',
    className: 'event-azure'
  },
  {
    title: 'Basic Boxing | Instructor-Philip Chaney',
    start: new Date(y, m, d+1, 19, 0),
    end: new Date(y, m, d+1, 22, 30),
    allDay: false,
    url :'/class_detail/1',
    className: 'event-azure'
  },
  {
    title: 'Capoeira Grappling | Instructor-Philip Chaney',
    start: new Date(y, m, 21),
    end: new Date(y, m, 22),
    r_url :'/class_detail/1',
    className: 'event-orange'
  },
  {
    title: 'Capoeira Striking | Instructor-Minerva Hooper',
    start: new Date(y, m, 24),
    end: new Date(y, m, 25),
    r_url :'/class_detail/1',
    className: 'event-orange'
  }
],
eventClick: function(event) {
        if (event.r_url) {
          if(IsInstructor() || IsStudent()){
            window.location.href = event.r_url;
            return false;
          }
        }
    }
});
}
