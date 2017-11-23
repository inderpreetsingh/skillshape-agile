import React from "react";
import PanelWithTable from '/imports/ui/componentHelpers/panelWithTable';
import classTypeSettings from './classTypeSettings'

export default function () {

	let { 
		classTypeData, 
		showFormBuilderModal, 
		moveTab, 
	} = this.props

  console.log("classTypeDetails render -->>", classTypeData);
  
	return (
		<div className="tab-pane active" id="tab_default_2">
			<div className="col-md-12" style={{paddingTop: '20px'}}>
				<PanelWithTable
					className="location-details"
					settings={classTypeSettings}
					mainTableData={classTypeData}
					getChildTableData={this.getChildTableData}
					showFormBuilderModal={showFormBuilderModal}
				/>
			</div>
			<div className="wizard-footer col-md-12">
        <div className="pull-right">
            <input type="button" onClick={()=> {moveTab("prices_details")}} className="btn btn-next btn-fill btn-success btn-wd" name="next" id="nxt" value="Next"/>
            <input type="button" className="btn btn-finish btn-fill btn-rose btn-wd" name="finish" value="Finish" style={{display: 'none'}}/>
        </div>
        <div className="pull-left">
            <input type="button" onClick={()=> {moveTab("location_details")}} className="btn btn-previous btn-fill btn-warning btn-wd" name="previous" value="Previous" id="prv"/>
        </div>
        <div className="clearfix"></div>
    	</div>
		</div>
	)
}