import { floor, isEmpty } from 'lodash';
import Typography from 'material-ui/Typography';
import React, { Fragment ,lazy,Suspense} from 'react';
import DocumentTitle from 'react-document-title';
import { Element } from 'react-scroll';
import styled from 'styled-components';
import SchoolViewNewBanner from '/imports/ui/componentHelpers/schoolViewBanner/schoolViewNewBanner.jsx';
import ClassTimeButton from '/imports/ui/components/landing/components/buttons/ClassTimeButton.jsx';
import StudentNotes from '/imports/ui/components/landing/components/class/details/StudentNotes.jsx';
const  PackagesList = lazy(()=>import('/imports/ui/components/landing/components/class/packages/PackagesList.jsx'))
import ReviewsManager from '/imports/ui/components/landing/components/class/reviews/ReviewsManager.jsx';
const  ClassTypeList = lazy(()=>import('/imports/ui/components/landing/components/classType/classTypeList.jsx'));
import { EmailUsDialogBox, EnrollmentPackagesDialogBox, GiveReviewDialogBox, NonUserDefaultDialogBox } from '/imports/ui/components/landing/components/dialogs/';
import NoMediaFound from '/imports/ui/components/landing/components/helpers/NoMediaFound.jsx';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';
const MediaDetails = lazy(()=>import('/imports/ui/components/schoolView/editSchool/mediaDetails'))
const  ManageMyCalendar = lazy(()=>import('/imports/ui/components/users/manageMyCalendar/index.js'));
import { ContainerLoader } from '/imports/ui/loading/container';
import { CustomModal } from '/imports/ui/modal';
import ConfirmationModal from '/imports/ui/modal/confirmationModal';
import { getAverageNoOfRatings, normalizeMonthlyPricingData } from '/imports/util';
import { Loading } from '/imports/ui/loading';



const Wrapper = styled.div`
  background: white;
  overflow-x: hidden;
`;



const GenericWrapper = styled.div`
  width: 100%;
  background: white;
`;

const GenericButtonWrapper = styled.div`

  @media screen and (max-width: ${helpers.mobile}px) {
    ${helpers.flexCenter}
    max-width: 300px;
    width: 100%;
    margin: 0 auto;
  }
`;


const GenericFixedWidthWrapper = GenericWrapper.extend`
  max-width: 1200px;
  margin: 0 auto;
`;

const ClassTypeListWrapper = GenericWrapper.extend`
  margin-bottom: ${helpers.rhythmDiv * 5}px;
 `;



const ReviewsWrapper = GenericWrapper.extend`
  margin-top: ${helpers.rhythmDiv * 4}px;
  margin-bottom: 0;
`;

const ReviewsInnerWrapper = GenericFixedWidthWrapper.extend`
  padding: ${helpers.rhythmDiv * 4}px;
  overflow: hidden;
  text-align: ${props => props.centerText ? 'center' : 'left'};
`;

const ReviewsButtonWrapper = GenericFixedWidthWrapper.extend`
  margin-top: ${props => props.marginTop}px;
  padding-bottom: ${helpers.rhythmDiv * 4}px;
  text-align: center;


  @media screen and (max-width: ${helpers.mobile}px) {
    ${helpers.flexCenter}
    flex-direction: column;
  }
`;


const SchoolExtraSection = GenericFixedWidthWrapper.extend`
  ${helpers.flexCenter}
  align-items: flex-start;
  margin-bottom: ${helpers.rhythmDiv * 6}px;
  padding: ${helpers.rhythmDiv * 2}px;

  @media screen and (max-width: ${helpers.tablet}px) {
    align-items: center;
    flex-direction: column;
  }
`;

const MediaWrapper = GenericWrapper.extend`
  padding-bottom: ${helpers.rhythmDiv}px;
  max-width: 502px;
`;

const NotesWrapper = GenericWrapper.extend`
  max-width: 474px;
  padding: 0 ${helpers.rhythmDiv * 2}px;
  margin-right: ${helpers.rhythmDiv * 3}px;

  @media screen and (max-width: ${helpers.tablet}px) {
    margin-right: 0;
    margin-bottom: ${helpers.rhythmDiv * 4}px;
  }
`;

const PackagesWrapper = GenericWrapper.extend`
  ${helpers.flexDirectionColumn}
  margin-bottom: ${props => props.marginBottom}px;
`;

const MyCalendarWrapper = GenericFixedWidthWrapper.extend`
  padding: 0 ${helpers.rhythmDiv * 2}px;
  margin-bottom: ${helpers.rhythmDiv * 8}px;
`;

const PricingSection = styled.div`
  margin-top: ${helpers.rhythmDiv * 4}px;
  margin-bottom: ${helpers.rhythmDiv * 6}px;
`;

const ButtonWrapper = GenericButtonWrapper.extend`
  ${helpers.flexCenter}
  width: 100%;
  padding: 0 ${helpers.rhythmDiv * 2}px;
`;



// Texts
const SectionTitle = styled.h2`
  font-size: ${helpers.baseFontSize * 2}px;
  font-family: ${helpers.specialFont};
  font-style: italic;
  font-weight: 300;
  text-align: center;
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  padding: 0 ${helpers.rhythmDiv * 2}px;
`;






export default function () {
  const {
    schoolData,
    reviewsData,
    classPricing,
    monthlyPricing,
    schoolLocation,
    classType,
    currentUser,
    schoolId,
    classes,
    enrollmentFee,
    showLoading,
    currency,
    params
  } = this.props;

  const {
    claimSchoolModal,
    claimRequestModal,
    successModal,
    loadComplete
  } = this.state;

 

  if (isEmpty(schoolData) && !showLoading ) {
    return <Typography type="display2" gutterBottom align="center">
      School not found!!!
        </Typography>
  } else {
    return (
      <DocumentTitle title={this.props.routeParams.slug}>
        <Wrapper className="content">
          {
            this.state.isLoading && <ContainerLoader />
          }
          {this.state.emailUsDialog && <EmailUsDialogBox
            ourEmail={schoolData.email}
            schoolData={schoolData}
            open={this.state.emailUsDialog}
            onModalClose={() => this.handleDialogState('emailUsDialog', false)} />}
          {this.state.giveReviewDialog && <GiveReviewDialogBox reviewForId={schoolId} reviewFor='school' title={this.getReviewTitle(schoolData.name)} open={this.state.giveReviewDialog} onModalClose={() => this.handleDialogState('giveReviewDialog', false)} />}
          {this.state.nonUserDefaultDialog && <NonUserDefaultDialogBox title={this.state.defaultDialogBoxTitle} open={this.state.nonUserDefaultDialog} onModalClose={() => this.handleDefaultDialogBox('', false)} />}
          {this.state.manageRequestsDialog && <ManageRequestsDialogBox
            title="Pricing"
            open={this.state.manageRequestsDialog}
            onModalClose={() => this.handleDialogState('manageRequestsDialog', false)}
            requestFor="price"
            schoolData={schoolData}
            onToastrClose={() => this.handleDialogState('manageRequestsDialog', false)}
          />}
          {
            this.state.enrollmentPackagesDialog &&
            <EnrollmentPackagesDialogBox
              open={this.state.enrollmentPackagesDialog}
              schoolId={schoolId}
              onAddToCartIconButtonClick={this.handlePurchasePackage}
              onModalClose={() => {
                this.setState(state => {
                  return {
                    ...state,
                    enrollmentPackagesDialog: false,
                    selectedClassTypeIds: null
                  }
                })
              }}
              classTypeIds={this.state.selectedClassTypeIds}
              epData={this.state.epData}
              currentPackageData={this.state.currentPackageData}
            />
          }
          {
            this.state.showConfirmationModal && <ConfirmationModal
              open={this.state.showConfirmationModal}
              submitBtnLabel="Request pricing"
              cancelBtnLabel="Cancel"
              message="No prices have been added by the school. Please click this button to request the school complete their pricing info?"
              onSubmit={() => { this.requestPricingInfo(schoolData) }}
              onClose={this.cancelConfirmationModal}
            />
          }
          {(claimSchoolModal || claimRequestModal || successModal) && <CustomModal
            className={successModal ? "success-modal" : "info-modal"}
            title={this.getClaimSchoolModalTitle()}
            message={successModal && `You are now owner of ${schoolData.name} Would you like to edit ?`}
            onClose={this.modalClose}
            onSubmit={this.modalSubmit}
            closeBtnLabel={successModal ? "Continue" : "No"}
            submitBtnLabel={"Yes"}
          />
          }
          <div>
         
            <SchoolViewNewBanner
              schoolData={schoolData}
              schoolId={schoolId}
              isPublish={schoolData.isPublish}
              currentUser={currentUser}
              schoolLocation={schoolLocation}
              isEdit={false}
              bestPriceDetails={{
                monthly: this.state.bestPriceDetails && !isEmpty(this.state.bestPriceDetails.bestMonthlyPrice) ? floor(this.state.bestPriceDetails.bestMonthlyPrice.avgRate) : null,
                class: this.state.bestPriceDetails && !isEmpty(this.state.bestPriceDetails.bestClassPrice) ? floor(this.state.bestPriceDetails.bestClassPrice.avgRate) : null
              }}
              reviewsStats={{
                noOfRatings: getAverageNoOfRatings(reviewsData),
                noOfReviews: reviewsData.length
              }}
              handlePublishStatus={this.handlePublishStatus.bind(this, schoolId)} /> {/* container, school-header ends */}

            {/* Reviews List */}
            <ReviewsWrapper>
              {!isEmpty(reviewsData) && (<ReviewsInnerWrapper>
                <ReviewsManager reviewsData={reviewsData} padding={helpers.rhythmDiv * 2} />
              </ReviewsInnerWrapper>)}

              <ReviewsButtonWrapper marginTop={isEmpty(reviewsData) ? "64" : "0"}>
                {isEmpty(reviewsData) && <Fragment><Typography>
                  You are the first one to write review for this school.
              </Typography>
                  <br /></Fragment>}
                <GenericButtonWrapper>
                  <ClassTimeButton
                    icon
                    onClick={this.handleGiveReview}
                    iconName="rate_review"
                    label="Give review"
                  />
                </GenericButtonWrapper>
              </ReviewsButtonWrapper>
            </ReviewsWrapper>
            {/* Cards List Section*/}
            
            <ClassTypeListWrapper>
            <Suspense fallback={<Loading/>}>
             {loadComplete &&  <ClassTypeList
                containerPaddingTop="0px"
                locationName={null}
                mapView={false}
                filters={{ schoolId: schoolId, limit: this.state.seeMoreCount }}
                splitByCategory={false}
                classTypeBySchool='classTypeBySchool'
                handleSeeMore={this.handleSeeMore}
                schoolView={true}
                params={params}
              />}
              </Suspense>
            </ClassTypeListWrapper>
            {/* Calendar Section*/}
            <MyCalendarWrapper ref={(el) => { this.schoolCalendar = el; }}>
              <Element name="schedule-section">
            <Suspense fallback={<Loading/>}>
            {loadComplete && <ManageMyCalendar schoolCalendar={true} {...this.props} />}
                </Suspense>
              </Element>
            </MyCalendarWrapper>
            {/* School Extra Section -- Notes & Media*/}
            <SchoolExtraSection>
              {this.checkForHtmlCode(schoolData.studentNotesHtml) && <NotesWrapper>
                <StudentNotes noClassTypeData notes={schoolData.studentNotesHtml} />
              </NotesWrapper>}
              <MediaWrapper>
            <Suspense fallback={<Loading/>}>
            {loadComplete && <MediaDetails
                  noMediaFound={<NoMediaFound
                    schoolName={schoolData.name}
                    siteLink={schoolData.website}
                    onEmailButtonClick={() => this.handleDialogState('emailUsDialog', true)} />}
                  schoolId={schoolId}
                  schoolView={true}
                />}
                </Suspense>
                {/*<Card className={classes.content}> </Card>*/}
              </MediaWrapper>
            </SchoolExtraSection>
            {/* Pricing Section*/}
            <PricingSection ref={(el) => { this.schoolPrice = el; }}>
              <Element name="price-section">
                <SectionTitle>Pay only for what you want.</SectionTitle>
                {(enrollmentFee && enrollmentFee.length == 0) && (classPricing && classPricing.length == 0) && (monthlyPricing && monthlyPricing.length == 0) ?
                  <ButtonWrapper>
                    <ClassTimeButton
                      onClick={this.handlePricingRequest}
                      icon
                      iconName="attach_money"
                      label="Request pricing info" />
                  </ButtonWrapper> : ''}
                <PackagesWrapper>
                  {(isEmpty(classPricing) && isEmpty(monthlyPricing)) ?
                    '' :
            <Suspense fallback={<Loading/>}>
            {loadComplete && <PackagesList
                      schoolId={schoolId}
                      onAddToCartIconButtonClick={this.handlePurchasePackage}
                      enrollMentPackages
                      enrollMentPackagesData={enrollmentFee}
                      perClassPackagesData={classPricing}
                      monthlyPackagesData={normalizeMonthlyPricingData(monthlyPricing)}
                      currency={currency}

                    />}
                    </Suspense>
                  }
                </PackagesWrapper>
              </Element>
            </PricingSection>
            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-content">
                    <div className="">
                      <div className="thumb about-school-top">
                        <figure className="about-head-image">
                          <div className="overlay-box"></div>
                        </figure>
                        <div className="col-md-12">

                        </div>
                        <div className="col-md-12">
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <div className="col-sm-12">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Wrapper>
      </DocumentTitle>
    )
  }
}
