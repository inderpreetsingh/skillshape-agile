import Typography from "material-ui/Typography";
import React from "react";
import DocumentTitle from "react-document-title";
import { browserHistory } from "react-router";
import ClassTypeDetails from "./classTypeDetails";
// import Modules from './modules';
import EmbedCodes from "./embedCodes";
import LocationDetails from "./locationDetails";
import MediaDetails from "./mediaDetails";
import PriceDetails from "./priceDetails";
// import Preloader from "/imports/ui/components/landing/components/Preloader.jsx";
//tab details import over here
import SchoolDetails from "./schoolDetails";
import SchoolMemberView from "/imports/ui/components/schoolMembers";
import { Loading } from "/imports/ui/loading";
import { FormBuilderModal } from "/imports/ui/modal";
import ResponsiveTabs from "/imports/util/responsiveTabs";
import Financial from "/imports/ui/components/financials";
export default function (props) {
  const { selecetdView, formBuilderModal } = this.state;
  
  let {
    schoolId,
    schoolData,
    currency,
    currentUser,
    isUserSubsReady,
    locationData,
    moduleData,
    isLoading,
    ...editSchoolProps
  } = this.props;
  let slug;
  if(schoolData){
    slug=schoolData.slug;
  }
  if (isLoading) {
    // return <Preloader />;
  }

  if (schoolData) {
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
                "Embed Codes",
                "Students",
                "Admins",
                "Financial",
                "View School"
              ]}
              color="primary"
              onTabChange={this.onTabChange}
              tabValue={this.state.tabValue}
              queryTabValue={this.state.queryTabValue}
            />
            <div>
              {this.state.tabValue === 0 && (
                <SchoolDetails
                  currency={currency}
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
                  currency={currency}
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
                  currency={currency}
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
                  currency={currency}
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
              {
                this.state.tabValue === 6 &&(
                  <SchoolMemberView
                  slug = {slug}
                  currentUser = {currentUser}
                  isUserSubsReady = {isUserSubsReady}
                  admin = {false}
                  />
                )
              }
              {
                this.state.tabValue === 7 &&(
                  <SchoolMemberView
                  slug = {slug}
                  currentUser = {currentUser}
                  isUserSubsReady = {isUserSubsReady}
                  admin = {true}
                  />
                )
              }
              {
                this.state.tabValue === 8 && (
                  <Financial
                  currentUser = {currentUser}
                  slug = {slug}
                  />
                )
              }
               {
                this.state.tabValue === 9 &&(
                  browserHistory.push(`/schools/${slug}`)
                )
              }
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
