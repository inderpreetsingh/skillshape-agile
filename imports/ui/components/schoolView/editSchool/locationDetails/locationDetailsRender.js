import React from "react";
import PanelWithTable from "/imports/ui/componentHelpers/panelWithTable";
import locationSettings from "./locationSettings";
import isEmpty from "lodash/isEmpty";

export default function() {
  let { locationData, showFormBuilderModal,  schoolId ,isSaved,handleIsSavedState} = this.props;

  // console.log("SchoolEditDetails locationData 222-->>", locationData)
  return (
    <div className="tab-pane active" id="tab_default_2">
      <div>
        <PanelWithTable
          schoolId={schoolId}
          className="location-details"
          settings={locationSettings}
          mainTableData={locationData}
          getChildTableData={this.getChildTableData}
          showFormBuilderModal={showFormBuilderModal}
          showLocationDialog={isEmpty(locationData)}
          moveToNextTab={this.moveToNextTab}
          handleIsSavedState={handleIsSavedState}
          isSaved={isSaved}
        />
      </div>
      {/*<div className="wizard-footer col-md-12">
        <div className="pull-right">
            <input type="button" onClick={()=> {moveTab("class_type_details")}} className="btn btn-next btn-fill btn-success btn-wd" name="next" id="nxt" value="Next"/>
            <input type="button" className="btn btn-finish btn-fill btn-rose btn-wd" name="finish" value="Finish" style={{display: 'none'}}/>
        </div>
        <div className="pull-left">
            <input type="button" onClick={()=> {moveTab("school_details")}} className="btn btn-previous btn-fill btn-warning btn-wd" name="previous" value="Previous" id="prv"/>
        </div>
        <div className="clearfix"></div>
    	</div>*/}
    </div>
  );
}
