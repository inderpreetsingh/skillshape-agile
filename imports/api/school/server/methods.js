import ClassPricing from "/imports/api/classPricing/fields";
import MonthlyPricing from "/imports/api/monthlyPricing/fields";
import School from "/imports/api/school/fields";
import { check } from 'meteor/check';

Meteor.methods({
  "school.getBestPrice": function({ slug }) {
    check(slug,String);

    let school = School.findOne({ slug: slug });
    const schoolId = school && school._id;

    //////////// Calculate Best price Class package ////////////
    const ClassPricingRaw = ClassPricing.rawCollection();
    let classPricingAggregateQuery = Meteor.wrapAsync(
      ClassPricingRaw.aggregate,
      ClassPricingRaw
    );
    let classPricingAggregateResult = classPricingAggregateQuery([
      {
        $match: { schoolId: schoolId }
      },
      {
        $project: {
          avgRate: { $divide: ["$cost", "$noClasses"] }
        }
      },
      {
        $sort: { avgRate: 1 }
      }
    ]);

    //////////// Calculate Best price Monthly package ////////////
    const MonthlyPricingRaw = MonthlyPricing.rawCollection();
    let monthlyPricingregateQuery = Meteor.wrapAsync(
      MonthlyPricingRaw.aggregate,
      MonthlyPricingRaw
    );
    let monthlyPricingAggregateResult = monthlyPricingregateQuery([
      {
        $match: { schoolId: schoolId }
      },
      {
        $unwind: "$pymtDetails"
      },
      {
        $project: {
          avgRate: { $divide: ["$pymtDetails.cost", "$pymtDetails.month"] }
        }
      },
      {
        $sort: { avgRate: 1 }
      }
    ]);

    return {
      bestClassPrice: classPricingAggregateResult[0],
      bestMonthlyPrice: monthlyPricingAggregateResult[0]
    };
  }
});
