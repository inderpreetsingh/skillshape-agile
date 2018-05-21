import moment from 'moment';

export const formatTime = (startTime) => {
  if(startTime) {
    return moment(startTime.props || startTime).format("hh:mm");
  }
}

// This method will work without props..
export const formatAmPm = (startTime) => {
  if(startTime) {
    let hours = startTime.props ? startTime.props.getHours() : startTime.getHours();
    let ampm = hours >= 12 ? 'pm' : 'am';
    return `${ampm}`
  }
}


export const formatDate = (date) => {
  // console.info(date, moment(date).format('DD-MM-YYYY'), ";;;;;;;;;;");
  return moment(date).format('MMMM DD, YYYY');
}

export const formatDateNoYear = (date) => {
  return moment(date).format('MMMM DD');
}
