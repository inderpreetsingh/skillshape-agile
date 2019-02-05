import React, { lazy, Suspense } from "react";
const Typography = lazy(() => import("material-ui/Typography"));
const DocumentTitle = lazy(() => import("react-document-title"));
const ClassTypeDetails = lazy(() => import("./classTypeDetails"));
const EmbedCodes = lazy(() => import("./embedCodes"));
const LocationDetails = lazy(() => import("./locationDetails"));
const MediaDetails = lazy(() => import("./mediaDetails"));
const PriceDetails = lazy(() => import("./priceDetails"));
const ContractRequests = lazy(() => import('./contractRequests'));
const SchoolDetails = lazy(() => import("./schoolDetails"));
const SchoolMemberView = lazy(() => import("/imports/ui/components/schoolMembers"));
const ResponsiveTabs = lazy(() => import("/imports/util/responsiveTabs"));
const Financial = lazy(() => import("/imports/ui/components/financials"));
import { ContainerLoader } from "/imports/ui/loading/container";
import { FormBuilderModal } from "/imports/ui/modal";
import { browserHistory } from "react-router";
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
    userId,
    ...editSchoolProps,
  } = this.props;
  let slug;
  if(schoolData){
    slug=schoolData.slug;
  }
  if (schoolData) {
    // this.checkSchoolAccess(currentUser, schoolId)
    if (this.checkSchoolAccess(currentUser, schoolId)) {
      return (
        <Suspense fallback={ <ContainerLoader />}>
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
                "View School",
                "Requests"
              ]}
              color="primary"
              onTabChange={this.onTabChange}
              tabValue={this.state.tabValue}
              queryTabValue={this.state.queryTabValue}
            />
        <Suspense fallback={ <ContainerLoader />}>
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
                  view = {'classmates'}
                  userId = {userId}
                  />
                )
              }
              {
                this.state.tabValue === 7 &&(
                  <SchoolMemberView
                  slug = {slug}
                  currentUser = {currentUser}
                  isUserSubsReady = {isUserSubsReady}
                  view = {"admin"}
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
               {
                this.state.tabValue === 10 &&(
                  <ContractRequests
                  schoolData= {schoolData}
                  currentUser = {currentUser}
                  />
                )
              }
            </div>
        </Suspense>
          </div>
        </DocumentTitle>
        </Suspense>
      );
    } else {
      return (
        <Typography type="display2" gutterBottom align="center">
          Access Denied!!!
        </Typography>
      );
    }
  } else {
    return <ContainerLoader />;
  }
}
