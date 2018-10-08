export default (config = Object.freeze({
  // defaultSchoolImage: "http://img.freepik.com/free-icon/high-school_318-137014.jpg?size=338c&ext=jpg",
  defaultSchoolImage: "/images/new-logo.png",
  defaultSchoolLogo: "/images/new-logo.png",
  defaultProfilePic: '/images/Avatar-Unisex.png',
  defaultProfilePicOptimized:'/images/Avatar-Unisex-optimized.png',
  blurImage: '/images/blur.jpg',
  fromEmailForPurchasePackage: "Notices@SkillShape.com",
  fromEmailForJoiningClass: "Notices@SkillShape.com",
  skillshapeAdminEmail: "sam@skillshape.com",
  themeColor: {
    yellow: "#E9B942",
    green: "#9DC161",
    red: "#D84B47",
    gray: "#989797",
    blue: "#348CC0",
    black: "#292828",
    white: "#ffffff"
  },
  defaultLocation: [52.3702157, 4.8951],
  defaultLocationObject: {
    lat: 52.3702157,
    lng: 4.8951
  },
  // All collections needs to put here.
  collections: {
    modules: "Modules",
    skills: "Skills",
    reviews: "Reviews",
    skillCategory: "SkillCategory",
    skillSubject: "SkillSubject",
    classType: "ClassType",
    classPricing: "ClassPricing",
    monthlyPricing: "MonthlyPricing",
    media: "Media",
    school: "School",
    classes: "Classes",
    sLocation: "SLocation",
    classTimes: "ClassTimes",
    classInterest: "ClassInterest",
    importLogs: "ImportLogs",
    enrollmentFees: "EnrollmentFees",
    claimSchoolRequest: "ClaimSchoolRequest",
    classTimesRequest: "ClassTimesRequest",
    PriceInfoRequest: "PriceInfoRequest",
    pricingRequest: "PricingRequest",
    schoolMemberDetails: "SchoolMemberDetails",
    classTypeLocationRequest: "ClassTypeLocationRequest",
    PackageRequest: "PackageRequest",
    userStripeData: "UserStripeData",
    purchases: "Purchases",
    schoolSuggestion: "SchoolSuggestion",
    classSubscription: 'ClassSubscription',
  },
  gender: [
    { label: "Other", value: "Other" },
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" }
  ],
  genderForClassType: [
    { label: "All", value: "All" },
    { label: "Male Only", value: "Male Only" },
    { label: "Female Only", value: "Female Only" }
  ],
  experienceLevel: [
    { label: "All", value: "all" },
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" },
    {
      label: "Beginner plus intermediate",
      value: "beginner plus intermediate"
    },
    { label: "Intermediate plus advanced", value: "intermediate plus advanced" }
  ],
  defaultCurrency: "$",
  currency: [
    { label: "USD", value: "$" ,multiplyFactor: 100},
    { label: "INR", value: "₹" ,multiplyFactor: 100},
    { label: "EUR", value: "€" ,multiplyFactor: 100},
    { label: "GBP", value: "£" ,multiplyFactor: 100},
    { label: "CAD", value: "C$",multiplyFactor: 100},
    { label: "AUD", value: "A$",multiplyFactor: 100},
    { label: "JPY", value: "¥" ,multiplyFactor: 1},
    { label: "KRW", value: "₩" ,multiplyFactor: 100},
    { label: "BRL", value: "R$" ,multiplyFactor: 100},

  ],
  duration: [
    { label: "Minutes", value: "Minutes" },
    { label: "Hours", value: "Hours" }
  ],
  // Show only 4 classes initially to Users. This count will increase when user clicks on see more on dash route.
  seeMoreCount: 4,
  // CAPTCHA_SITE_KEY: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI", //test key
  CAPTCHA_SITE_KEY:
    process.env.NODE_ENV == "development"
      ? "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
      : "6LeRJE8UAAAAAEtZBraHTNfUe3VD8k5QgJ0oM1J3", // production key

  MAP_KEY: "AIzaSyAUzsZloT4lEquePIL_uReXGwMYGqyL0NE",
  // Need to show these default classes to `Users` if no class type data found for User's current location.
  defaultClassType: [
    { skillType: "Judo", location: "Toyko" },
    { skillType: "Surfing", location: "Hawail" },
    { skillType: "Brazilian Jujitsu", location: "Rio De Janiero" },
    { skillType: "Cooking", location: "Sicily" },
    { skillType: "Acting", location: "London" },
    { skillType: "Painting", location: "Paris" },
    { skillType: "Yoga", location: "Delhi" }
  ],
  pathNameNotSupportFloatingIcon: [
    "/embed/schools/sammys-aloha-watersports/pricing",
    "/embed/schools/sammys-aloha-watersports/classtype",
    "/embed/schools/sammys-aloha-watersports/mediagallery",
    "/embed/schools/sammys-aloha-watersports/mediaslider",
    "/embed/schools/sammys-aloha-watersports/calendar",
    "/contact-us"
  ]
}));

