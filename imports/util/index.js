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
export { withSubscriptionAndPagination } from '/imports/util/subscriptionAndPagination';
export { formStyles } from '/imports/util/formStyle';
export { createTable } from '/imports/util/createTable';
export { downloadingFunction } from '/imports/util/csvFileDownload';

export { withStyles } from "./withStyle";
export { material_ui_next_theme } from "./theme";
export { toastrModal } from "./toastrModal";
export { componentLoader } from "./loading";
export { dateFriendly } from './dateFriendly';