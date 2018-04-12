import React,{Fragment} from 'react';
import ReactDOM from 'react-dom';
import { Element } from 'react-scroll';
import DocumentTitle from 'react-document-title';
import { browserHistory, Link } from 'react-router';

import styled from 'styled-components';
import { floor, isArray, isEmpty } from 'lodash';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Email from 'material-ui-icons/Email';
import Phone from 'material-ui-icons/Phone';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Switch from 'material-ui/Switch';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';

import { Loading } from '/imports/ui/loading';
import { checkSuperAdmin, cutString } from '/imports/util';
import { CustomModal } from '/imports/ui/modal';
import MyCalender from '/imports/ui/components/users/myCalender';
import ManageMyCalendar from '/imports/ui/components/users/manageMyCalendar/index.js';

import ReviewsSlider from '/imports/ui/components/landing/components/class/ReviewsSlider.jsx';
import StudentNotes from '/imports/ui/components/landing/components/class/details/StudentNotes.jsx';
import MediaDetails from '/imports/ui/components/schoolView/editSchool/mediaDetails';
import SkillShapeCard from "/imports/ui/componentHelpers/skillShapeCard"
import { ContainerLoader } from '/imports/ui/loading/container';
import ClassTypeList from '/imports/ui/components/landing/components/classType/classTypeList.jsx';
import PackagesList from '/imports/ui/components/landing/components/class/packages/PackagesList.jsx';
import Preloader from '/imports/ui/components/landing/components/Preloader.jsx';
import ConfirmationModal from '/imports/ui/modal/confirmationModal';
import GiveReviewDialogBox from '/imports/ui/components/landing/components/dialogs/GiveReviewDialogBox.jsx';
import NonUserDefaultDialogBox from '/imports/ui/components/landing/components/dialogs/NonUserDefaultDialogBox.jsx';

import PrimaryButton from '/imports/ui/components/landing/components/buttons/PrimaryButton.jsx';
import ClassTimeButton from '/imports/ui/components/landing/components/buttons/ClassTimeButton.jsx';

import SchoolViewBanner from '/imports/ui/componentHelpers/schoolViewBanner';
import SchoolViewNewBanner from '/imports/ui/componentHelpers/schoolViewBanner/schoolViewNewBanner.jsx';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const Wrapper = styled.div`
  background: white;
  overflow-x: hidden;
`;


const GenericWrapper = styled.div`
  width: 100%;
  background: white;
`;

const GenericFixedWidthWrapper = GenericWrapper.extend`
  max-width: 1200px;
  margin: 0 auto;
`;

const ClassTypeListWrapper = GenericWrapper.extend`
  margin-bottom: ${helpers.rhythmDiv * 5}px;
 `;

const CardContentPriceWrapper = GenericWrapper.extend`
  padding: ${helpers.rhythmDiv * 2}px;
  margin: ${helpers.rhythmDiv * 2}px 0;
  margin-bottom: 0;
  padding-bottom: 0;
`;

const ReviewsWrapper = GenericWrapper.extend`
  margin-bottom: 0;
`;

const ReviewsInnerWrapper = GenericFixedWidthWrapper.extend`
  padding: ${helpers.rhythmDiv * 4}px;
  overflow: hidden;
  text-align: ${props => props.centerText ? 'center': 'left'};

  @media screen and (max-width : ${helpers.mobile}px) {
    padding: ${helpers.rhythmDiv * 4}px;
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

const EnrollMentWrapper = PackagesWrapper.extend`
  margin-bottom: 0;
  flex-direction: row;
`;

const MyCalendarWrapper = GenericFixedWidthWrapper.extend`
  margin-bottom: ${helpers.rhythmDiv * 8}px;
  padding: 0 ${helpers.rhythmDiv * 2}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    padding: 0;
  }
`;

const PricingSection = styled.div`
  margin-top: ${helpers.rhythmDiv * 4}px;
  margin-bottom: ${helpers.rhythmDiv * 6}px;
`;

const ButtonWrapper = styled.div`
  ${helpers.flexCenter}
  width: 100%;
  padding: 0 ${helpers.rhythmDiv * 2}px;
`;

const ContentWrapper = styled.div`
  width: 100%;
  text-align: center;
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
`;

const ErrorText = styled.p`
  font-size: ${helpers.baseFontSize}px;
  font-family: ${helpers.specialFont};
  margin: 0;
  color: ${helpers.black};
`;


// No Media Found
const NoMediaFound = styled.div`
	${helpers.flexCenter}

	height: 300px;
	width: 100%;
	position: relative;
	z-index: 1;

	&:after {
		content: '';
		position: absolute;
		z-index : -1;
		opacity: 0.5;
		border-radius: 5px;
		width: 100%;
		height: 100%;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: ${helpers.cancel};
	}
`;

export default function() {
    console.log("SchoolView render-->>",this.props)

    const defaultSchoolImage = "http://img.freepik.com/free-icon/high-school_318-137014.jpg?size=338c&ext=jpg";
    const {
        schoolData,
        classPricing,
        monthlyPricing,
        schoolLocation,
        classType,
        currentUser,
        schoolId,
        classes,
        enrollmentFee,
        showLoading,
        reviewsData,
    } = this.props;

    const {
        claimSchoolModal,
        claimRequestModal,
        successModal,
    } = this.state;

    if(showLoading) {
        return <Preloader/>
    }

    if(isEmpty(schoolData)) {
        return <Typography type="display2" gutterBottom align="center">
            School not found!!!
        </Typography>
    } else {

        const checkUserAccess = checkMyAccess({user: currentUser,schoolId});
        const claimBtnCSS = this.claimBtnCSS(currentUser, schoolData.claimed);
        const imageMediaList = this.getImageMediaList(schoolData.mediaList, "Image");
        const otherMediaList = this.getImageMediaList(schoolData.mediaList, "Other");
        let isPublish = this.getPublishStatus(schoolData.isPublish)

        console.info('---------- is publish...',this.props);

        return (
            <DocumentTitle title={this.props.route.name}>
            <Wrapper className="content">
          {
            this.state.isLoading && <ContainerLoader />
          }
          {this.state.giveReviewDialog && <GiveReviewDialogBox title={this.getReviewTitle(schoolData.name)} open={this.state.giveReviewDialog} onModalClose={() => this.handleDialogState('giveReviewDialog',false)} />}
          {this.state.nonUserDefaultDialog && <NonUserDefaultDialogBox title={this.state.defaultDialogBoxTitle} open={this.state.nonUserDefaultDialog} onModalClose={() => this.handleDefaultDialogBox('',false)} />}

          {
            this.state.showConfirmationModal && <ConfirmationModal
                open={this.state.showConfirmationModal}
                submitBtnLabel="Request pricing"
                cancelBtnLabel="Cancel"
                message="No prices have been added by the school. Please click this button to request the school complete their pricing info?"
                onSubmit={()=>{this.requestPricingInfo(schoolData)}}
                onClose={this.cancelConfirmationModal}
            />
          }
                { (claimSchoolModal || claimRequestModal || successModal) && <CustomModal
              className={successModal ? "success-modal" : "info-modal" }
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
            isPublish={isPublish}
            currentUser={currentUser}
            schoolLocation={schoolLocation}
            isEdit={false}
            bestPriceDetails={{
              monthly: !isEmpty(this.state.bestPriceDetails) ? floor(this.state.bestPriceDetails.bestMonthlyPrice.avgRate) : null,
              class: !isEmpty(this.state.bestPriceDetails) ? floor(this.state.bestPriceDetails.bestClassPrice.avgRate) : null
            }}
            handlePublishStatus={this.handlePublishStatus.bind(this, schoolId)}/> {/* container, school-header ends */}

          {/* Reviews List */}
          <ReviewsWrapper>
            {!isEmpty(reviewsData) && (<ReviewsInnerWrapper>
                <ReviewsSlider data={reviewsData} padding={helpers.rhythmDiv * 2}/>
              </ReviewsInnerWrapper>)}

            <ReviewsInnerWrapper centerText>
              {isEmpty(reviewsData) && <Fragment><Typography>
                You are the first one to write review for this school.
              </Typography>
              <br /></Fragment>}
              <ClassTimeButton
                icon
                onClick={this.handleGiveReview}
                iconName="rate_review"
                label="Give review"
              />
            </ReviewsInnerWrapper>
          </ReviewsWrapper>


          {/* Cards List Section*/}
          <ClassTypeListWrapper>
            <ClassTypeList
                containerPaddingTop="0px"
                locationName={null}
                mapView={false}
                filters={{schoolId: schoolId,limit:this.state.seeMoreCount}}
                splitByCategory={false}
                classTypeBySchool='classTypeBySchool'
                handleSeeMore={this.handleSeeMore}
              />
          </ClassTypeListWrapper>

        {/* Pricing Section*/}
        <PricingSection ref={(el) => { this.schoolPrice = el; }}>
          <Element name="price-section">
          <SectionTitle>Pay only for what you want.</SectionTitle>
          {(enrollmentFee && enrollmentFee.length == 0) && (classPricing && classPricing.length == 0) && (monthlyPricing && monthlyPricing.length ==0) ?
            <ButtonWrapper>
              <ClassTimeButton
                onClick={this.handlePricingInfoRequestModal}
                icon
                iconName="attach_money"
                label="Request pricing info" />
            </ButtonWrapper> : ''}

            <EnrollMentWrapper>
            {enrollmentFee && enrollmentFee.length > 0 ?
              <PackagesList
                schoolId={schoolId}
                onAddToCartIconButtonClick={this.handlePurcasePackage}
                enrollMentPackages
                enrollMentPackagesData={enrollmentFee}
              /> : ''}
              </EnrollMentWrapper>

                <PackagesWrapper>
                {(isEmpty(classPricing) && isEmpty(monthlyPricing)) ?
                  '' :
                  <PackagesList
                  schoolId={schoolId}
                  onAddToCartIconButtonClick={this.handlePurcasePackage}
                  perClassPackagesData={classPricing}
                  monthlyPackagesData={monthlyPricing}
                  />
                }
                </PackagesWrapper>
              </Element>
          </PricingSection>

          {/* School Extra Section -- Notes & Media*/}
          <SchoolExtraSection>
            <NotesWrapper>
             {/*
              <Typography align="center" type="title" classes={{title: classes.title}}> Notes for students</Typography>
              <Typography type="caption" classes={{caption: classes.caption}}> {this.checkForHtmlCode(schoolData.studentNotesHtml) ? ReactHtmlParser(schoolData.studentNotesHtml) : 'Nothing here for the moment, but keep an eye. We may add it soon.'} </Typography>*/}
              <StudentNotes notes={schoolData.studentNotesHtml} />
            </NotesWrapper>

            <MediaWrapper>
              <MediaDetails
                noMediaFound={<NoMediaFound>
        						<ErrorText>No Media Found</ErrorText>
        					</NoMediaFound>}
                schoolId={schoolId}
                schoolView= {true}
              />
              {/*<Card className={classes.content}> </Card>*/}
            </MediaWrapper>
          </SchoolExtraSection>


            {/* Calendar Section*/}
            <MyCalendarWrapper ref={(el) => { this.schoolCalendar = el; }}>
              <Element name="schedule-section">
              {<ManageMyCalendar schoolCalendar={true} {...this.props}/>}
              </Element>
            </MyCalendarWrapper>


            {/*<div className="card">
              <div className="col-md-12 media-heading-box">
                <div className="content-list-heading ">
                  <h2 className="tagline  text-center">Media
                    <figure>
                      <img src="/images/heading-line.png"/>
                    </figure>
                  </h2>
                </div>
                <div className="col-sm-6 " style={{paddingBottom: '20px'}}>
                  <div className="">
                    <div className="card-content">
                      <h4 className="tagline line-bottom border-line-text text-center">Images</h4>
                      <div className="carousel slide" id="myCarousel">
                        <div className="carousel-inner">
                          {
                            imageMediaList.map((imageMediaData, index) => {
                              return(<div key={index} className={index == 0 ? "item active" : "item"}>
                                <div className="row">
                                  {
                                    imageMediaData.item && imageMediaData.item.map((itemData,key)=>{
                                      return (
                                        <div key={key} className="col-xs-12">
                                          <a  href="#">
                                            <div
                                              className="thumb targetImage"
                                              style={{backgroundImage: `url(${itemData.filePath})`,height: '220px', width:'100%'}}
                                              data-src={itemData.filePath}>
                                            </div>
                                          </a>
                                        </div>
                                      )
                                    })
                                  }
                                  </div>
                                </div>
                              )
                            })
                          }
                        </div>
                        <div className="carousel-selector-main">
                          <a className="left carousel-control left-carousal" href="#myCarousel" data-slide="prev">
                            <i className="fa fa-chevron-left fa-em"></i>
                          </a>
                          <a className="right carousel-control right-carousal" href="#myCarousel" data-slide="next">
                            <i className="fa fa-chevron-right fa-em"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 " style={{paddingBottom: '20px'}}>
                  <div className="">
                    <div className="card-content">
                      <h4 className="tagline line-bottom border-line-text text-center">Other Media</h4>
                      <div className="carousel slide" id="MediaCarousel">
                        <div className="carousel-inner">
                          {
                            otherMediaList.map((otherMediaData, index) => {
                              return(<div key={index} className={index == 0 ? "item active" : "item"}>
                                <div className="row">
                                  {
                                    otherMediaData.item && otherMediaData.item.map((itemData,key)=>{
                                      return (
                                        <div key={key} className="col-xs-3">
                                          <div style={{marginTop:'10px', marginBottom: '10px', marginLeft: '10px', cursor: 'zoom-in', height: '80px'}}>
                                            <a target="_blank" href={itemData.filePath}>
                                              <span className="fa fa-file-pdf-o fa-5x"></span>
                                            </a>
                                          </div>
                                        </div>
                                      )
                                    })
                                  }
                                  </div>
                                </div>
                              )
                            })
                          }
                        </div>
                        <div className="carousel-selector-main">
                          <a className="left carousel-control left-carousal" href="#MediaCarousel" data-slide="prev">
                            <i className="fa fa-chevron-left fa-em"></i>
                          </a>
                          <a className="right carousel-control right-carousal" href="#MediaCarousel" data-slide="next">
                            <i className="fa fa-chevron-right fa-em"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>*/}












            {/*<div className="row">
              <div className="card">
                  {
                    false && classPricing && classPricing.length > 0 && (
                      <div className="col-md-12">
                        <h2 className="tagline line-bottom">Prices</h2>
                        <div className="card-content table-grey-box">
                          <h4 className="card-title border-line-text line-bottom">Monthly Packages</h4>
                          <div className="card-content table-responsive prices school-view-price" style={{overflowX: 'auto !important'}}>
                            <table className="table">
                              <thead>
                                <tr>
                                  <th className="th_header">Package Name</th>
                                  <th className="th_header">Payment Type</th>
                                  <th className="th_header">Class Type includes</th>
                                  <th className="th_header">1 month</th>
                                  <th className="th_header">3 month</th>
                                  <th className="th_header">6 month</th>
                                  <th className="th_header">1 year</th>
                                  <th className="th_header">Life Time Cost</th>
                                </tr>
                             </thead>
                             <tbody>
                             </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                                    )
                                }
                                {
                                    false && classPricing && classPricing.length > 0 && (
                                        <div className="col-md-12">
                            <div className="card-content table-grey-box ">
                                <h4 className="card-title border-line-text line-bottom" >Class Costs</h4>
                            <div className="card-content table-responsive clascost school-view-price" style={{overflowX:'auto !important'}}>
                            <table className="table">
                              <thead className="">
                                <tr>
                                  <th className="th_header">Package Name</th>
                                  <th className="th_header">Cost</th>
                                  <th className="th_header">Class Type includes</th>
                                  <th className="th_header">Number of Classes</th>
                                  <th className="th_header">Expires</th>
                                </tr>
                              </thead>
                             <tbody>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                                    )
                                }
                            </div>
                    </div>*/}

                    <div className="row">
                <div className="col-sm-12">
                        <div className="card">
                        <div className="card-content">
                        <div className="">
                        <div className="thumb about-school-top">
                                    <figure className="about-head-image">
                          <div className="overlay-box"></div>
                          {/*<img src={ schoolData.mainImage || defaultSchoolImage }/>*/}
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
                {/*<div className="col-sm-12">
                          <div className="clearfix card" >
                             <div className="col-sm-9">
                               <div className="">

                                 <div className="card-content">
                                  <div className="content-list-heading">
                                     <h2 className="card-title text-center ">About School
                                       <figure>
                                         <img src="/images/heading-line.png"/>
                                       </figure>
                                     </h2>
                                     {schoolData.aboutHtml && ReactHtmlParser(schoolData.aboutHtml)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-3">
                               <div className="card">
                                 {
                                   schoolLocation.map((data, index) => {
                                     return (<div key={index}>
                                       <div className="btn-info address-bar-box">
                                         <h4><i className="fa fa-map-marker"></i>&nbsp;{data.title}</h4>
                                       </div>
                                       <div className="school-view-adress card-content">
                                        <p>{data.address}<br/>
                                          {data.city},{data.state} - {data.zip}<br/>
                                          {data.country}
                                        </p>
                                            <div className="card-content" id="google-map" style={{height:'200px'}}>
                                            </div>
                                        </div>
                                       </div>
                                     )
                                   })
                                 }
                               </div>
                             </div>
                          </div>
                        </div>*/}
                {/*
                    schoolData.descHtml && (
                        <div className="row  card">
                        <div className="col-md-12">
                          <div className="">
                              <div className="card-content">
                                <div className="content-list-heading">
                                      <h2 className="card-title text-center">Description
                                          <figure><img src="/images/heading-line.png"/></figure>
                                      </h2>
                                  {schoolData.descHtml}
                                </div>
                                </div>
                            </div>
                        </div>
                      </div>
                    )
                */
                }
                {/*<div className="row  card">
                          <div className="col-sm-12 text-left">
                            <div className="content-list-heading ">
                               <h2 className="text-center">{schoolData.name} offers the following class types
                                <figure>
                                  <img src="/images/heading-line.png"/>
                                </figure>
                              </h2>
                            </div>
                          </div>
                          <div className="col-sm-12">
                          {
                            classType.map((classTypeData, index)=> {
                              console.log("classTypeData -->>",classTypeData)
                              const skillClass = SkillClass.find({classTypeId: classTypeData._id}).fetch();
                              return skillClass.map((skillClassData, index) => {
                                console.log("skillClassData -->>",skillClassData)
                                const imgUrl = this.getClassImageUrl(skillClassData.classTypeId, skillClassData.classImagePath);
                                return (<div className="col-md-4 npdagin npding">
                                    <div className="card card-profile">
                                       <h4 className="tagline" title={skillClassData.className}>
                                        {classTypeData.skillTypeId} at {schoolData.name}
                                       </h4>
                                       <div className="card-content">
                                        <div className="" data-header-animation="false">
                                          <div className="">
                                            <div className="thumb " style={{backgroundImage: `url(${imgUrl})`, height: '155px', width:'100%'}}>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="card-content">
                                          <h4 className="card-title">
                                            <a href="#">{skillClassData.className}</a>
                                          </h4>
                                          <div className="card-description">
                                            {classTypeData.desc}
                                            <br/>
                                            <br/>
                                            {this.getClassPrice(skillClassData.classTypeId)}
                                          </div>
                                          <br/>
                                          <p className="text-center">
                                            {skillClassData && ReactHtmlParser(this.viewSchedule(skillClassData))}
                                          </p>
                                        </div>
                                        <div className="card-footer">
                                          <div className="col-sm-12 col-xs-12">
                                            {
                                              this.checkOwnerAccess(currentUser, schoolData.userId)  ? (
                                                <a href="#" className="btn btn-success" data-class={skillClassData._id} data-class-type={skillClassData.classTypeId}>
                                                  <i className="material-icons">check</i>  Managing
                                                  <div className="ripple-container"></div>
                                                </a>
                                              ) : (
                                                this.checkForJoin(currentUser, skillClassData._id) ? (
                                                  <a href="#" className="btn btn-success" data-class={skillClassData._id} data-class-type="{{classTypeId}}">
                                                    <i className="material-icons">check</i>  Joined
                                                    <div className="ripple-container"></div>
                                                  </a>
                                                ) : (
                                                  <a href="#" className="btn btn-danger btn_join_className btn_join_check" data-className="KCcabqEX4Kb5c58cW" data-className-type="YXdAyLNiR45yqiDXs">
                                                    Add to my calendar!
                                                    <div className="ripple-container"></div>
                                                  </a>
                                                )
                                              )
                                            }
                                          </div>
                                          <div className="clearfix"></div>
                                          <div className="col-sm-12 col-xs-12" style={{padding: '5px'}}>
                                            <div className="col-sm-9">
                                                <p className="text-center">Toggle {skillClassData.className} view </p>
                                            </div>
                                            <div className="col-sm-3 col-xs-3">
                                              <div className="togglebutton">
                                                <label>
                                                  <input type="checkbox" data-id="KCcabqEX4Kb5c58cW" className="toggeleview" style={{position: 'absolute'}}/>
                                                  <span className="toggle toggle-success"></span>
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })
                            })
                          }
                          </div>
                        </div>*/}

              {/*<div className="card col-sm-12">
                         {
                            monthlyPricing && monthlyPricing.length > 0 && (
                              <div className="col-md-12">
                                <div className="content-list-heading">
                                  <h2 className="tagline text-center">Prices
                                    <figure>
                                      <img src="/images/heading-line.png"/>
                                    </figure>
                                  </h2>
                                </div>
                                <div className="">
                                 <div className="card-content table-grey-box">
                                 <h4 className="card-title border-line-text line-bottom">Monthly Packages</h4>
                                    <div className="card-content table-responsive prices school-view-price">
                                      <table className="table">
                                        <thead>
                                          <tr>
                                            <th>Package Name</th>
                                            <th>Payment Type</th>
                                            <th>Class Type includes</th>
                                            <th>1 month</th>
                                            <th>3 month</th>
                                            <th>6 month</th>
                                            <th>1 year</th>
                                            <th>Life Time Cost</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                         {
                                            monthlyPricing.map((data, index) => {
                                              return (<tr key={index}>
                                                <td>{data.packageName}</td>
                                                <td>{ data.pymtType ?
                                                  data.pymtType :
                                                  <span className="text-warning link">check with school</span>
                                                }
                                                </td>
                                                <td>{this.getClassName(data.classTypeId)}</td>
                                                <td>
                                                  {
                                                    data.oneMonCost ?
                                                    <span className="btn-info">{data.oneMonCost}</span> :
                                                    <span className="text-warning link"> check with school</span>
                                                  }
                                                </td>
                                                <td>
                                                  {
                                                    data.threeMonCost ?
                                                    <span className="btn-info">{data.threeMonCost}</span> :
                                                    <span className="text-warning link"> check with school</span>
                                                  }
                                                </td>
                                                <td>
                                                  {
                                                    data.sixMonCost ?
                                                    <span className="btn-info">{data.sixMonCost}</span> :
                                                    <span className="text-warning link"> check with school</span>
                                                  }
                                                </td>
                                                <td>
                                                  {
                                                    data.annualCost ?
                                                    <span className="btn-info">{data.annualCost}</span> :
                                                    <span className="text-warning link"> check with school</span>
                                                  }
                                                </td>
                                                <td>
                                                  {
                                                    data.lifetimeCost ?
                                                    <span className="btn-info">{data.lifetimeCost}</span> :
                                                    <span className="text-warning link"> check with school</span>
                                                  }
                                                </td>
                                              </tr>
                                              )
                                            })
                                          }
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          }
                          <div className="col-md-12">
                            {
                              classPricing && classPricing.length > 0 && (
                                <div className="">
                                  <div className="card-content table-grey-box ">
                                    <h4 className="card-title border-line-text line-bottom" >Class Costs</h4>
                                      <div className="card-content table-responsive clascost school-view-price">
                                        <table className="table">
                                          <thead className="">
                                            <tr>
                                              <th>Package Name</th>
                                              <th>Cost</th>
                                              <th>Class Type includes</th>
                                              <th>Number of Classes</th>
                                              <th>Expires</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {
                                              classPricing.map((data, index) => {
                                                return (
                                                  <tr>
                                                    <td className="">{data.packageName}</td>
                                                    <td className="">
                                                      {
                                                        data.cost ? <span className="btn-warning">{data.cost}</span> :
                                                        <span className="text-warning link"> check with school</span>
                                                      }
                                                    </td>
                                                    <td className="">{this.getClassName(data.classTypeId)}</td>
                                                    <td className="">{data.noClasses}</td>
                                                    <td className="text-warning">
                                                      {
                                                        (data.start && data.finish) ? `${data.start} ${data.finish}` :
                                                        "Check with School"
                                                      }
                                                    </td>
                                                  </tr>
                                                )
                                              })
                                            }
                                          </tbody>
                                        </table>
                                      </div>
                                  </div>
                                </div>
                              )
                            }
                          </div>
                        </div>*/}
              {/*<div className="card">
                          <div className="col-md-12 media-heading-box">
                            <div className="content-list-heading ">
                              <h2 className="tagline  text-center">Media
                                <figure>
                                  <img src="/images/heading-line.png"/>
                                </figure>
                              </h2>
                            </div>
                            <div className="col-sm-6 " style={{paddingBottom: '20px'}}>
                              <div className="">
                                <div className="card-content">
                                  <h4 className="tagline line-bottom border-line-text text-center">Images</h4>
                                  <div className="carousel slide" id="myCarousel">
                                    <div className="carousel-inner">
                                      {
                                        imageMediaList.map((imageMediaData, index) => {
                                          return(<div key={index} className={index == 0 ? "item active" : "item"}>
                                            <div className="row">
                                              {
                                                imageMediaData.item && imageMediaData.item.map((itemData,key)=>{
                                                  return (
                                                    <div key={key} className="col-xs-12">
                                                      <a  href="#">
                                                        <div
                                                          className="thumb targetImage"
                                                          style={{backgroundImage: `url(${itemData.filePath})`,height: '220px', width:'100%'}}
                                                          data-src={itemData.filePath}>
                                                        </div>
                                                      </a>
                                                    </div>
                                                  )
                                                })
                                              }
                                              </div>
                                            </div>
                                          )
                                        })
                                      }
                                    </div>
                                    <div className="carousel-selector-main">
                                      <a className="left carousel-control left-carousal" href="#myCarousel" data-slide="prev">
                                        <i className="fa fa-chevron-left fa-em"></i>
                                      </a>
                                      <a className="right carousel-control right-carousal" href="#myCarousel" data-slide="next">
                                        <i className="fa fa-chevron-right fa-em"></i>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 " style={{paddingBottom: '20px'}}>
                              <div className="">
                                <div className="card-content">
                                  <h4 className="tagline line-bottom border-line-text text-center">Other Media</h4>
                                  <div className="carousel slide" id="MediaCarousel">
                                    <div className="carousel-inner">
                                      {
                                        otherMediaList.map((otherMediaData, index) => {
                                          return(<div key={index} className={index == 0 ? "item active" : "item"}>
                                            <div className="row">
                                              {
                                                otherMediaData.item && otherMediaData.item.map((itemData,key)=>{
                                                  return (
                                                    <div key={key} className="col-xs-3">
                                                      <div style={{marginTop:'10px', marginBottom: '10px', marginLeft: '10px', cursor: 'zoom-in', height: '80px'}}>
                                                        <a target="_blank" href={itemData.filePath}>
                                                          <span className="fa fa-file-pdf-o fa-5x"></span>
                                                        </a>
                                                      </div>
                                                    </div>
                                                  )
                                                })
                                              }
                                              </div>
                                            </div>
                                          )
                                        })
                                      }
                                    </div>
                                    <div className="carousel-selector-main">
                                      <a className="left carousel-control left-carousal" href="#MediaCarousel" data-slide="prev">
                                        <i className="fa fa-chevron-left fa-em"></i>
                                      </a>
                                      <a className="right carousel-control right-carousal" href="#MediaCarousel" data-slide="next">
                                        <i className="fa fa-chevron-right fa-em"></i>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>*/}
                    </div>
                </div>
            </Wrapper>
            </DocumentTitle>
        )
    }
}
