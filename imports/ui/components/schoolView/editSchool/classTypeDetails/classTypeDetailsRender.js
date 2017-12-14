import React, {Fragment} from "react";
import PanelWithTable from '/imports/ui/componentHelpers/panelWithTable';
import classTypeSettings from './classTypeSettings';
import {cutString} from '/imports/util';
import ClassTypeForm from './classTypeForm';
import ClassTypeExpansionPanel from './classTypeExpansionPanel';

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
		<div className="tab-pane active" id="tab_default_2">
			<div className="col-md-12" style={{paddingTop: '20px'}}>
				<div className="card">
					<div className="card-header card-header-tabs" data-background-color="blue">
					    <div className="nav-tabs-navigation">
					      	<div className="nav-tabs-wrapper">
					        	<span className="nav-tabs-title"></span>
				        		<ul className="nav nav-tabs" data-tabs="tabs">
				          			<li className="col-md-3 col-sm-3 col-xs-12">
				            			<a href="#" data-toggle="tab" aria-expanded="true">
				              				<i className="material-icons">assignment</i> Class Types
				              				<div className="ripple-container"></div>
				            			</a>
				          			</li>
			          				<li className="filter-archive filter-evaluation active col-md-3 col-sm-3 col-xs-12">
										<a onClick={() => this.setState({showClassTypeForm: true}) } id="add_location" data-toggle="tab" className="cpointer" aria-expanded="false">
											<i className="fa fa-plus" aria-hidden="true"></i>ADD CLASS TYPE
										  	<div className="ripple-container"></div>
										</a>
									</li>
				        		</ul>
					        </div>
					    </div>
					</div>
					<div className="card-content">
						{
							this.state.showClassTypeForm && (
								<ClassTypeExpansionPanel data={{}} 
									hideAddClassTypeForm={this.hideAddClassTypeForm}
					    		  	{...this.props}
					    		/>
							)
						}
						
						{ 
							classTypeData && classTypeData.map((dataItem,index) => {
					    		return <ClassTypeExpansionPanel
					    			data={dataItem} 
					    			hideAddClassTypeForm={this.hideAddClassTypeForm}
					    			key={index} 
					    			{...this.props}/>
							})
						}
				  	</div>
				</div>
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