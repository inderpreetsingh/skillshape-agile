export default config = Object.freeze({
	// defaultSchoolImage: "http://img.freepik.com/free-icon/high-school_318-137014.jpg?size=338c&ext=jpg",
	defaultSchoolImage: "/images/new-logo.png",
	defaultSchoolLogo: "/images/new-logo.png",
	fromEmailForPurchasePackage: "Notices@SkillShape.com",
	fromEmailForJoiningClass: "Notices@SkillShape.com",
	themeColor: {
		yellow: '#E9B942',
		green: '#9DC161',
		red: '#D84B47',
		gray: '#989797',
		blue: '#348CC0',
		black: '#292828',
		white: '#ffffff',
	},
	defaultLocation: [52.3702157, 4.8951],
	// All collections needs to put here.
	collections: {
		modules : "Modules",
		skills : "Skills",
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
		schoolMemberDetails: "SchoolMemberDetails"
	},
	gender : [
		{ label: "Any", value: "Any"},
		{ label: "Male", value: "Male"},
		{ label: "Female", value: "Female"},
	],
	experienceLevel : [
		{ label: "All", value: "all"},
		{ label: "Beginner", value: "beginner"},
		{ label: "Intermediate", value: "intermediate"},
		{ label: "Advanced", value: "advanced"},
		{ label: "Beginner plus intermediate", value: "beginner plus intermediate"},
		{ label: "Intermediate plus advanced", value: "intermediate plus advanced"},
	],
	currency: [
		{ label: "USD", value: "$"},
		{ label: "INR", value: "₹"},
		{ label: "EUR", value: "€"},
	],
	// Show only 4 classes initially to Users. This count will increase when user clicks on see more on dash route.
	seeMoreCount: 4,
	CAPTCHA_SITE_KEY: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI", //test key
	// Need to show these default classes to `Users` if no class type data found for User's current location.
	defaultClassType: [
		{ skillType: "Judo", location: "Toyko"},
		{ skillType: "Surfing", location: "Hawail"},
		{ skillType: "Brazilian Jujitsu", location: "Rio De Janiero"},
		{ skillType: "Cooking", location: "Sicily"},
		{ skillType: "Acting", location: "London"},
		{ skillType: "Painting", location: "Paris"},
		{ skillType: "Yoga", location: "Delhi"},
	]
})