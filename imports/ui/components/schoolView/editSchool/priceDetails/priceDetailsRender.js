import React from "react";
import PanelWithTable from '/imports/ui/componentHelpers/panelWithTable';
import { classPriceSettings, monthlyPriceSettings } from './priceSettings';

export default function () {
	console.log("price details render data -->>>",this.props);
	let { 
		classPricingData,
		monthlyPricingData, 
		showFormBuilderModal, 
		moveTab,
		schoolId, 
	} = this.props

	return (
		<div className="tab-pane active">
			<div className="col-md-12" style={{paddingTop: '20px'}}>
				<PanelWithTable
					schoolId={schoolId}
					className="location-details"
					settings={monthlyPriceSettings}
					mainTableData={monthlyPricingData}
					showFormBuilderModal={showFormBuilderModal}
				/>
			</div>
			<div className="col-md-12" style={{paddingTop: '20px'}}>
				<PanelWithTable
					schoolId={schoolId}
					className="location-details"
					settings={classPriceSettings}
					mainTableData={classPricingData}
					showFormBuilderModal={showFormBuilderModal}
				/>
			</div>
			<div className="wizard-footer col-md-12">
        <div className="pull-right">
            <input type="button" onClick={()=> {moveTab("media_details")}} className="btn btn-next btn-fill btn-success btn-wd" name="next" id="nxt" value="Next"/>
            <input type="button" className="btn btn-finish btn-fill btn-rose btn-wd" name="finish" value="Finish" style={{display: 'none'}}/>
        </div>
        <div className="pull-left">
            <input type="button" onClick={()=> {moveTab("class_type_details")}} className="btn btn-previous btn-fill btn-warning btn-wd" name="previous" value="Previous" id="prv"/>
        </div>
        <div className="clearfix"></div>
    	</div>
		</div>
	)
}