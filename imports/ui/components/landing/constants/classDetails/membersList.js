import uuidv4 from "uuid/v4";
const sampleStudent = "/images/class-details/benjamin.png";
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
    name: "Alex",
    type: "student",
    profileSrc: sampleStudent,
    studentNotes:
      "Alex is a really good student who knows how to use his tools appropriately",
    paymentData: {
      paymentInfo: "expired"
    }
  }
];
