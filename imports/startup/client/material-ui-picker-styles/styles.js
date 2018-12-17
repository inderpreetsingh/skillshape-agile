import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

export default {

  MuiPickersModal: {
    dialog: {
      fontFamily: helpers.commonFont
    }
  },
  MuiPickersToolbar: {
    toolbar: {
      backgroundColor: helpers.primaryColor
    },
  },
  MuiPickersToolbarButton: {
    toolbarBtn: {
      fontSize: helpers.baseFontSize * 1.5
    }
  },
  MuiPickersClockPointer: {
    pointer: {
      backgroundColor: helpers.primaryColor,
    },
    thumb: {
      border: `14px solid ${helpers.primaryColor}`
    }
  },
  MuiPickersClockNumber: {
    selected: {
      backgroundColor: helpers.primaryColor
    }
  },
  MuiPickersTimePicker: {
    hourMinuteLabel: {
      fontSize: helpers.baseFontSize * 1.5,
    }
  },
  MuiPickersCalendar: {
    day: {
      backgroundColor: helpers.primaryColor
    },
    selected: {
      backgroundColor: helpers.primaryColor
    },
    week: {
      ['[class*="Day-"]']: {
        backgroundColor: helpers.primaryColor
      }
    }
  },
}
