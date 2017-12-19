import React, {Fragment} from "react";
import PanelWithTable from '/imports/ui/componentHelpers/panelWithTable';
import classTypeSettings from './classTypeSettings';
import {cutString} from '/imports/util';
import ClassTypeForm from './classTypeForm';
import ClassTypeExpansionPanel from './classTypeExpansionPanel';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import config from '/imports/config';

const styles = {
  root: {
    width: '100%',
  },
};

export default function () {

	let { 
		classTypeData, 
		showFormBuilderModal, 
		moveTab,
		onDeleteRow,
		locationData, 
	} = this.props

  console.log("classTypeDetails render -->>", classTypeData);
  
	return (
		<div >
			<Toolbar style={{marginTop: 5,marginBottom: 5,backgroundColor: config.themeColor.blue}}>
	            <ToolbarGroup>
	            	 <FontIcon 
	                    className="material-icons"
	                    color={config.themeColor.white}
	                >
	                    assignment
	                </FontIcon>
	            	 <span style={{marginLeft: 5, color: config.themeColor.white}}>Class Types</span>
	            </ToolbarGroup>
	            <ToolbarGroup>
					<FloatingActionButton 
						backgroundColor={config.themeColor.white}
						mini={true}
						onClick={() => this.setState({showClassTypeForm: true}) }
					>
				      	<FontIcon 
		                    className="material-icons"
		                    style={{color: config.themeColor.blue}}
		                >
		                    add
		                </FontIcon>
				    </FloatingActionButton>
	            </ToolbarGroup>
			</Toolbar>
			<div className="card-content">
				{
					this.state.showClassTypeForm && (
						<ClassTypeExpansionPanel 
							addForm={true}
							data={{}}
							hideAddClassTypeForm={this.hideAddClassTypeForm}
			    		  	{...this.props}
			    		/>
					)
				}
				
				{ 
					classTypeData && classTypeData.map((dataItem,index) => {
			    		return <ClassTypeExpansionPanel
			    			addForm={false}
			    			data={dataItem} 
			    			hideAddClassTypeForm={this.hideAddClassTypeForm}
			    			key={index} 
			    			{...this.props}
			    		/>
					})
				}
			</div>
			<div className="wizard-footer col-md-12">
		        <div className="pull-right">
		            <input type="button" onClick={()=> {moveTab("modules")}} className="btn btn-next btn-fill btn-success btn-wd" name="next" id="nxt" value="Next"/>
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