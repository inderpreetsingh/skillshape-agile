import React from "react";
import { Loading } from '/imports/ui/loading';
import { browserHistory, Link } from 'react-router';
import { FormBuilderModal } from '/imports/ui/modal';

//tab details import over here
import SchoolDetails from './schoolDetails';
import LocationDetails from './locationDetails';
import ClassTypeDetails from './classTypeDetails';
import PriceDetails from './priceDetails';
import Modules from './modules';
import EmbedCodes from './embedCodes';
import MediaDetails from './mediaDetails';


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
    classTypeData,
    moduleData,
    ...editSchoolProps
  } = this.props;

  if(isUserSubsReady && schoolData) {

    this.checkSchoolAccess(currentUser, schoolId)

  	return (
  		<div>
          <FormBuilderModal
            {...formBuilderModal}
            {...this.props}
            ref={ref => this.formBuilderModal = ref}
          />
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
                <b>class Type Details</b>
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
                ref="embed_codes" 
                onClick={()=> { this.setState({selecetdView: "embed_codes"})}} 
                data-toggle="tab" 
                aria-expanded="true" 
                className="remove-radius validate"
              >
                <b>Embed Codes</b>
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
              schoolId={schoolId}
              showFormBuilderModal={this.showFormBuilderModal}
              moveTab={this.moveTab}
              ref="location_details_tab"
            />
          }
          {
            (selecetdView === "class_type_details") && <ClassTypeDetails
              classTypeData={classTypeData}
              locationData={locationData}
              schoolId={schoolId}
              showFormBuilderModal={this.showFormBuilderModal}
              moveTab={this.moveTab}
            />
          }
          {
            (selecetdView === "modules") && <Modules
              moduleData={moduleData}
              schoolId={schoolId}
              showFormBuilderModal={this.showFormBuilderModal}
              moveTab={this.moveTab}
            />
          }
          {
            (selecetdView === "prices_details") && <PriceDetails
              schoolId={schoolId}
              showFormBuilderModal={this.showFormBuilderModal}
              moveTab={this.moveTab}
            />
          }
          {
            (selecetdView === "embed_codes") && <EmbedCodes
              schoolData={schoolData}
              schoolId={schoolId}
              moveTab={this.moveTab}
            />
          }
          {
            (selecetdView === "media_details") && <MediaDetails
              schoolData={schoolData}
              schoolId={schoolId}
              moveTab={this.moveTab}
              {...editSchoolProps}
            />
          }
        </div>
  		</div>
  	)
  } else {
    return <Loading/>
  }

}