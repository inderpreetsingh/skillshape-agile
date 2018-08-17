import MonthlyPricing from "./fields";
import ClassType from "/imports/api/classType/fields";
import isEmpty from "lodash/isEmpty";

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
  "monthlyPricing.addMonthlyPricing": function({ doc }) {
    let amount,currency;
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
        (doc.pymtType.autoWithDraw == true && !doc.pymtType.payAsYouGo)
      ) {
        doc.pymtDetails.map((elem, index) => {
                  try {
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
          } catch (error) {
            throw new Meteor.Error("Something went wrong!");
          }
        });
      }

      MonthlyPricing.insert(doc);
      return true;
    } else {
      throw new Meteor.Error("Permission denied!!");
    }
  },
  "monthlyPricing.editMonthlyPricing": function({ doc_id, doc }) {
    let amount,currency;
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
        (doc.pymtType.autoWithDraw == true && !doc.pymtType.payAsYouGo)
      ) {
        doc.pymtDetails.map((elem, index) => {

          try {
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
          } catch (error) {
            throw new Meteor.Error("Something went wrong!");
          }
        });
      }

      MonthlyPricing.update({ _id: doc_id }, { $set: doc });
      return true;
    } else {
      throw new Meteor.Error("Permission denied!!");
    }
  },
  "monthlyPricing.removeMonthlyPricing": function({ doc }) {
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
      console.log('classTypeId, selectedIds, diselectedIds',classTypeId, selectedIds, diselectedIds)
      console.log("step 1");
      MonthlyPricing.update({classTypeId:null},{$set:{classTypeId:[]}})        
      console.log("step 2");       
      try {
          console.log("step 3");
          if (!isEmpty(diselectedIds)) {
              console.log("step 4");
              let result = MonthlyPricing.update({ _id: { $in: diselectedIds } }, { $pop: { classTypeId } }, { multi: true })
              console.log("step 5");
          }
          if (!isEmpty(selectedIds)) {
              console.log("step 6");
              let result = MonthlyPricing.update({ _id: { $in: selectedIds } }, { $push: { classTypeId } }, { multi: true })
              console.log("step 7");
          }
          console.log("step 8");
          return true;
          console.log("step 9");
      }
      catch (error) {
          console.log("step 10");
          throw new Meteor.Error(error);
          console.log("step 11");
      }
  }
});

