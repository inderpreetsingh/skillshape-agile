import {
  concat, difference, flatten, get, isEmpty,
} from 'lodash';
import { check } from 'meteor/check';
import EnrollmentFees from './fields';
import ClassPricing from '/imports/api/classPricing/fields';
import MonthlyPricing from '/imports/api/monthlyPricing/fields';

Meteor.methods({
  'enrollmentFee.addEnrollmentFee': function ({ doc }) {
    check(doc, Object);
    const user = Meteor.users.findOne(this.userId);
    if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: 'enrollmentFee_CUD' })) {
      const id = EnrollmentFees.insert(doc);
      const classTypeIds = get(doc, 'classTypeId', []);
      if (!isEmpty(classTypeIds)) {
        Meteor.call('classType.handleEnrollmentIds', id, classTypeIds, 'add');
      }
      return true;
    }
    throw new Meteor.Error('Permission denied!!');
  },
  'enrollmentFee.editEnrollmentFee': function ({ doc_id, doc }) {
    check(doc, Object);
    check(doc_id, String);
    const user = Meteor.users.findOne(this.userId);
    const record = EnrollmentFees.findOne({ _id: doc_id });
    const oldClassTypeIds = get(record, 'classTypeId', []);
    const classTypeIds = get(doc, 'classTypeId', []);
    const removeClassTypeIds = difference(oldClassTypeIds, classTypeIds);
    if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: 'enrollmentFee_CUD' })) {
      if (!isEmpty(removeClassTypeIds)) {
        Meteor.call('classType.handleEnrollmentIds', doc_id, removeClassTypeIds, 'remove');
      }
      if (!isEmpty(classTypeIds)) {
        Meteor.call('classType.handleEnrollmentIds', doc_id, classTypeIds, 'add');
      }
      return EnrollmentFees.update({ _id: doc_id }, { $set: doc });
    }
    throw new Meteor.Error('Permission denied!!');
  },
  'enrollmentFee.removeEnrollmentFee': function ({ doc }) {
    check(doc, Object);
    const classTypeId = get(doc, 'classTypeId', []);
    const id = get(doc, '_id', '');
    if (!isEmpty(classTypeId)) Meteor.call('classType.handleEnrollmentIds', id, classTypeId, 'remove');
    const user = Meteor.users.findOne(this.userId);
    if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: 'enrollmentFee_CUD' })) {
      return EnrollmentFees.remove({ _id: doc._id });
    }
    throw new Meteor.Error('Permission denied!!');
  },
  'enrollmentFee.handleClassTypes': function ({ classTypeId, selectedIds, diselectedIds }) {
    check(classTypeId, String);
    check(selectedIds, [String]);
    check(diselectedIds, [String]);
    EnrollmentFees.update({ classTypeId: null }, { $set: { classTypeId: [] } });
    try {
      // if (!isEmpty(diselectedIds)) {
      //     let result = EnrollmentFees.update({ _id: { $in: diselectedIds } }, { $pull: { classTypeId } }, { multi: true })
      // }
      // if (!isEmpty(selectedIds)) {
      //     let result = EnrollmentFees.update({ _id: { $in: selectedIds } }, { $push: { classTypeId } }, { multi: true })

      // }
      return true;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },
  'enrollmentFee.getCover': function (_id) {
    const record = EnrollmentFees.findOne({ _id });
    return get(record, 'selectedClassType', []);
  },
  'enrollment.checkIsEnrollmentPurchased': function (_id, userId, packageType) {
    let currentPackage = {};
    const enrollmentPackage = {};
    const enrollmentIds = [];
    let classTypeIds = [];
    let classTypeData;
    let classTypeDataWithPurchaseInfo;
    if (packageType == 'CP') {
      currentPackage = ClassPricing.findOne({ _id }, { fields: { classTypeId: 1 } });
    } else {
      currentPackage = MonthlyPricing.findOne({ _id }, { fields: { classTypeId: 1 } });
    }
    classTypeIds = get(currentPackage, 'classTypeId', []);
    if (!isEmpty(classTypeIds)) {
      classTypeData = Meteor.call('classType.getClassTypesFromIds', classTypeIds);
      if (!isEmpty(classTypeData)) {
        classTypeDataWithPurchaseInfo = classTypeData.map((obj) => {
          const enrollmentIds = get(obj, 'enrollmentIds', []);
          if (!isEmpty(enrollmentIds)) {
            obj.enrollmentPackages = EnrollmentFees.find({ _id: { $in: enrollmentIds } }).fetch();
            obj.purchasedEP = Meteor.call(
              'purchases.getPurchasedFromPackageIds',
              enrollmentIds,
              userId,
            );
          } else {
            obj.noEP = true;
          }
          return obj;
        });
      }
    }
    return classTypeDataWithPurchaseInfo;
  },
  'enrollment.checkPackagesFromClassTypeAndSchoolId': function ({ classTypeId, schoolId }) {
    if (classTypeId) {
      let packages = [];
      let classPackages;
      let monthlyPackages;
      let packageIds;
      let purchasedPackages;
      classPackages = ClassPricing.find({ classTypeId }).fetch();
      monthlyPackages = MonthlyPricing.find({ classTypeId }).fetch();
      packages = flatten(concat(classPackages, monthlyPackages));
      packageIds = packages.map(obj => obj._id);
      purchasedPackages = Meteor.call('purchases.getPackagesFromIds', packageIds, null, null);
      return purchasedPackages;
    } if (schoolId) {
      return (purchasedPackages = Meteor.call('purchases.getPackagesFromIds', [], null, schoolId));
    }
  },
});
