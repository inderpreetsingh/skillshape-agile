import React from "react";
import { Loading } from '/imports/ui/loading';
import { browserHistory, Link } from 'react-router';
import SchoolDetails from './schoolDetails';
import LocationDetails from './locationDetails';
import { FormBuilderModal } from '/imports/ui/modal';

export default function (props) {

  const {
    selecetdView,
    formBuilderModal,
  } = this.state;

  let {
    schoolId,
    schoolData,
    currentUser,
    isUserSubsReady,
    locationData,
  } = this.props;

  // console.log("SchoolEditDetails render formBuilderModal -->>", this.refs)
  if(isUserSubsReady && schoolData) {

    this.checkSchoolAccess(currentUser, schoolId)

  	return (
  		<div>
        {
          formBuilderModal && <FormBuilderModal
            {...formBuilderModal}
            onSubmit={this.refs[`${selecetdView}_tab`] && this.refs[`${selecetdView}_tab`].onSubmit}
          />
        }
  			<div className="wizard-navigation">
          <ul className="nav nav-pills nav-navigation">
            <li style={{marginLeft: 0}} className="active col-sm-2 col-xs-12">
              <a 
                ref="school_details"
                className="remove-radius" 
                onClick={()=> { this.setState({selecetdView: "school_details"})}} 
                data-toggle="tab" 
                aria-expanded="false"
              >
                <b>School Details</b>
              </a>
            </li>
            <li style={{marginLeft: 0}} className="col-sm-2 col-xs-12">
              <a 
                ref="location_details"
                onClick={()=> { this.setState({selecetdView: "location_details"})}} 
                data-toggle="tab" 
                aria-expanded="false" 
                className=" remove-radius validate"
              >
                <b>Location Details</b>
              </a>
            </li>
            <li style={{marginLeft: 0}} className="col-sm-2 col-xs-12">
              <a
                ref="class_type_details" 
                onClick={()=> { this.setState({selecetdView: "class_type_details"})}} 
                data-toggle="tab" 
                aria-expanded="true" 
                className="remove-radius validate"
              >
                <b>className Type Details</b>
              </a>
            </li>
            <li style={{marginLeft: 0}} className="col-sm-2 col-xs-12">
              <a
                ref="prices_details" 
                onClick={()=> { this.setState({selecetdView: "prices_details"})}} 
                data-toggle="tab" 
                aria-expanded="true" 
                className="remove-radius validate"
              >
                <b>Prices</b>
              </a>
            </li>
            <li style={{marginLeft: 0}} className="col-sm-2 col-xs-12">
              <a
                ref="media_details" 
                onClick={()=> { this.setState({selecetdView: "media_details"})}} 
                data-toggle="tab" 
                aria-expanded="true" 
                className="remove-radius validate"
              >
                <b>Media</b>
              </a>
            </li>
            <li style={{marginLeft: 0}} className="col-sm-2 col-xs-12">
              <a
                ref="iframe_details" 
                onClick={()=> { this.setState({selecetdView: "iframe_details"})}} 
                data-toggle="tab" 
                aria-expanded="true" 
                className="remove-radius validate"
              >
                <b>Iframe Code</b>
              </a>
            </li>
          </ul>
        </div>
        <div className="tab-content">
          { 
            (selecetdView === "school_details") && <SchoolDetails
              schoolData={schoolData}
              schoolId={schoolId}
              moveTab={this.moveTab}
            /> 
          } 
          {
            (selecetdView === "location_details") && <LocationDetails
              locationData={locationData}
              showFormBuilderModal={this.showFormBuilderModal}
              moveTab={this.moveTab}
              ref="location_details_tab"
            />
          }
        </div>
  		</div>
  	)
  } else {
    return <Loading/>
  }

}