import {
  compact, get, isEmpty, uniq,
} from 'lodash';
import { check } from 'meteor/check';
import { isArray } from 'util';
import Transactions from './fields';
import Purchases from '/imports/api/purchases/fields';
import SchoolMemberDetails from '/imports/api/schoolMemberDetails/fields';

Meteor.methods({
  'transactions.handleEntry': function (data) {
    check(data, Object);
    if (data.action == 'add') {
      Transactions.insert(data);
    } else {
      Transactions.remove({ _id: data._id });
    }
  },
  'transactions.getFilteredPurchases': function (filter, limitAndSkip) {
    try {
      let count;
      let transactionData;
      let graphData;
      const { schoolId } = filter;
      delete filter.schoolId;
      if (schoolId && isArray(schoolId) && !isEmpty(schoolId)) {
        count = Transactions.find({ schoolId: { $in: schoolId }, ...filter }).count();
        transactionData = Transactions.find(
          { schoolId: { $in: schoolId }, ...filter },
          limitAndSkip,
        ).fetch();
        graphData = Meteor.call('transactions.getDataForGraph', { schoolId });
      } else {
        count = Transactions.find(filter).count();
        transactionData = Transactions.find(filter, limitAndSkip).fetch();
      }
      let packageType;
      const covers = [];
      let methodName;
      let data;
      const finalData = [];
      if (!isEmpty(transactionData)) {
        transactionData = compact(transactionData);
        transactionData.map((obj) => {
          const wholePurchaseData = Purchases.findOne({ _id: obj.purchaseId });
          const { packageId } = wholePurchaseData || {};
          packageType = get(obj, 'packageType', 'MP');
          if (packageType == 'MP') {
            methodName = 'monthlyPricing.getCover';
          } else if (packageType == 'CP') {
            methodName = 'classPricing.getCover';
          } else {
            methodName = 'enrollmentFee.getCover';
          }
          if (packageId) {
            res = Meteor.call(methodName, packageId);
            if (res) {
              res.map((obj1, index1) => {
                covers.push(obj1.name);
              });
              obj.covers = uniq(covers);
            }
          }
          data = { ...obj, ...wholePurchaseData };
          finalData.push(data);
        });
      }
      const response = { count, records: finalData, graphData };
      return response;
    } catch (error) {
      console.log('​ error in transactions.getFilteredPurchases', error);
    }
  },
  'transactions.getDataForGraph': function (filter) {
    try {
      const { schoolId } = filter;
      const Purchases = Transactions.aggregate(
        [
          { $match: { schoolId: { $in: schoolId } } },
          { $match: { transactionType: 'purchase' } },
          {
            $group: {
              _id: { month: { $month: '$transactionDate' }, year: { $year: '$transactionDate' } },
              count: { $sum: 1 },
            },
          },
        ],
        { cursor: {} },
      ).toArray();
      const Attendance = Transactions.aggregate(
        [
          { $match: { schoolId: { $in: schoolId } } },
          { $match: { transactionType: 'attendance' } },
          {
            $group: {
              _id: { month: { $month: '$transactionDate' }, year: { $year: '$transactionDate' } },
              count: { $sum: 1 },
            },
          },
        ],
        { cursor: {} },
      ).toArray();
      const Expired = Transactions.aggregate(
        [
          { $match: { schoolId: { $in: schoolId } } },
          { $match: { transactionType: 'expired' } },
          {
            $group: {
              _id: { month: { $month: '$transactionDate' }, year: { $year: '$transactionDate' } },
              count: { $sum: 1 },
            },
          },
        ],
        { cursor: {} },
      ).toArray();
      const Cancelled = Transactions.aggregate(
        [
          { $match: { schoolId: { $in: schoolId } } },
          { $match: { transactionType: 'contractCancelled' } },
          {
            $group: {
              _id: { month: { $month: '$transactionDate' }, year: { $year: '$transactionDate' } },
              count: { $sum: 1 },
            },
          },
        ],
        { cursor: {} },
      ).toArray();
      const Members = SchoolMemberDetails.aggregate(
        [
          { $match: { schoolId: { $in: schoolId } } },
          {
            $group: {
              _id: { month: { $month: '$addedOn' }, year: { $year: '$addedOn' } },
              count: { $sum: 1 },
            },
          },
        ],
        { cursor: {} },
      ).toArray();
      return {
        Purchases,
        Attendance,
        Expired,
        Cancelled,
        Members,
      };
    } catch (error) {
      console.log('error in transactions.getDataForGraph', error);
      throw new Meteor.Error(error);
    }
  },
});
