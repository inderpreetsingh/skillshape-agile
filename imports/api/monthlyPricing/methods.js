import MonthlyPricing from "./fields";
import ClassType from "/imports/api/classType/fields";
import isEmpty from "lodash/isEmpty";
import { check } from 'meteor/check';

function updateHookForClassType({ classTypeId, doc }) {
  if (classTypeId && _.isArray(classTypeId)) {
    const allCost = doc && {
      oneMonCost: doc.oneMonCost && parseInt(doc.oneMonCost),
      threeMonCost: doc.threeMonCost && parseInt(doc.threeMonCost),
      sixMonCost: doc.sixMonCost && parseInt(doc.sixMonCost),
      annualCost: doc.annualCost && parseInt(doc.annualCost),
      lifetimeCost: doc.lifetimeCost && parseInt(doc.lifetimeCost)
    };
    ClassType.update(
      { _id: { $in: classTypeId } },
      { $set: { "filters.monthlyPriceCost": allCost } }
    );
  }
  return;
}

Meteor.methods({
  "monthlyPricing.addMonthlyPricing": function ({ doc }) {
    check(doc, Object);
    try{
      let amount, currency;
      const user = Meteor.users.findOne(this.userId);
      if (
        checkMyAccess({
          user,
          schoolId: doc.schoolId,
          viewName: "monthlyPricing_CUD"
        })
      ) {
        updateHookForClassType({ classTypeId: doc.classTypeId, doc });
        if (
          doc &&
          doc.pymtType &&
          (doc.pymtType.autoWithDraw || doc.pymtType.payAsYouGo || doc.pymtType.payUpFront)
        ) {
          doc.pymtDetails.map((elem, index) => {
              config.currency.map((data, index) => {
                if (data.value == elem.currency) {
                  currency = data.label;
                  amount = elem.cost * data.multiplyFactor;
                }
              })
              let result = Meteor.call(
                "stripe.createStripePlan",
                currency,
                "month",
                amount
              );
              return (doc.pymtDetails[index].planId = result);
            
          });
  
        }
        MonthlyPricing.insert(doc);
        return true;
      } else {
        throw new Meteor.Error("Permission denied!!");
      }
    }catch (error) {
      throw new Meteor.Error("Something went wrong!",error);
    }
  },
  "monthlyPricing.editMonthlyPricing": function ({ doc_id, doc }) {
    try {
    check(doc, Object);
    check(doc_id, String);
    let amount, currency;
    const user = Meteor.users.findOne(this.userId);
    if (
      checkMyAccess({
        user,
        schoolId: doc.schoolId,
        viewName: "monthlyPricing_CUD"
      })
    ) {

      let monthlyPriceData = MonthlyPricing.findOne({ _id: doc_id });
      let diff = _.difference(monthlyPriceData.classTypeId, doc.classTypeId);
      if (diff && diff.length > 0) {

        updateHookForClassType({ classTypeId: diff, doc: null });
      }
      updateHookForClassType({ classTypeId: doc.classTypeId, doc });
      if (
        doc &&
        doc.pymtType &&
        (doc.pymtType.autoWithDraw || doc.pymtType.payAsYouGo || doc.pymtType.payUpFront)
      ) {
        doc.pymtDetails.map((elem, index) => {

            config.currency.map((data, index) => {

              if (data.value == elem.currency) {

                currency = data.label;
                amount = elem.cost * data.multiplyFactor;
              }
            })
            let result = Meteor.call(
              "stripe.createStripePlan",
              currency,
              "month",
              amount
            );

            doc.pymtDetails[index].planId = result
        });
      }
      MonthlyPricing.update({ _id: doc_id }, { $set: doc });

      return true;
    } else {
      throw new Meteor.Error("Permission denied!!");
    }} catch (error) {
      throw new Meteor.Error("Something went wrong!",error);
    }
  },
  "monthlyPricing.removeMonthlyPricing": function ({ doc }) {
    check(doc, Object);

    const user = Meteor.users.findOne(this.userId);
    if (
      checkMyAccess({
        user,
        schoolId: doc.schoolId,
        viewName: "monthlyPricing_CUD"
      })
    ) {
      updateHookForClassType({ classTypeId: doc.classTypeId, doc: null });
      return MonthlyPricing.update(
        { _id: doc._id },
        { $set: { deleted: true } }
      );
    } else {
      throw new Meteor.Error("Permission denied!!");
    }
  },
  "monthlyPricing.handleClassTypes": function ({ classTypeId, selectedIds, diselectedIds }) {
    check(classTypeId, String);
    check(selectedIds, [String]);
    check(diselectedIds, [String]);
    MonthlyPricing.update({ classTypeId: null }, { $set: { classTypeId: [] } })
    try {
      if (!isEmpty(diselectedIds)) {
        let result = MonthlyPricing.update({ _id: { $in: diselectedIds } }, { $pull: { classTypeId } }, { multi: true })
      }
      if (!isEmpty(selectedIds)) {
        let result = MonthlyPricing.update({ _id: { $in: selectedIds } }, { $push: { classTypeId } }, { multi: true })
      }
      return true;
    }
    catch (error) {
      throw new Meteor.Error(error);
    }
  }
});
