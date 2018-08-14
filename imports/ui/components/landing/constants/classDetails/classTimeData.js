import uuidv4 from "uuid/v4";

export const classTimeData = {
  id: uuidv4(),
  name: "my class time ",
  classTypeName: "my class type",
  schoolName: "my school name",
  description:
    "This class time is done under mr sudhir, who is taking this class at a particular time for over 4 years as of now",
  startDate: new Date("2018-08-13"),
  startTime: new Date("2018-08-13 23:45:00"),
  totalEventTime: 60,
  time: "11:40",
  timePeriod: "pm",
  address: "Appollo Bandar, Colaba, Mumbai, 400001",
  locationData: {
    lat: -34,
    lng: 89.234
  }
};
