import ClassPricing from "/imports/api/classPricing/fields";
import MonthlyPricing from "/imports/api/monthlyPricing/fields";
import School from "/imports/api/school/fields";

Meteor.methods({

	"school.getBestPrice": function({slug}) {
        console.log("price.getBestPrice slug",slug)
		let school = School.findOne({ slug: slug});
		const schoolId = school && school._id
        console.log("price.getBestPrice schoolId",schoolId)

        //////////// Calculate Best price Class package ////////////
        const ClassPricingRaw = ClassPricing.rawCollection()
        let classPricingAggregateQuery = Meteor.wrapAsync(ClassPricingRaw.aggregate, ClassPricingRaw);
        let classPricingAggregateResult = classPricingAggregateQuery([
            {
                $match: { schoolId: schoolId }
            },
            {
                $project: {
                    avgRate: { '$divide': ["$cost", "$noClasses"] }
                }
            },
            {
                $sort : { avgRate : 1 }
            }
        ])

    	//////////// Calculate Best price Monthly package ////////////
        const MonthlyPricingRaw = MonthlyPricing.rawCollection()
        let monthlyPricingregateQuery = Meteor.wrapAsync(MonthlyPricingRaw.aggregate, MonthlyPricingRaw);
        let monthlyPricingAggregateResult = monthlyPricingregateQuery([
            {
                $match: { schoolId: schoolId }
            },
            {
         		$unwind: "$pymtDetails"
     		},
            {
                $project: {
                    avgRate: { '$divide': ["$pymtDetails.cost", "$pymtDetails.month"] }
                }
            },
            {
                $sort : { avgRate : 1 }
            }
        ])

        // console.log("classPricingAggregateResult-->>",classPricingAggregateResult)
        // console.log("monthlyPricingAggregateResult-->>",monthlyPricingAggregateResult)
        return {
        	bestClassPrice: classPricingAggregateResult[0],
        	bestMonthlyPrice: monthlyPricingAggregateResult[0],
        }
    }
})