import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

export default {
  MuiPickersClockPointer : {
    pointer : {
      backgroundColor: helpers.primaryColor,
    },
    thumb: {
      border: `${helpers.rhythmDiv * 2}px solid ${helpers.primaryColor}`
    }
  },
  MuiPickersClockNumber : {
    selected: {
      backgroundColor: helpers.primaryColor
    }
  },
}
