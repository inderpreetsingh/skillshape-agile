import React from "react";

import ClassPrice from './classPrice';
import MonthlyPrice from './monthlyPrice';
import EnrollmentFee from './enrollmentFee';

export default function () {
	let {
		classPricingData,
		monthlyPricingData,
		enrollmentFeeData,
		moveTab,
		schoolId,
		classTypeData,
		schoolData,
		currency
	} = this.props

	return (
		<div>
			<div style={{paddingTop: '20px'}}>
				<ClassPrice
					schoolId={schoolId}
					classPricingData={classPricingData}
					classTypeData={classTypeData}
					schoolData={schoolData}
					currency={currency}
				/>
			</div>
			<div style={{paddingTop: '20px'}}>
				<MonthlyPrice
					schoolId={schoolId}
					monthlyPricingData={monthlyPricingData}
					classTypeData={classTypeData}
					schoolData={schoolData}
					currency={currency}
					
				/>
			</div>
			<div style={{paddingTop: '20px'}}>
				<EnrollmentFee
					schoolId={schoolId}
					enrollmentFeeData={enrollmentFeeData}
					classTypeData={classTypeData}
					schoolData={schoolData}
					currency={currency}
					
					/>
			</div>
			{/*<div className="wizard-footer col-md-12">
        <div className="pull-right">
            <input type="button" onClick={()=> {moveTab("media_details")}} className="btn btn-next btn-fill btn-success btn-wd" name="next" id="nxt" value="Next"/>
            <input type="button" className="btn btn-finish btn-fill btn-rose btn-wd" name="finish" value="Finish" style={{display: 'none'}}/>
        </div>
        <div className="pull-left">
            <input type="button" onClick={()=> {moveTab("class_type_details")}} className="btn btn-previous btn-fill btn-warning btn-wd" name="previous" value="Previous" id="prv"/>
        </div>
        <div className="clearfix"></div>
    	</div>*/}
		</div>
	)
}