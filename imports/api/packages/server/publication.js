import { check } from 'meteor/check';

import EnrollmentFees from "/imports/api/enrollmentFee/fields";
import ClassPricing from "/imports/api/classPricing/fields";
import MonthlyPricing from '/imports/api/monthlyPricing/fields';

const getPackagesIdsByType = (packagsData, type) => {
    return packagsData.filter(data => data.packageType === type).map(data => data.packageId);
}

Meteor.publish('packages.findPackagesByData', function (packagesData) {
    // console.log(packagesData, "PACKAGES DATA>........");
    if (!this.userId) {
        throw new Meteor.Error('Permission Denied! You needs to be logged in, to access this data');
    }

    const cpPackagesIds = getPackagesIdsByType(packagesData, 'CP');
    const mpPackagesIds = getPackagesIdsByType(packagesData, 'MP');
    const epPackagesIds = getPackagesIdsByType(packagesData, 'EP');
    const mpDataCursor = MonthlyPricing.find({});
    const cpDataCursor = ClassPricing.find({});
    // console.log(cpPackagesIds, mpPackagesIds, mpDataCursor.fetch(), cpDataCursor.fetch())
    return [
        ClassPricing.publishJoinedCursors(cpDataCursor, { reactive: true }, this),
        MonthlyPricing.publishJoinedCursors(mpDataCursor, { reactive: true }, this),
        EnrollmentFees.find({ _id: { $in: epPackagesIds } })
    ]
})