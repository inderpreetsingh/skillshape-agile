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
	seeMoreCount: 4,
	CAPTCHA_SITE_KEY: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI", //test key
})