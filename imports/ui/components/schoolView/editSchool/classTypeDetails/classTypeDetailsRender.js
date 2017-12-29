import React from 'react';
import PanelWithTable from '/imports/ui/componentHelpers/panelWithTable';
import classTypeSettings from './classTypeSettings';

export default function() {

	let { 
		classTypeData, 
		showFormBuilderModal, 
		moveTab,
		schoolId,
		locationData, 
	} = this.props

	return (
		<div style={{paddingTop: '20px'}}>
			<PanelWithTable
				schoolId={schoolId}
			    className="class-type-details"
			    settings={classTypeSettings}
			    mainTableData={classTypeData}
			    getChildTableData={this.getChildTableData}
			    showFormBuilderModal={showFormBuilderModal}
			    locationData={locationData}
			    handleImageChange={this.handleImageChange}
			    handleImageSave={this.handleImageSave}
			/>
		</div>
	)
}