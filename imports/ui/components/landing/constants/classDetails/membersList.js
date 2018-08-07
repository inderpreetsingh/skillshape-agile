import uuidv4 from "uuid/v4";
const sampleStudent = "/images/school/boy.svg";
const sampleInstructor = "/images/classtype/default-reviewer.png";

export const membersList = [
  {
    id: uuidv4(),
    name: "Mr. Panda",
    type: "instructor",
    profileSrc: sampleInstructor
  },
  {
    id: uuidv4(),
    name: "Mr. Mantis",
    type: "assistant",
    profileSrc: sampleInstructor
  },
  {
    id: uuidv4(),
    name: "Benjamin",
    type: "student",
    profileSrc: sampleStudent,
    studentNotes:
      "Ben is a really good student who knows how to use his tools appropriately",
    paymentData: {
      paymentInfo: "expired"
    }
  },
  {
    id: uuidv4(),
    name: "Alexa",
    type: "student",
    profileSrc: sampleStudent,
    studentNotes:
      "Alexa is a really good student who knows how to use his tools appropriately",
    paymentData: {
      paymentInfo: "expired"
    }
  }
];
