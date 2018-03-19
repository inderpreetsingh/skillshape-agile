import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isEmpty, get } from 'lodash';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import Preloader from '/imports/ui/components/landing/components/Preloader.jsx';
import ClassTypeCover from '/imports/ui/components/landing/components/class/cover/ClassTypeCover.jsx';
import ClassTypeCoverContent from '/imports/ui/components/landing/components/class/cover/ClassTypeCoverContent.jsx';
import reviewsData from '/imports/ui/components/landing/constants/reviewsData.js';
import ReviewsSlider from '/imports/ui/components/landing/components/class/ReviewsSlider.jsx';
import ClassTimesBoxes from '/imports/ui/components/landing/components/classTimes/ClassTimesBoxes';
import PackagesList from '/imports/ui/components/landing/components/class/packages/PackagesList.jsx';
import SchoolDetails from '/imports/ui/components/landing/components/class/details/SchoolDetails.jsx';
import MyCalendar from '/imports/ui/components/users/myCalender';

import PrimaryButton from '/imports/ui/components/landing/components/buttons/PrimaryButton';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';
import { ContainerLoader } from '/imports/ui/loading/container.js';
import { toastrModal } from '/imports/util';

const SchoolImgWrapper = styled.div`
  height: 400px;
`;

const SchoolImg = styled.img`
  width: 100%;
  height: 100%;
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
  margin: 0 auto;+
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
  margin-bottom: ${helpers.rhythmDiv * 4}px;

  @media screen and (max-width: ${helpers.mobile + 100}px) {
    padding-bottom: ${props => props.paddingBottom ? props.paddingBottom: 0}px;
    margin-bottom: 0;
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
  margin-bottom: ${helpers.rhythmDiv * 8}px;
`;

const PackagesTitle = styled.h2`
  text-align: center;
  font-size: ${helpers.baseFontSize * 2}px;
  font-family: ${helpers.specialFont};
  font-weight: 300;
  font-style: italic;
  margin: 0;
  line-height: 1;
  margin-bottom: ${helpers.rhythmDiv * 4}px;
  padding: 0 ${helpers.rhythmDiv * 2}px;
`;

const CalendarWrapper = styled.div`
   _box-shadow: 0px 0px 5px 1px rgba(221,221,221,1);
   border: 1px solid rgba(221,221,221,1);
`;

const ClassContainer = styled.div`
  width: 90%;
  padding: ${helpers.rhythmDiv}px;
  margin: ${helpers.rhythmDiv}px auto;
  border-radius: ${helpers.rhythmDiv}px;
  background: #ffffff;
  text-align: center;
`;

class ClassTypeContent extends Component {

    state = {
        isBusy: false,
    }

    requestPricingInfo = () => {
        const { toastr, schoolData } = this.props;

        if(Meteor.userId() && !isEmpty(schoolData)) {
            this.setState({ isBusy:true });

            Meteor.call('school.requestPricingInfo',schoolData, (err,res)=> {
                // Check sucess method in response and send confirmation to user using a toastr.
                this.setState({isBusy: false}, () => {
                    if(err) {
                        toastr.error(err.reason || err.message,"Error");
                    }
                    if(res && res.emailSent) {
                      toastr.success('Your request for pricing info has been sent. We will notify you when we will update Pricing for our school','success')
                    }
                });
            });

        } else {
            toastr.error("You need to login for Price Package Request!!!!","Error");
        }
    }

    handleClassTimeRequest = () => {
        const { toastr, classTypeData } = this.props;

        if(Meteor.userId() && !isEmpty(classTypeData)) {
            this.setState({ isBusy:true });

            const payload = {
                schoolId: classTypeData.schoolId,
                classTypeId: classTypeData._id,
                classTypeName: classTypeData.name,
            }

            Meteor.call("classTimesRequest.notifyToSchool", payload, (err, res) => {
                console.log("err -->>",err)
                let stateObj = {
                    isBusy: false
                }
                this.setState({ isBusy: false }, () => {
                    if(res && res.emailSuccess) {
                        // Need to show message to user when email is send successfully.
                        toastr.success("Your email has been sent. We will assist you soon.", "Success");
                    }
                    if(res && res.message) {
                        toastr.error(res.message,"Error");
                    }
                })
            })
        } else {
            toastr.error("You need to login for classTimes request!!!!","Error");
        }
    }

	render() {
		console.log("ClassTypeContent props --->>",this.props);

		const {
			isLoading,
			schoolData,
			classTypeData,
			classTimesData,
            classPricingData,
            monthlyPricingData,
            mediaData,
		} = this.props;

		if(isLoading) {
			return <Preloader/>
		}

		if(isEmpty(classTypeData)) {
			return <Typography type="display2" gutterBottom align="center">
            	Class Type not found!!!
        	</Typography>
		}

		return (
			<Fragment>
                { this.state.isBusy && <ContainerLoader/>}
				{/* Class Type Cover includes description, map, foreground image, then class type information*/}
		        <ClassTypeCover coverSrc={classTypeData.classTypeImg}>
			        <ClassTypeCoverContent
			        	coverSrc={classTypeData.classTypeImg}
			            schoolDetails={{...schoolData}}
			            classTypeData={{...classTypeData}}
			            onCallUsButtonClick={this.props.onCallUsButtonClick}
			            onEmailButtonClick={this.props.onEmailButtonClick}
			            onPricingButtonClick={this.props.onPricingButtonClick}
			        />
		        </ClassTypeCover>
		        <Main>
			        <MainInnerFixedContainer marginBottom="32">
			            <MainInner reviews largePadding="32" smallPadding="32">
			              	<ClassWrapper reviews>
			                	<ReviewsSlider data={reviewsData} padding={helpers.rhythmDiv * 2}/>
			              	</ClassWrapper>
			            </MainInner>
          			</MainInnerFixedContainer>

          			<MainInnerFixedContainer marginBottom="16">
			            <ClassTimesInnerWrapper>
			                <ClassTimesWrapper paddingBottom="48">
			                	<ClassTimesTitle>Class timings for <ClassTimesName>{classTypeData.name.toLowerCase()}</ClassTimesName></ClassTimesTitle>
			                	{
                            isEmpty(classTimesData) ? (
                                <ClassContainer>
                                    <Typography caption="p">
                                        No class times have been given by the school. Please click this button to request the school complete their listing.
                                    </Typography>
                                    <br>
                                    </br>
                                    <PrimaryButton
                                        icon
                                        onClick={this.handleClassTimeRequest}
                                        iconName="perm_contact_calendar"
                                        label="REQUEST CLASS TIMES"
                                    />
                                </ClassContainer>
                            ) : (
                                <ClassTimesBoxes classTimesData={classTimesData} />
                            )
                          }
			                </ClassTimesWrapper>
			            </ClassTimesInnerWrapper>
			        </MainInnerFixedContainer>

                    <PackagesWrapper>
                        <PackagesTitle>Pay only for what you need</PackagesTitle>
                        {
                            (isEmpty(classPricingData) && isEmpty(monthlyPricingData)) ? (
                                <ClassContainer>
                                    <Typography caption="p">
                                        No class pricing have been given by the school. Please click this button to request the school complete their listing.
                                    </Typography>
                                    <br>
                                    </br>
                                    <PrimaryButton
                                        icon
                                        onClick={this.requestPricingInfo}
                                        iconName="payment"
                                        label="REQUEST PRICING"
                                    />
                                </ClassContainer>
                            ) : (
                                <PackagesList
                                  perClassPackagesData={classPricingData}
                                  monthlyPackagesData={monthlyPricingData}
                                />
                            )
                        }
                    </PackagesWrapper>

                    <MainInnerFixedContainer fixedWidth="1100" marginBottom="64">
                        <SchoolDetails
                          website={schoolData.website}
                          address={schoolData.address}
                          images={!isEmpty(mediaData) && mediaData.map((media)=>({original: media.sourcePath, thumbnail:media.sourcePath, media: media})) }
                          schoolName={schoolData.name}
                          notes={schoolData.studentNotesHtml}
                          description={schoolData.aboutHtml}
                        />
                        <CalendarWrapper>
                            <MyCalendar params={this.props.params}/>
                        </CalendarWrapper>
                    </MainInnerFixedContainer>

		        </Main>
			</Fragment>
		)
	}
}

<<<<<<< HEAD
export default ClassTypeContent;
=======
export default toastrModal(ClassTypeContent);
>>>>>>> e7e080b0b87cf4c6d1239dd4b0c18f1f85cdb624
