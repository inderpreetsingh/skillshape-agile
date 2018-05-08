import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import DocumentTitle from 'react-document-title';
import {Element, scroller } from 'react-scroll';
import { isEmpty, get } from 'lodash';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import { getAverageNoOfRatings , toastrModal } from '/imports/util';
import withImageExists from '/imports/util/withImageExists.js';
import { classTypeImgSrc } from '/imports/ui/components/landing/site-settings.js';
import { ContainerLoader } from '/imports/ui/loading/container.js';

import CallUsDialogBox from '/imports/ui/components/landing/components/dialogs/CallUsDialogBox.jsx';
import EmailUsDialogBox from '/imports/ui/components/landing/components/dialogs/EmailUsDialogBox.jsx';
import GiveReviewDialogBox from '/imports/ui/components/landing/components/dialogs/GiveReviewDialogBox.jsx';
import NonUserDefaultDialogBox from '/imports/ui/components/landing/components/dialogs/NonUserDefaultDialogBox.jsx';
import ManageRequestsDialogBox from '/imports/ui/components/landing/components/dialogs/ManageRequestsDialogBox.jsx';

import reviewsData from '/imports/ui/components/landing/constants/reviewsData.js';
import ReviewsManager from '/imports/ui/components/landing/components/class/reviews/ReviewsManager.jsx';
import Preloader from '/imports/ui/components/landing/components/Preloader.jsx';
import ClassTypeCover from '/imports/ui/components/landing/components/class/cover/ClassTypeCover.jsx';
import ClassTypeCoverContent from '/imports/ui/components/landing/components/class/cover/ClassTypeCoverContent.jsx';
import ClassTimesBoxes from '/imports/ui/components/landing/components/classTimes/ClassTimesBoxes';
import PackagesList from '/imports/ui/components/landing/components/class/packages/PackagesList.jsx';
import SchoolDetails from '/imports/ui/components/landing/components/class/details/SchoolDetails.jsx';
import MyCalendar from '/imports/ui/components/users/myCalender';
import ManageMyCalendar from '/imports/ui/components/users/manageMyCalendar/index.js';

import PrimaryButton from '/imports/ui/components/landing/components/buttons/PrimaryButton';
import ClassTimeButton from '/imports/ui/components/landing/components/buttons/ClassTimeButton';

import { capitalizeString } from '/imports/util';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';
import { getUserFullName } from '/imports/util/getUserData';
import { openMailToInNewTab } from '/imports/util/openInNewTabHelpers';

const imageExistsConfig = {
  originalImagePath: 'classTypeData.classTypeImg',
  defaultImage: classTypeImgSrc
}

const SchoolImgWrapper = styled.div`
  height: 400px;
`;

const SchoolImg = styled.img`
  width: 100%;
  height: 100%;
`;

const PreloaderWrapper = styled.div`
  ${helpers.flexCenter};
  height: calc(100vh - 282px); // 212 for footer + 70 for top bar.
`;

const Main = styled.main`
  width: 100%;

  @media screen and (max-width: ${helpers.mobile}px) {
    overflow: hidden;
  }
`;


const MainInnerFixedContainer = styled.div`
  max-width: ${props => props.fixedWidth ? props.fixedWidth : helpers.maxContainerWidth}px;
  width: 100%;
  margin: 0 auto;
  margin-top: ${props => props.marginTop}px;
  margin-bottom: ${props => props.marginBottom ? props.marginBottom : helpers.rhythmDiv * 2}px;
`;

const MainInner = styled.div`
  padding: ${props => props.largePadding ? props.largePadding : helpers.rhythmDiv * 2}px;
  overflow: ${props => (props.reviews || props.classTimes) ? 'hidden' : 'initial' };

  @media screen and (max-width : ${helpers.mobile}px) {
    padding: ${props => props.smallPadding ? props.smallPadding : helpers.rhythmDiv * 2}px;
  }
`;

const ClassTypeDetailsWrapper = styled.div`
  ${helpers.flexDirectionColumn}
`;

const DescriptionText = styled.p`
  font-family: ${helpers.commonFont};
  font-size: ${helpers.baseFontSize}px;
  line-height: 1;
`;

const ClassWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;

  @media screen and (max-width: ${helpers.mobile + 100}px) {
    padding-bottom: ${props => props.paddingBottom ? props.paddingBottom: 0}px;
  }
`;

const ClassTimesWrapper = styled.div`
  padding-bottom: ${helpers.rhythmDiv * 4}px;

  @media screen and (max-width: ${helpers.mobile + 100}px) {
    padding-bottom: ${props => props.paddingBottom}px;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    padding-bottom: ${helpers.rhythmDiv * 4}px;
  }
`;

const ClassTimesInnerWrapper = styled.div`
  padding: 0px;
  overflow: hidden;

  @media screen and (max-width : ${helpers.mobile}px) {
    padding: ${props => props.smallPadding ? props.smallPadding : helpers.rhythmDiv * 2}px;
    padding-top: 0;
  }
`;

const ClassTimesTitle = styled.h2`
  text-align: center;
  font-size: ${helpers.baseFontSize * 2}px;
  font-family: ${helpers.specialFont};
  font-weight: 300;
  font-style: italic;
  line-height: 1;
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  padding: 0;

  @media screen and (max-width: ${helpers.mobile + 100}px) {
    margin-bottom: ${helpers.rhythmDiv * 4}px;
  }
`;

const ClassTimesName = styled.span`
  text-transform: capitalize;
`;

const PackagesWrapper = styled.div`
  ${helpers.flexDirectionColumn}
  width: 100%;
  margin-bottom: ${props => props.marginBottom}px;
`;

const PackagesTitle = styled.h2`
  text-align: center;
  font-size: ${helpers.baseFontSize * 2}px;
  font-family: ${helpers.specialFont};
  font-weight: 300;
  font-style: italic;
  margin: 0;
  line-height: 1;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  padding: 0 ${helpers.rhythmDiv * 2}px;
`;

const CalendarWrapper = styled.div`
   padding: 0 ${helpers.rhythmDiv * 2}px;
`;

const ClassContainer = styled.div`
  width: 90%;
  padding: 0 ${helpers.rhythmDiv}px;
  margin: 0px auto;
  border-radius: ${helpers.rhythmDiv}px;
  background: #ffffff;
  text-align: center;
  margin-top: ${props => props.marginTop}px;
  margin-bottom: ${props => props.marginBottom}px;
  padding-bottom: ${props => props.paddingBottom}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    ${helpers.flexCenter}
    flex-direction: column;
    padding-bottom: ${props => props.smallPadding ? props.smallPadding : props.paddingBottom}px;
  }
`;

const GenericButtonWrapper = styled.div`

  @media screen and (max-width: ${helpers.mobile}px) {
    ${helpers.flexCenter}
    max-width: 300px;
    width: 100%;
  }
`;


class ClassTypeContent extends Component {

    state = {
      isBusy: false,
      emailUsDialog: false,
      callUsDialog: false,
      giveReviewDialog: false,
      manageRequestsDialog: false,
      nonUserDefaultDialog: false,
      defaultDialogBoxTitle: '',
      type: "both",
      classTimesData: [],
      myClassTimes: [],
      manageAll: true,
      attendAll: true,
      filter: {
        classTimesIds: [],
        classTimesIdsForCI: [],
      },
    }

    _setDefaultDialogBoxTitle = (title) => {
      const newState = {...this.state, defaultDialogBoxTitle : title};
      this.setState(newState);
    }

    getContactNumbers = () => {
      return this.props.schoolData.phone && this.props.schoolData.phone.split(/[\|\,\\]/);
    }

    getOurEmail = () => {
      return this.props.schoolData.email;
    }

    handleEmailUsButtonClick = () => {
      this.handleDialogState('emailUsDialog',true);
    }

    handleCallUsButtonClick = () => {
      this.handleDialogState('callUsDialog',true);
    }

    handleDialogState = (dialogName,state, event, errorMessage, resMessage) => {
      const newState = {...this.state};
      newState[dialogName] = state;
      this.setState(newState);
      const { toastr } = this.props;
      if(resMessage) {
        toastr.success(resMessage, "Success");
      }
    }

    normalizeMonthlyPricingData = (monthlyPricingData) => {
      if(monthlyPricingData) {
        let normalizedMonthlyPricingData = [];

        for(let monthlyPricingObj of monthlyPricingData) {
            monthlyPricingObj.pymtDetails.forEach(payment => {
              const myMonthlyPricingObj = Object.assign({},monthlyPricingObj);
              myMonthlyPricingObj.pymtDetails = [];
              myMonthlyPricingObj.pymtDetails.push(payment);
              normalizedMonthlyPricingData.push(myMonthlyPricingObj);
            });
        }

        return normalizedMonthlyPricingData;
      }else{
        return monthlyPricingData;
      }
    }

    scrollTo(name) {
      scroller.scrollTo((name || 'content-container'),{
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart'
      })
    }

    requestPricingInfo = (text) => {
        const { toastr, schoolData } = this.props;
        this.handleDialogState('manageRequestsDialog',true);
        // if(!isEmpty(schoolData)) {
        //   let emailBody = "";
        //   let url = `${Meteor.absoluteUrl()}schools/${schoolData.slug}`
        //   let subject ="", message =  "";
        //   let currentUserName = getUserFullName(Meteor.user());
        //   emailBody = `Hi, %0D%0A%0D%0A I saw your listing on SkillShape.com ${url} and would like to attend. Can you update your ${text ? text : pricing}%3F %0D%0A%0D%0A Thanks`
        //   const mailTo = `mailto:${this.getOurEmail()}?subject=${subject}&body=${emailBody}`;
        //
        //   console.info(mailTo,"my mail To data.............");
        //   // const mailToNormalized = encodeURI(mailTo);
        //   // window.location.href = mailToNormalized;
        //   openMailToInNewTab(mailTo);
        //
        // } /*else {
            // this.handleDefaultDialogBox('Login to make price package requests',true);
        // }*/
    }

    handleRequest = (text) => {
      const { toastr, schoolData } = this.props;

      if(!isEmpty(schoolData)) {
        let emailBody = "";
        let url = `${Meteor.absoluteUrl()}schools/${schoolData.slug}`
        let subject ="", message =  "";
        let currentUserName = getUserFullName(Meteor.user());
        emailBody = `Hi %0D%0A%0D%0A I saw your listing on SkillShape.com ${url} and would like to attend. Can you update your ${text ? text : pricing}%3F %0D%0A%0D%0A Thanks`
        const mailTo = `mailto:${this.getOurEmail()}?subject=${subject}&body=${emailBody}`;

        console.info(mailTo,"my mail To data.............");
        // const mailToNormalized = encodeURI(mailTo);
        // window.location.href = mailToNormalized;
        openMailToInNewTab(mailTo);

      }
    }

    handleClassTimeRequest = () => {
        // const { toastr, classTypeData } = this.props;
        // Handle Class time request using mailTo:
        this.handleRequest('Class Times');
        // COMMENTED OUT BECAUSE NOW WE HAVE CHNAGED THIS REQUEST WITH MAILTO.
        // if(Meteor.userId() && !isEmpty(classTypeData)) {
        //     this.setState({ isBusy:true });

        //     const payload = {
        //         schoolId: classTypeData.schoolId,
        //         classTypeId: classTypeData._id,
        //         classTypeName: classTypeData.name,
        //     }

        //     Meteor.call("classTimesRequest.notifyToSchool", payload, (err, res) => {
        //         console.log("err -->>",err)
        //         this.setState({ isBusy: false }, () => {
        //             if(res && res.emailSuccess) {
        //                 // Need to show message to user when email is send successfully.
        //                 toastr.success("Your email has been sent. We will assist you soon.", "Success");
        //             }
        //             if(res && res.message) {
        //                 toastr.error(res.message,"Error");
        //             }
        //         })
        //     })
        // } else {
        //     // toastr.error("You need to login for classTimes request!!!!","Error");
        //     this.handleDefaultDialogBox('Login to make class time requests',true);
        // }
    }

    handleDefaultDialogBox = (title, state) => {
      const newState = {...state, defaultDialogBoxTitle: title, nonUserDefaultDialog: state};
      this.setState(newState);
    }

    handleGiveReview = () => {
      const {toastr} = this.props;
      if(Meteor.userId()) {
        this.handleDialogState('giveReviewDialog',true);
      }else {
        this.handleDefaultDialogBox('Login to give review',true);
      }
    }


    getReviewTitle = (name) => {
      return `Give review for ${capitalizeString(name)}`;
    }

    componentDidMount = () => {
      document.title =  this.props.classTypeData ? this.props.classTypeData.name : this.props.params.classTypeName;
    }

    componentDidUpdate = () => {
      // Need to directly set the document title somehow Document title is being overriden with the value from name prop of the react router
      setTimeout(() => {
        document.title = this.props.classTypeData ? this.props.classTypeData.name : this.props.params.classTypeName;
      });
    }

	render() {
		// console.log("ClassTypeContent props --->>",this.props);

		const {
      bgImg,
			isLoading,
			schoolData,
			classTypeData,
			classTimesData,
      classPricingData,
      monthlyPricingData,
      enrollmentFeeData,
      mediaData,
      reviewsData,
      classInterestData
		} = this.props;

		if(isLoading) {
			return <PreloaderWrapper><Preloader/></PreloaderWrapper>
		}

		if(isEmpty(classTypeData)) {
			return <Typography type="display2" gutterBottom align="center">
            	Class Type not found!!!
        	</Typography>
		}

    const ourEmail = this.getOurEmail();
    const emailUsButton = ourEmail ? true : false;
    const isReviewsDataEmpty = isEmpty(reviewsData);
		return (<div>
          {this.state.callUsDialog && <CallUsDialogBox contactNumbers={this.getContactNumbers()} open={this.state.callUsDialog} onModalClose={() => this.handleDialogState('callUsDialog',false)}/>}
          {this.state.emailUsDialog && <EmailUsDialogBox schoolData={schoolData} ourEmail={ourEmail} open={this.state.emailUsDialog} currentUser={this.props.currentUser} onModalClose={(err, res) => this.handleDialogState('emailUsDialog',false, err, res)}/>}
          {this.state.giveReviewDialog && <GiveReviewDialogBox title={this.getReviewTitle(classTypeData && classTypeData.name)} reviewFor='class' reviewForId={classTypeData._id} open={this.state.giveReviewDialog} onModalClose={() => this.handleDialogState('giveReviewDialog',false)} />}
          {this.state.nonUserDefaultDialog && <NonUserDefaultDialogBox title={this.state.defaultDialogBoxTitle} open={this.state.nonUserDefaultDialog} onModalClose={() => this.handleDefaultDialogBox('',false)} />}
          {this.state.manageRequestsDialog && <ManageRequestsDialogBox
            title="Pricing"
            open={this.state.manageRequestsDialog}
            onModalClose={() => this.handleDialogState('manageRequestsDialog',false)}
            requestFor="price"
            schoolData={schoolData}
            classTypeId={classTypeData._id}
            onToastrClose={() => this.handleDialogState('manageRequestsDialog',false)}
            />}
          {this.state.isBusy && <ContainerLoader/>}

          {/* Class Type Cover includes description, map, foreground image, class type information*/}
		        <ClassTypeCover coverSrc={bgImg}>
			        <ClassTypeCoverContent
			        	coverSrc={bgImg}
		            schoolDetails={{...schoolData}}
		            classTypeData={{...classTypeData}}
                contactNumbers={this.getContactNumbers()}
                actionButtonProps={{
                  emailUsButton: emailUsButton,
                  onCallUsButtonClick: this.handleCallUsButtonClick,
                  onEmailButtonClick: this.handleEmailUsButtonClick,
                  onPricingButtonClick: () => this.scrollTo('price-section')
                }}
                reviews={{
                  noOfRatings: getAverageNoOfRatings(reviewsData),
                  noOfReviews: reviewsData.length
                }}
			        />
		        </ClassTypeCover>
		        <Main>
			        <MainInnerFixedContainer marginTop={isReviewsDataEmpty ? "0" : "32"} marginBottom={64}>
			            {!isReviewsDataEmpty && (<MainInner reviews largePadding="32" smallPadding="32">
                        <ClassWrapper reviews>
                          <ReviewsManager reviewsData={reviewsData} />
                        </ClassWrapper>
                    </MainInner>)}

                  <ClassContainer marginTop={isReviewsDataEmpty ? "64" : "0"} marginBottom="32">
                    {isReviewsDataEmpty && <Fragment><Typography>
                      You are the first one to write review for this class.
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
                    </ClassContainer>
          			</MainInnerFixedContainer>

          			<MainInnerFixedContainer>
			            <ClassTimesInnerWrapper>
			                <ClassTimesWrapper paddingBottom="48">
			                	<ClassTimesTitle>Class times for <ClassTimesName>{classTypeData && classTypeData.name.toLowerCase()}</ClassTimesName></ClassTimesTitle>
			                	{
                            isEmpty(classTimesData) ? (
                                <ClassContainer paddingBottom="16" smallPadding="0">
                                    <Typography caption="p">
                                        No class times have been given by the school. Please click this button to request the school complete their listing.
                                    </Typography>
                                    <br>
                                    </br>
                                    <GenericButtonWrapper>
                                      <ClassTimeButton
                                          icon
                                          onClick={this.handleClassTimeRequest}
                                          iconName="perm_contact_calendar"
                                          label="Request class times"
                                      />
                                    </GenericButtonWrapper>
                                </ClassContainer>
                            ) : (
                                <ClassTimesBoxes
                                  classTimesData={classTimesData}
                                  classInterestData={ classInterestData}
                                />
                            )
                          }
			                </ClassTimesWrapper>
			            </ClassTimesInnerWrapper>
			        </MainInnerFixedContainer>

              <Element name="price-section">
                <PackagesWrapper marginBottom={isEmpty(classPricingData) && isEmpty(monthlyPricingData) ? helpers.rhythmDiv * 4 : helpers.rhythmDiv * 8 }>
                    <PackagesTitle>Pay only for what you need</PackagesTitle>
                    {
                        (isEmpty(classPricingData) && isEmpty(monthlyPricingData)) ? (
                            <ClassContainer paddingBottom="32">
                                <Typography caption="p">
                                    No class pricing have been given by the school. Please click this button to request the school complete their listing.
                                </Typography>
                                <br>
                                </br>
                                <GenericButtonWrapper>
                                  <ClassTimeButton
                                      icon
                                      onClick={this.requestPricingInfo}
                                      iconName="payment"
                                      label="Request pricing"
                                  />
                                </GenericButtonWrapper>
                            </ClassContainer>
                        ) : (
                            <PackagesList
                              schoolId={classTypeData.schoolId}
                              enrollMentPackages
                              enrollMentPackagesData={enrollmentFeeData}
                              perClassPackagesData={classPricingData}
                              monthlyPackagesData={this.normalizeMonthlyPricingData(monthlyPricingData)}
                            />
                        )
                    }
                </PackagesWrapper>
              </Element>

              <MainInnerFixedContainer fixedWidth="1100" marginBottom="64">
                  <SchoolDetails
                    website={schoolData.website}
                    address={schoolData.address}
                    images={!isEmpty(mediaData) && mediaData.map((media)=>({original: media.sourcePath, thumbnail:media.sourcePath, media: media})) }
                    schoolName={schoolData && schoolData.name}
                    notes={schoolData.studentNotesHtml}
                    description={schoolData.aboutHtml}
                  />
                  {/*<CalendarWrapper>
                      <MyCalendar params={this.props.params} onJoinClassButtonClick={this.handleClassTimeRequest}/>
                  </CalendarWrapper>*/}
                  {/*<MyCalender {...this.props}/>*/
                    <CalendarWrapper>
                      <ManageMyCalendar classCalendar={true} {...this.props}/>
                    </CalendarWrapper>
                  }
              </MainInnerFixedContainer>
		        </Main>
          </div>
		)
	}
}

export default toastrModal(withImageExists(ClassTypeContent,imageExistsConfig));
