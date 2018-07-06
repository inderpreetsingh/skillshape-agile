import MonthlyPricing from "./fields";
import ClassType from "/imports/api/classType/fields";

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
    try {
    } catch (error) {}
    const user = Meteor.users.findOne(this.userId);
    if (
      checkMyAccess({
        user,
        schoolId: doc.schoolId,
        viewName: "monthlyPricing_CUD"
      })
    ) {
      updateHookForClassType({ classTypeId: doc.classTypeId, doc });
      doc.pymtDetails.map((elem, index) => {
        console.log("this is index ", index);
        try {
          let result = Meteor.call(
            "stripe.createStripePlan",
            "usd",
            "month",
            elem.cost
          );
          return (doc.pymtDetails[index].planId = result);
          console.log("doc.pymtDetails", doc.pymtDetails);
        } catch (error) {
          throw new Meteor.Error("Something went wrong!");
        }
      });
      console.log("doc------------->", doc);
      MonthlyPricing.insert(doc);
      return true;
    } else {
      throw new Meteor.Error("Permission denied!!");
    }
  },
  "monthlyPricing.editMonthlyPricing": function({ doc_id, doc }) {
    const user = Meteor.users.findOne(this.userId);
    // console.log("MonthlyPricing.editMonthlyPricing methods called!!!",doc_id, doc);
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
      doc.pymtDetails.map((elem, index) => {
        console.log("this is index ", index);
        try {
          let result = Meteor.call(
            "stripe.createStripePlan",
            "usd",
            "month",
            elem.cost
          );
          return (doc.pymtDetails[index].planId = result);
          console.log("doc.pymtDetails", doc.pymtDetails);
        } catch (error) {
          throw new Meteor.Error("Something went wrong!");
        }
      });
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
  }
});
