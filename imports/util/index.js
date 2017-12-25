"use strict";

/**
 * @module util
 **/

export { emailRegex, imageRegex } from '/imports/util/regExp';
export { InfiniteScroll } from '/imports/util/infiniteScroll';
export {
	checkDemoUser,
	checkSuperAdmin,
} from '/imports/util/checkUserType';
export { validateImage } from '/imports/util/getUserData';
export { initializeMap, setMarkersOnMap, reCenterMap } from '/imports/util/initializeMap';
export { cutString } from '/imports/util/cutString';
export { withSubscriptionAndPagination } from '/imports/util/subscriptionAndPagination';
export { formStyles } from '/imports/util/formStyle';
export { createTable } from '/imports/util/createTable';
export { downloadingFunction } from '/imports/util/csvFileDownload';

export { withStyles } from "./withStyle";