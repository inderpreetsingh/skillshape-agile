import React from "react";

export default function (props) {
	console.log("panel with table props -->>",props)
	const { settings, mainTableData, showAddModal} = props;

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
									  <a onClick={()=>{showAddModal(settings.mainTable.tableFields)}} id="add_location" data-toggle="tab" className="cpointer" aria-expanded="false">
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
			            		<th key={index} className="location-details">{tableField.label || tableField.key}</th>
						    		)
					    		})
					    	}		
					    	{settings.mainTable.actions && <th key={settings.mainTable.tableFields.length} className="location-details">{settings.mainTable.actions.label || "Actions"}</th>}

		          </tr>
		        </thead>
		        <tbody>
              { 
              	mainTableData.map((dataItem,index) => {
	              	return (
		                <tr key={index}>
		                {
				            	settings.mainTable.tableFields.map((tableField, index) => {
								    		return (
					            		 <td key={index}>{dataItem[tableField.key]}</td>
								    		)
							    		})
							    	}
					    			{settings.mainTable.actions && <td key={settings.mainTable.tableFields.length} className="location-details">Actions</td>}
		                </tr>
	              	)
              	})
              }                 
            </tbody>
		      </table>
		    </div>
		    )} 
		
		  </div>
		</div>
	)
}