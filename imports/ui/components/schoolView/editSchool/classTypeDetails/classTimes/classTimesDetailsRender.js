import React, {Fragment} from "react";
import ClassTimesExpansionPanel from './classTimesExpansionPanel';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import FontIcon from 'material-ui/FontIcon';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import config from '/imports/config';

export default function () {

	let { classTimesData, schoolId, classTypeId, selectedLocation } = this.props

	return (
			<div >
				<Toolbar style={{marginTop: 5,marginBottom: 5,marginLeft: 15, marginRight: 15, backgroundColor: config.themeColor.green}}>
		            <ToolbarGroup>
		            	 <FontIcon 
		                    className="material-icons"
		                    color={config.themeColor.white}
		                >
		                    schedule
		                </FontIcon>
		            	 <span style={{marginLeft: 5, color: config.themeColor.white}}>Class Times</span>
		            </ToolbarGroup>
		            <ToolbarGroup>
						<FloatingActionButton 
							backgroundColor={config.themeColor.white}
							mini={true}
							onClick={() => this.setState({showClassTimeForm: true}) }
						>
					      	<FontIcon 
			                    className="material-icons"
			                    style={{color: config.themeColor.green}}
		                	>
		                    	add
		                	</FontIcon>
				    	</FloatingActionButton>
		            </ToolbarGroup>
				</Toolbar>
				<div className="card-content">
					{
						this.state.showClassTimeForm && (
							<ClassTimesExpansionPanel 
								addForm={true}
								classTimesData={null}
								hideAddClassTimesForm={this.hideAddClassTimesForm}
				    		  	schoolId={schoolId}
				    		  	classTypeId={classTypeId}
				    		  	selectedLocation={selectedLocation}
				    		/>
						)
					}
				
					{ 
						classTimesData && classTimesData.map((dataItem,index) => {
				    		return <ClassTimesExpansionPanel
				    			key={index} 
				    			addForm={false}
				    			classTimesData={dataItem} 
				    			hideAddClassTimesForm={this.hideAddClassTimesForm}
				    			schoolId={schoolId}
				    			classTypeId={classTypeId}
				    			selectedLocation={selectedLocation}
				    		/>
						})
					}
			  	</div>
			</div>
		)
}
