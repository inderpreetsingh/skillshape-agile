import ClassType from '/imports/api/classType/fields';
import { get, isEmpty } from 'lodash';
import { check } from 'meteor/check';
import MonthlyPricing from './fields';

function updateHookForClassType({ classTypeId, doc }) {
  if (classTypeId && _.isArray(classTypeId)) {
    const allCost = doc && {
      oneMonCost: doc.oneMonCost && parseInt(doc.oneMonCost),
      threeMonCost: doc.threeMonCost && parseInt(doc.threeMonCost),
      sixMonCost: doc.sixMonCost && parseInt(doc.sixMonCost),
      annualCost: doc.annualCost && parseInt(doc.annualCost),
      lifetimeCost: doc.lifetimeCost && parseInt(doc.lifetimeCost),
    };
    ClassType.update(
      { _id: { $in: classTypeId } },
      { $set: { 'filters.monthlyPriceCost': allCost } },
    );
  }
}

Meteor.methods({
  'monthlyPricing.addMonthlyPricing': function ({ doc }) {
    check(doc, Object);
    try {
      let amount;
      let currency;
      const user = Meteor.users.findOne(this.userId);
      if (
        checkMyAccess({
          user,
          schoolId: doc && doc.schoolId,
          viewName: 'monthlyPricing_CUD',
        })
      ) {
        updateHookForClassType({ classTypeId: doc.classTypeId, doc });
        if (
          doc.pymtType
          && (doc.pymtType.autoWithDraw || doc.pymtType.payAsYouGo || doc.pymtType.payUpFront)
        ) {
          doc.pymtDetails.map((elem, index) => {
            config.currency.map((data, index) => {
              if (data.value == elem.currency) {
                currency = data.label;
                amount = String(elem.cost);
                if (amount.indexOf('.') == -1) {
                  amount = parseInt(
                    String(elem.cost)
                      .split('.')
                      .join(''),
                  ) * data.multiplyFactor;
                } else {
                  amount = parseInt(
                    String(elem.cost)
                      .split('.')
                      .join(''),
                  );
                }
              }
            });
            const result = Meteor.call('stripe.createStripePlan', currency, 'month', amount);
            return (doc.pymtDetails[index].planId = result);
          });
        }
        MonthlyPricing.insert(doc);
        return true;
      }
      throw new Meteor.Error('Permission denied!!');
    } catch (error) {
      throw new Meteor.Error('Something went wrong!', error);
    }
  },
  'monthlyPricing.editMonthlyPricing': function ({ doc_id, doc }) {
    try {
      check(doc, Object);
      check(doc_id, String);
      let amount;
      let currency;
      const user = Meteor.users.findOne(this.userId);
      if (
        checkMyAccess({
          user,
          schoolId: doc.schoolId,
          viewName: 'monthlyPricing_CUD',
        })
      ) {
        const monthlyPriceData = MonthlyPricing.findOne({ _id: doc_id });
        const diff = _.difference(monthlyPriceData.classTypeId, doc.classTypeId);
        if (diff && diff.length > 0) {
          updateHookForClassType({ classTypeId: diff, doc: null });
        }
        updateHookForClassType({ classTypeId: doc.classTypeId, doc });
        if (
          doc.pymtType
          && (doc.pymtType.autoWithDraw || doc.pymtType.payAsYouGo || doc.pymtType.payUpFront)
        ) {
          doc.pymtDetails.map((elem, index) => {
            config.currency.map((data, index) => {
              if (data.value == elem.currency) {
                currency = data.label;
                amount = elem.cost * data.multiplyFactor;
              }
            });
            const result = Meteor.call('stripe.createStripePlan', currency, 'month', amount);

            doc.pymtDetails[index].planId = result;
          });
        }
        MonthlyPricing.update({ _id: doc_id }, { $set: doc });

        return true;
      }
      throw new Meteor.Error('Permission denied!!');
    } catch (error) {
      throw new Meteor.Error('Something went wrong!', error);
    }
  },
  'monthlyPricing.removeMonthlyPricing': function ({ doc }) {
    check(doc, Object);

    const user = Meteor.users.findOne(this.userId);
    if (
      checkMyAccess({
        user,
        schoolId: doc.schoolId,
        viewName: 'monthlyPricing_CUD',
      })
    ) {
      updateHookForClassType({ classTypeId: doc.classTypeId, doc: null });
      return MonthlyPricing.update({ _id: doc._id }, { $set: { deleted: true } });
    }
    throw new Meteor.Error('Permission denied!!');
  },
  'monthlyPricing.handleClassTypes': function ({ classTypeId, selectedIds, diselectedIds }) {
    check(classTypeId, String);
    check(selectedIds, [String]);
    check(diselectedIds, [String]);
    MonthlyPricing.update({ classTypeId: null }, { $set: { classTypeId: [] } });
    try {
      if (!isEmpty(diselectedIds)) {
        MonthlyPricing.update(
          { _id: { $in: diselectedIds } },
          { $pull: { classTypeId } },
          { multi: true },
        );
      }
      if (!isEmpty(selectedIds)) {
        MonthlyPricing.update(
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
  'monthlyPricing.getCover': function (_id) {
    const record = MonthlyPricing.findOne({ _id });
    return get(record, 'selectedClassType', []);
  },
});
