import React, {Fragment} from "react";
import PanelWithTable from '/imports/ui/componentHelpers/panelWithTable';
import classTypeSettings from './classTypeSettings';
import {cutString} from '/imports/util';
import ClassTypeForm from './classTypeForm';

export default function () {

	let { 
		classTypeData, 
		showFormBuilderModal, 
		moveTab,
		onDeleteRow, 
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
			    		<div className="table-responsive">
			      			<table className="table text-center" style={{display: 'table'}}>
		        				{ false && <ClassTypeForm/>}
					        	<tbody>
						        	{
						        		classTypeData && classTypeData.map((dataItem,index) => {
						        			return (
						        				<Fragment>
							        				<tr key={index}>
							        					<td >
							  					 			<button type="button" rel="tooltip" className="btn btn-primary arrow-rotate-box pull-left" data-original-title="" title="" id="showClasses" data-id={dataItem._id} data-toggle="collapse" data-target={`#${dataItem._id}`}>
														      <i className="material-icons">expand_more</i>
														    </button>
							        					</td>
				        								<td><h4 className="pull-left">{dataItem.name}</h4></td>
									  					<td className="td-actions">
							  					 			<button type="button" onClick={() => {this.onDeleteRow({editByFieldValue: dataItem._id, formPayload: dataItem})}} rel="tooltip" className="btn btn-danger pull-right" data-original-title="" title="" id="deleteLocation" data-id="{{_id}}">
														      Remove
														    </button>
									  					</td>
							        				</tr>
							        				<div key={dataItem._id} id={dataItem._id} className="collapse in">
							        				</div>
						        				</Fragment>	
						        			)	
						        		})
						        	}
			            		</tbody>
					      	</table>
					    </div>
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