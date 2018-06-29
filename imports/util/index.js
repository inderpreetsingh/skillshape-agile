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
export { formatTime, formatAmPm, formatDate, formatDateNoYear, formatDataBasedOnScheduleType, formatClassTimesData, isScheduleEmpty} from '/imports/util/formatSchedule.js';
export { getAverageNoOfRatings } from '/imports/util/averageRatings';
export { capitalizeString, addDelimiter } from '/imports/util/stringOperations';
export { withSubscriptionAndPagination } from '/imports/util/subscriptionAndPagination';
export { formStyles } from '/imports/util/formStyle';
export { createTable } from '/imports/util/createTable';
export { downloadingFunction } from '/imports/util/csvFileDownload';
export { imageExists } from '/imports/util/imageExists';
export { lightenDarkenColor } from '/imports/util/colors.js';
export { getContainerMaxWidth } from '/imports/util/cards.js';
export { handleOutBoundLink } from '/imports/util/handleAnalytics.js';

export { withStyles } from "./withStyle";
export { material_ui_next_theme } from "./theme";
export { toastrModal } from "./toastrModal";
export { componentLoader } from "./loading";
export { dateFriendly } from './dateFriendly';
export { openMailToInNewTab } from './openInNewTabHelpers';
export { goToSchoolPage, goToClassTypePage, checkForAddToCalender } from './handleRedirect.js';
