import React, { lazy, Suspense } from "react";
import { browserHistory } from "react-router";
import { ContainerLoader } from "/imports/ui/loading/container";
import { FormBuilderModal } from "/imports/ui/modal";
import {handleIsSavedState} from '/imports/util';
const DocumentTitle = lazy(() => import("react-document-title"));
const ClassTypeDetails = lazy(() => import("./classTypeDetails"));
const EmbedCodes = lazy(() => import("./embedCodes"));
const LocationDetails = lazy(() => import("./locationDetails"));
const MediaDetails = lazy(() => import("./mediaDetails"));
const PriceDetails = lazy(() => import("./priceDetails"));
const ContractRequests = lazy(() => import('./contractRequests'));
const SchoolDetails = lazy(() => import("./schoolDetails"));
const Settings = lazy(()=>import("./settings"));
const MyTransaction = lazy(()=>import("/imports/ui/components/users/myTransaction"))
const SchoolMemberView = lazy(() => import("/imports/ui/components/schoolMembers"));
const ResponsiveTabs = lazy(() => import("/imports/util/responsiveTabs"));
export default function (props) {
  const { formBuilderModal,isSaved } = this.state;
  
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
                "View School",
                "Requests",
                "Transactions",
                "Settings"
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
                  isSaved= {isSaved}
                  handleIsSavedState = {(isSaved)=>{handleIsSavedState.call(this,isSaved)}}
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
                  isSaved= {isSaved}
                  handleIsSavedState = {(isSaved)=>{handleIsSavedState.call(this,isSaved)}}
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
                  isSaved= {isSaved}
                  handleIsSavedState = {(isSaved)=>{handleIsSavedState.call(this,isSaved)}}
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
                  isSaved= {isSaved}
                  handleIsSavedState = {(isSaved)=>{handleIsSavedState.call(this,isSaved)}}
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
                this.state.tabValue === 8 &&(
                  browserHistory.push(`/schools/${slug}`)
                )
              }
               {
                this.state.tabValue === 9 &&(
                  <ContractRequests
                  schoolData= {schoolData}
                  currentUser = {currentUser}
                  />
                )
              }
              {
                this.state.tabValue === 10 &&(
                  <MyTransaction
                  schoolView = {true}
                  schoolData = {schoolData}
                  />
                )
              }
              {
                this.state.tabValue === 11 &&(
                  <Settings
                  schoolData = {schoolData}
                />
                )
              }
            </div>
        </Suspense>
          </div>
        </DocumentTitle>
        </Suspense>
      );
   
}
