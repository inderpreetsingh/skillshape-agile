import React from "react";
import DocumentTitle from "react-document-title";
import { Loading } from "/imports/ui/loading";
import { browserHistory, Link } from "react-router";
import { FormBuilderModal } from "/imports/ui/modal";
import ResponsiveTabs from "/imports/util/responsiveTabs";
import Typography from "material-ui/Typography";

// import Preloader from "/imports/ui/components/landing/components/Preloader.jsx";

//tab details import over here
import SchoolDetails from "./schoolDetails";
import LocationDetails from "./locationDetails";
import ClassTypeDetails from "./classTypeDetails";
import PriceDetails from "./priceDetails";
// import Modules from './modules';
import EmbedCodes from "./embedCodes";
import MediaDetails from "./mediaDetails";

export default function(props) {
  const { selecetdView, formBuilderModal } = this.state;

  let {
    schoolId,
    schoolData,
    currentUser,
    isUserSubsReady,
    locationData,
    moduleData,
    isLoading,
    ...editSchoolProps
  } = this.props;

  if (isLoading) {
    // return <Preloader />;
  }
  
  if (isUserSubsReady && schoolData) {
    // this.checkSchoolAccess(currentUser, schoolId)
    if (this.checkSchoolAccess(currentUser, schoolId)) {
      return (
        <DocumentTitle title={this.props.route.name}>
          <div id="editRender" style={{ overflow: "hidden" }}>
            <FormBuilderModal
              {...formBuilderModal}
              {...this.props}
              ref={ref => (this.formBuilderModal = ref)}
            />
            <ResponsiveTabs
              tabs={[
                "School Details",
                "Location Details",
                "Class Details",
                "Prices",
                "Media",
                "Embed Codes"
              ]}
              color="primary"
              onTabChange={this.onTabChange}
              tabValue={this.state.tabValue}
              queryTabValue={this.state.queryTabValue}
            />
            <div>
              {this.state.tabValue === 0 && (
                <SchoolDetails
                  schoolData={schoolData}
                  schoolId={schoolId}
                  moveTab={this.moveTab}
                  currentUser={currentUser}
                  route={this.props.route}
                  moveToNextTab={value => {
                    this.moveToNextTab(value);
                  }}
                />
              )}
              {this.state.tabValue === 1 && (
                <LocationDetails
                  locationData={locationData}
                  schoolId={schoolId}
                  showFormBuilderModal={this.showFormBuilderModal}
                  moveTab={this.moveTab}
                  ref="location_details_tab"
                  moveToNextTab={value => {
                    this.moveToNextTab(value);
                  }}
                  schoolData={schoolData}
                />
              )}
              {this.state.tabValue === 2 && (
                <ClassTypeDetails
                  locationData={locationData}
                  schoolId={schoolId}
                  showFormBuilderModal={this.showFormBuilderModal}
                  moveTab={this.moveTab}
                  moveToNextTab={value => {
                    this.moveToNextTab(value);
                  }}
                  schoolData={schoolData}
                />
              )}
              {this.state.tabValue === 3 && (
                <PriceDetails
                  schoolId={schoolId}
                  showFormBuilderModal={this.showFormBuilderModal}
                  moveTab={this.moveTab}
                  classTypeData={this.props.classTypeData}
                  schoolData={schoolData}
                />
              )}
              {this.state.tabValue === 4 && (
                <MediaDetails
                  schoolData={schoolData}
                  schoolId={schoolId}
                  moveTab={this.moveTab}
                  {...editSchoolProps}
                />
              )}
              {this.state.tabValue === 5 && (
                <EmbedCodes
                  schoolData={schoolData}
                  schoolId={schoolId}
                  moveTab={this.moveTab}
                />
              )}
            </div>
          </div>
        </DocumentTitle>
      );
    } else {
      return (
        <Typography type="display2" gutterBottom align="center">
          Access Denied!!!
        </Typography>
      );
    }
  } else {
    return <Loading />;
  }
}
