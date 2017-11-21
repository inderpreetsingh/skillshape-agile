import React from "react";

export default function (props) {
	console.log("panel with table props -->>",props)
	const { 
		settings, 
		mainTableData, 
		showFormBuilderModal, 
		className,
	} = props;

	const mainTableRows = [];
	
	const renderTableRows = () => { 
  	mainTableData.map((dataItem,index) => {
    	mainTableRows.push(
        <tr key={index}>
        {
        	settings.mainTable.tableFields.map((tableField, index) => {
		    		return (
          		<td key={index}>{dataItem[tableField.key]}</td>
		    		)
	    		})
	    	}
  			{
  				settings.mainTable.actions && (
  					<td key={settings.mainTable.tableFields.length} className={`${className} td-actions`}>
  					  {
  					 		settings.mainTable.actions.toggleChildTable && (
  					 			<button type="button" rel="tooltip" className="btn btn-primary arrow-rotate-box" data-original-title="" title="" id="showClasses" data-id={dataItem._id} data-toggle="collapse" data-target={`#${dataItem._id}`}>
							      <i className="material-icons">expand_more</i>
							    </button>
  					 		)
  					 	}

  					 	{
  					 		settings.mainTable.actions.edit && (
  					 			<button type="button" onClick={()=>{showFormBuilderModal("Edit", settings.mainTable.tableFields, dataItem, `Edit ${settings.mainTable.title}`, settings.mainTable.submit.edit)}} rel="tooltip" className="btn btn-warning" data-id={dataItem._id} title="" id="editLocation">
							      <i className="material-icons">edit</i>
							    </button>
  					 		)
  					 	}

  					 	{
  					 		settings.mainTable.actions.delete && (
  					 			<button type="button" rel="tooltip" className="btn btn-danger " data-original-title="" title="" id="deleteLocation" data-id="{{_id}}">
							      <i className="material-icons">close</i>
							    </button>
  					 		)
  					 	}
  					</td>
  				)
  			}
        </tr>
      )
      mainTableRows.push(
      	<tr key={dataItem._id} id={dataItem._id} className="collapse in">
			    <td colSpan="7">
		        <div className="col-sm-1">
		        </div>
		        <div className="col-md-11">
		        	<div className="card card-plain" style={{background: 'whitesmoke'}}>
		        		<div className="row box-row">
                  <div className="col-sm-8 hidden-xs">
                    <h4 className="card-title card-list-title">Rooms</h4>
                  </div>
                  <div className="col-sm-4 hidden-xs">
                    <button onClick={()=>{showFormBuilderModal("Add", settings.childTable.tableFields, null, settings.childTable.title, settings.childTable.submit.add)}} type="button" rel="tooltip" className="btn btn-success btn-sm" data-original-title="" title="" id="addRoomsModel" data-id={dataItem._id}>
                      <i className="material-icons">add</i> Room
                    </button>
                  </div>
                  <div className="col-xs-12 hidden-lg hidden-md hidden-sm room-content-box">
                    <h4 className="card-title card-list-title">Rooms</h4>
                    <button type="button" rel="tooltip" className="btn btn-success btn-sm" data-original-title="" title="" id="addRoomsModel" data-id={dataItem._id}>
                      <i className="material-icons">add</i> Room
                    </button>
                  </div>
              	</div>
              	<div className="card-content">
                  <div className="table-responsive">
                    <table className="table table-capacity-heading">
                      <thead>
                        <tr>
                        	{
							            	settings.childTable.tableFields.map((tableField, index) => {
											    		return (
								            		<th key={index} className={className}>{tableField.label || tableField.key}</th>
											    		)
										    		})
										    	}		
										    	{	
										    		settings.childTable.actions && <th key={settings.childTable.tableFields.length} className={className}>{settings.childTable.actions.label || "Actions"}</th>
										    	}
                        </tr>
                      </thead>
                      <tbody className="table-capacity-content">
                       {
                       		dataItem.rooms && dataItem.rooms.map((roomData, index) => {
                       			return (
                       				<tr key={index}>
                       					<td>{roomData.name}</td>
                                <td>{roomData.capicity}</td>
                                {	
													    		settings.childTable.actions && (
													    			<td className="td-actions ">
													    				{
													    					settings.childTable.actions.edit && (
													    						<button type="button" onClick={()=>{showFormBuilderModal("Edit", settings.childTable.tableFields, roomData, `Edit ${settings.childTable.title}`, settings.childTable.submit.edit)}} rel="tooltip" className="btn btn-warning editRoomLocat" data-original-title="" title="" id="editRoomLocat" data-id={roomData._id} data-location={dataItem._id} data-name={roomData.name} data-capicity={roomData.capicity}>
                                            <i className="material-icons">edit</i>
                                        	</button>
													    					)
													    				}

													    				{
													    					settings.childTable.actions.delete && (
													    						<button type="button" rel="tooltip" className="btn btn-danger" data-original-title="" title="" id="deleteRoom" data-id={roomData._id} data-location={dataItem._id}>
                                            <i className="material-icons">close</i>
                                          </button>
													    					)
													    				}

													    			</td>
													    		)
													    	}
                       				</tr>
                       			)
                       		})
                       }
                      </tbody>
                    </table>        
		        			</div>
		        		</div>
		        	</div>
		        </div>
			    </td>    
		  	</tr>
    	)
  	})
  	return mainTableRows;
  }

	return (
		<div className="card">
		  <div className="card-header card-header-tabs" data-background-color="blue">
		    <div className="nav-tabs-navigation">
		      <div className="nav-tabs-wrapper">
		        <span className="nav-tabs-title"></span>
		        <ul className="nav nav-tabs" data-tabs="tabs">
		          <li className="col-md-3 col-sm-3 col-xs-12">
		            <a href="#" data-toggle="tab" aria-expanded="true">
		              <i className="material-icons">{settings.mainPanelHeader.leftIcon}</i> {settings.mainPanelHeader.title}
		              <div className="ripple-container"></div>
		            </a>
		          </li>
		          {
		          	settings.mainPanelHeader.rightButtonTitle && (
		          		<li className="filter-archive filter-evaluation active col-md-3 col-sm-3 col-xs-12">
									  <a onClick={()=>{showFormBuilderModal("Add", settings.mainTable.tableFields, null, settings.mainPanelHeader.title, settings.mainTable.submit.add)}} id="add_location" data-toggle="tab" className="cpointer" aria-expanded="false">
									  <i className="fa fa-plus" aria-hidden="true"></i>{settings.mainPanelHeader.rightButtonTitle}
									  <div className="ripple-container"></div>
									  </a>
									</li>
		          	)
		          }
		        </ul>
		      </div>
		    </div>
		  </div>
		  <div className="card-content">
		    {settings.mainTable && settings.mainTable.tableFields && settings.mainTable.tableFields.length > 0 && (
		    	<div className="table-responsive">
		      <table className="table text-center">
		        <thead>
		          <tr>
		            {
		            	settings.mainTable.tableFields.map((tableField, index) => {
						    		return (
			            		<th key={index} className={className}>{tableField.label || tableField.key}</th>
						    		)
					    		})
					    	}		
					    	{settings.mainTable.actions && <th key={settings.mainTable.tableFields.length} className={className}>{settings.mainTable.actions.label || "Actions"}</th>}
		          </tr>
		        </thead>
		        <tbody>
              {renderTableRows()}               
            </tbody>
		      </table>
		    </div>
		    )} 
		  </div>
		</div>
	)
}