import { check } from 'meteor/check';
import {
  get, isEmpty, concat, uniq, difference, isArray,
} from 'lodash';
import ClassPricing from './fields';
import ClassType from '/imports/api/classType/fields';
import PricingRequest from '/imports/api/pricingRequest/fields';
import School from '/imports/api/school/fields';
import { sendEmailToStudentForPriceInfoUpdate } from '/imports/api/email';
import MonthlyPricing from '/imports/api/monthlyPricing/fields';

Meteor.methods({
  'classPricing.addClassPricing': ({ doc }) => {
    const user = Meteor.users.findOne(this.userId);
    if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: 'classPricing_CUD' })) {
      if (doc.classTypeId && isArray(doc.classTypeId)) {
        ClassType.update(
          { _id: { $in: doc.classTypeId } },
          { $set: { 'filters.classPriceCost': doc.cost } },
          { multi: true },
        );
      }

      return ClassPricing.insert(doc);
    }
    throw new Meteor.Error('Permission denied!!');
  },
  'classPricing.editclassPricing': ({ doc_id, doc }) => {
    const user = Meteor.users.findOne(this.userId);

    if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: 'classPricing_CUD' })) {
      const classPriceData = ClassPricing.findOne({ _id: doc_id });
      const diff = difference(classPriceData.classTypeId, doc.classTypeId);

      if (classPriceData.cost !== doc.cost || (diff && diff.length > 0)) {
        if (diff && diff.length > 0) {
          ClassType.update(
            { _id: { $in: diff } },
            { $set: { 'filters.classPriceCost': null } },
            { multi: true },
          );
        }

        if (doc.classTypeId && isArray(doc.classTypeId) && doc.classTypeId.length > 0) {
          ClassType.update(
            { _id: { $in: doc.classTypeId } },
            { $set: { 'filters.classPriceCost': doc.cost } },
            { multi: true },
          );
        }
      }

      return ClassPricing.update({ _id: doc_id }, { $set: doc });
    }
    throw new Meteor.Error('Permission denied!!');
  },
  'classPricing.removeClassPricing': ({ doc }) => {
    check(doc, Object);

    const user = Meteor.users.findOne(this.userId);

    if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: 'classPricing_CUD' })) {
      if (doc.classTypeId && isArray(doc.classTypeId)) {
        ClassType.update(
          { _id: { $in: doc.classTypeId } },
          { $set: { 'filters.classPriceCost': null } },
          { multi: true },
        );
      }

      return ClassPricing.remove({ _id: doc._id });
    }
    throw new Meteor.Error('Permission denied!!');
  },
  'classPricing.notifyStudentForPricingUpdate': ({ schoolId }) => {
    check(schoolId, String);

    if (this.userId) {
      const PricingRequestData = PricingRequest.find({ schoolId, notification: true }).fetch();
      if (!isEmpty(PricingRequestData)) {
        PricingRequestData.forEach((obj) => {
          const userData = Meteor.users.findOne({ _id: obj.userId });
          const schoolData = School.findOne({ _id: obj.schoolId });
          if (userData && schoolData) {
            PricingRequest.update({ _id: obj._id }, { $set: { notification: false } });
            sendEmailToStudentForPriceInfoUpdate(userData, schoolData);
          }
        });
        return { emailSent: true };
      }
      return { emailSent: false };
    }
    throw new Meteor.Error('Permission denied!!');
  },
  'classPricing.handleClassTypes': ({ classTypeId, selectedIds, diselectedIds }) => {
    check(classTypeId, String);
    check(selectedIds, [String]);
    check(diselectedIds, [String]);
    ClassPricing.update({ classTypeId: null }, { $set: { classTypeId: [] } });
    try {
      if (!isEmpty(diselectedIds)) {
        ClassPricing.update(
          { _id: { $in: diselectedIds } },
          { $pull: { classTypeId } },
          { multi: true },
        );
      }
      if (!isEmpty(selectedIds)) {
        ClassPricing.update(
          { _id: { $in: selectedIds } },
          { $push: { classTypeId } },
          { multi: true },
        );
      }
      return true;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },
  'classPricing.getCover': (_id) => {
    check(_id, String);
    const record = ClassPricing.findOne({ _id });
    return get(record, 'selectedClassType', []);
  },
  'classPricing.signInHandler': (filter = {}) => {
    check(filter, Object);
    try {
      let records = [];
      let packageIds = [];
      let classTypeData = {};
      let enrollmentIds = [];
      let purchasedEP = [];
      let epStatus = false;
      classTypeData = ClassType.findOne({ _id: filter.classTypeId });
      enrollmentIds = get(classTypeData, 'enrollmentIds', []);
      if (!isEmpty(enrollmentIds)) {
        purchasedEP = Meteor.call(
          'purchases.getPurchasedFromPackageIds',
          enrollmentIds,
          filter.userId ? filter.userId : this.userId,
        );
        if (!isEmpty(purchasedEP)) {
          epStatus = true;
        } else {
          epStatus = false;
        }
      } else {
        epStatus = true;
      }
      records = ClassPricing.find({ classTypeId: filter.classTypeId }).fetch();
      packageIds = records.map(obj => obj._id);
      records = MonthlyPricing.find({ classTypeId: filter.classTypeId }).fetch();
      packageIds = concat(records.map(obj => obj._id), packageIds);
      records = Meteor.call('purchases.getPackagesFromIds', packageIds, filter.userId);
      const noPackageRequired = isEmpty(packageIds);
      return {
        epStatus, purchased: records, purchasedEP, noPackageRequired,
      };
    } catch (error) {
      console.log('​classPricing.signInHandler}catch -> error', error);
      throw new Meteor.Error(error);
    }
  },
  'classPricing.getCoverForPurchases': (purchaseData) => {
    check(purchaseData, Array);
    Promise((resolve, reject) => {
      try {
        let packageType;
        let purchaseDataWithCovers = [];
        if (!isEmpty(purchaseData)) {
          purchaseDataWithCovers = purchaseData.map((objCopy) => {
            const obj = Object.assign(objCopy);
            let methodName;
            const covers = [];
            packageType = get(obj, 'packageType', 'MP');
            const packageId = get(obj, 'packageId', '');
            if (packageType === 'MP') {
              methodName = 'monthlyPricing.getCover';
            } else if (packageType === 'CP') {
              methodName = 'classPricing.getCover';
            } else {
              methodName = 'enrollmentFee.getCover';
            }
            const res = Meteor.call(methodName, packageId);
            if (res) {
              res.forEach((obj1) => {
                covers.push(obj1.name);
              });
              obj.covers = uniq(covers);
            }
            return obj;
          });
        }
        resolve(purchaseDataWithCovers);
      } catch (error) {
        reject();
      }
    });
  },
});
