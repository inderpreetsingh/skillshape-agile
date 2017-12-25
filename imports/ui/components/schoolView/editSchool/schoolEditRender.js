import React from "react";
import { Loading } from '/imports/ui/loading';
import { browserHistory, Link } from 'react-router';
import { FormBuilderModal } from '/imports/ui/modal';
import ResponsiveTabs from '/imports/util/responsiveTabs';

//tab details import over here
// import SchoolDetails from './schoolDetails';
import LocationDetails from './locationDetails';
// import ClassTypeDetails from './classTypeDetails';
// import PriceDetails from './priceDetails';
// import Modules from './modules';
// import EmbedCodes from './embedCodes';
// import MediaDetails from './mediaDetails';


export default function (props) {
    console.log("school edit render state -->>",this.state);
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

    // this.checkSchoolAccess(currentUser, schoolId)

  	return (
  		<div>
            <FormBuilderModal
                {...formBuilderModal}
                {...this.props}
                ref={ref => this.formBuilderModal = ref}
            />
            <ResponsiveTabs
                tabs={["School Details","Location Details","Class Details", "Prices", "Media", "Embed Codes"]}
                color= "primary"
                onTabChange={this.onTabChange}
            />  
      		<div>
                {
                    this.state.tabValue === 1 &&  <LocationDetails
                      locationData={locationData}
                      schoolId={schoolId}
                      showFormBuilderModal={this.showFormBuilderModal}
                      moveTab={this.moveTab}
                      ref="location_details_tab"
                    />
                }
            </div>	
        {/*<div className="tab-content">
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
        </div>*/}
  		</div>
  	)
  } else {
    return <Loading/>
  }

}