"use strict";

/**
 * @module util
 **/

export { emailRegex, imageRegex, phoneRegex } from '/imports/util/regExp';
export { InfiniteScroll } from '/imports/util/infiniteScroll';
export {
	checkDemoUser,
	checkSuperAdmin,
} from '/imports/util/checkUserType';
export { validateImage, getUserFullName } from '/imports/util/getUserData';
export { initializeMap, setMarkersOnMap, reCenterMap, initializeSchoolEditLocationMap, createMarkersOnMap } from '/imports/util/initializeMap';
export { cutString } from '/imports/util/cutString';
export { formatTime, formatAmPm, formatDate, formatDateNoYear, formatDataBasedOnScheduleType, formatClassTimesData} from '/imports/util/formatSchedule.js';
export { getAverageNoOfRatings } from '/imports/util/averageRatings';
export { capitalizeString, addDelimiter } from '/imports/util/stringOperations';
export { formStyles } from '/imports/util/formStyle';
export { createTable } from '/imports/util/createTable';
export { downloadingFunction } from '/imports/util/csvFileDownload';
export { imageExists } from '/imports/util/imageExists';
export { lightenDarkenColor } from '/imports/util/colors.js';
export { getContainerMaxWidth } from '/imports/util/cards.js';
export { handleOutBoundLink } from '/imports/util/handleAnalytics.js';
export { toastrModal } from "/imports/util/toastrModal.js";
export { withPopUp } from "/imports/util/withPopUp.js";
export { default as withMovingMarker } from "/imports/util/withMovingMarker.js";
export { withSubscriptionAndPagination } from '/imports/util/subscriptionAndPagination';

export { withStyles } from "./withStyle";
export { material_ui_next_theme } from "./theme";
export { componentLoader } from "./loading";
export { dateFriendly } from './dateFriendly';
export { openMailToInNewTab } from './openInNewTabHelpers';
export { goToSchoolPage, goToClassTypePage, checkForAddToCalender } from './handleRedirect.js';
export {maximumClasses} from './maximumClasses.js'