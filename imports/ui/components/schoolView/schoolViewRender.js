import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import DocumentTitle from 'react-document-title';
import { browserHistory, Link } from 'react-router';
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
import MediaDetails from '/imports/ui/components/schoolView/editSchool/mediaDetails';
import SkillShapeCard from '/imports/ui/componentHelpers/skillShapeCard';
import { ContainerLoader } from '/imports/ui/loading/container';
import ClassTypeList from '/imports/ui/components/landing/components/classType/classTypeList.jsx';
import ConfirmationModal from '/imports/ui/modal/confirmationModal';
import Preloader from '/imports/ui/components/landing/components/Preloader.jsx';

import SchoolViewBanner from '/imports/ui/componentHelpers/schoolViewBanner';
import SchoolViewNewBanner from '/imports/ui/componentHelpers/schoolViewBanner/schoolViewNewBanner.jsx';
import ManageMyCalendar from '/imports/ui/components/users/manageMyCalendar/index.js';

export default function () {
  const defaultSchoolImage = 'http://img.freepik.com/free-icon/high-school_318-137014.jpg?size=338c&ext=jpg';
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
  } = this.props;

  const {
    claimSchoolModal,
    claimRequestModal,
    successModal,
  } = this.state;

  if (showLoading) {
    return <Preloader />;
  }

  if (isEmpty(schoolData)) {
    return (
      <Typography type="display2" gutterBottom align="center">
            School not found!!!
</Typography>
    );
  }

  const checkUserAccess = checkMyAccess({ user: currentUser, schoolId });
  const claimBtnCSS = this.claimBtnCSS(currentUser, schoolData.claimed);
  const imageMediaList = this.getImageMediaList(schoolData.mediaList, 'Image');
  const otherMediaList = this.getImageMediaList(schoolData.mediaList, 'Other');
  const isPublish = this.getPublishStatus(schoolData.isPublish);


  return (
    <DocumentTitle title={this.props.route.name}>
            <div className="content">
                {
            this.state.isLoading && <ContainerLoader />
          }

                {
            this.state.showConfirmationModal && (
            <ConfirmationModal
  open={this.state.showConfirmationModal}
  submitBtnLabel="REQUEST PRICING"
  cancelBtnLabel="Cancel"
  message="No prices have been added by the school. Please click this button to request the school complete their pricing info?"
  onSubmit={() => { this.requestPricingInfo(schoolData); }}
  onClose={this.cancelConfirmationModal}
/>
            )
          }
                { (claimSchoolModal || claimRequestModal || successModal) && (
              <CustomModal
  className={successModal ? 'success-modal' : 'info-modal'}
  title={this.getClaimSchoolModalTitle()}
  message={successModal && `You are now owner of ${schoolData.name} Would you like to edit ?`}
  onClose={this.modalClose}
  onSubmit={this.modalSubmit}
  closeBtnLabel={successModal ? 'Continue' : 'No'}
  submitBtnLabel="Yes"
/>
              )
          }
                <div>
                <Grid container className={classes.schoolHeaderContainer}>
              <Grid item xs={12}>
                {/* <div className={classes.imageContainer}>
                  <img className={classes.image} src={ schoolData.mainImage || defaultSchoolImage }/>
                </div> */}

                <SchoolViewBanner schoolData={schoolData} schoolId={schoolId} currentUser={currentUser} isEdit={false} />

                <Grid container className={classes.schoolInfo}>
                  <Grid item xs={12} sm={8} md={6}>
                    {' '}
                    {/* Old Grid item */}
                    <Card className={`${classes.card} ${classes.schoolInfo}`}>
                        <Grid item xs={12}>
                            {
                                   checkUserAccess && (
                                   <div>
Publish / Unpublish
                                     {' '}
                                     <Switch
  checked={isPublish}
  onChange={this.handlePublishStatus.bind(this, schoolId)}
  aria-label={schoolId}
/>

                                   </div>
                                   )
                                }
                            {
                                  this.checkForHtmlCode(schoolData.aboutHtml) && (
                                    <Fragment>
                                      <Typography type="title">
                                        {' '}
About
                                        {' '}
                                        {schoolData.name}
                                        {' '}
                                      </Typography>
                                      <Typography type="caption">
                                        {' '}
                                        {ReactHtmlParser(schoolData.aboutHtml)}
                                        {' '}
                                      </Typography>
                                    </Fragment>
                                  )
                                }
                          </Grid>
                        {
                                this.checkForHtmlCode(schoolData.studentNotesHtml) && (
                                <Grid item xs={12}>
                                  <Typography type="title">
Notes for student of
                                        {' '}
                                        {schoolData.name}
                                        {' '}
                                        <br />
                                        {' '}
                                      </Typography>
                                  <Typography type="caption">
                                        {' '}
                                        {ReactHtmlParser(schoolData.studentNotesHtml)}
                                        {' '}
                                      </Typography>
                                </Grid>
                                )
                            }
                      </Card>
                  </Grid>

                  <Grid item xs={12} sm={4} md={3}>
                    <div className="card-content" id="schoolLocationMap" style={{ height: '100%', minHeight: 250 }} />
                  </Grid>

                  <Grid item xs={12} sm={12} md={3}>
                    <Grid container style={{ textAlign: 'center' }}>
                        <Grid item xs={12} sm={6} md={12}>
                          <Card className={classes.card}>
                            <Fragment>
                              <CardContent className={classes.content}>
                                  {
                                    this.state.bestPriceDetails && (
                                      <Grid>
                                        {
                                              this.state.bestPriceDetails.bestMonthlyPrice && (
                                                <Typography component="p">
                                                  Monthly Packages from
                                                  {' '}
                                                  {floor(this.state.bestPriceDetails.bestMonthlyPrice.avgRate)}
$ per Month
                                                                                                </Typography>
                                              )
                                            }
                                        {
                                              this.state.bestPriceDetails.bestClassPrice && (
                                                <Typography component="p">
                                                  Class Packages from
                                                  {' '}
                                                  {floor(this.state.bestPriceDetails.bestClassPrice.avgRate)}
$ per Class
                                                                                                </Typography>
                                              )
                                            }
                                      </Grid>
                                    )}
                                </CardContent>

                              <CardActions style={{ height: 'auto' }}>
                                  <Grid container>
                                    <Grid item xs={12} sm={6}>
                                      <Button onClick={this.scrollToTop.bind(this, this.schoolCalendar)} color="primary" style={{ width: '100%' }} dense raised>
                                        Schedule
                                      </Button>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                      <Button onClick={this.scrollToTop.bind(this, this.schoolPrice)} style={{ width: '100%', backgroundColor: '#4caf50' }} dense raised>
                                        Pricing
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </CardActions>
                            </Fragment>
                          </Card>
                        </Grid>
                      </Grid>
                  </Grid>

                </Grid>
                {' '}
                {/* container, school-info ends */}

              </Grid>
            </Grid>
                {' '}
                {/* container, school-header ends */}

                <Grid container className={classes.content}>
              <Grid item xs={12}>
                <ClassTypeList
                  locationName={null}
                  mapView={false}
                  filters={{ schoolId, limit: this.state.seeMoreCount }}
                  splitByCategory={false}
                  classTypeBySchool="classTypeBySchool"
                  handleSeeMore={this.handleSeeMore}
                  classTimesData={this.props.classTimesData}
                  schoolView
                />
              </Grid>
            </Grid>
                <Grid container className={classes.content}>
              <Grid ref={(el) => { this.schoolCalendar = el; }} item xs={12}>
                <Card className={classes.content}>
                  {/* <MyCalender {...this.props}/> */
                    <ManageMyCalendar schoolCalendar {...this.props} />
                  }
                </Card>
              </Grid>
            </Grid>
                <Grid container className={classes.content}>
              <Grid item xs={12}>
                <Card className={classes.content}>
                  <div className="content-list-heading ">
                    <h2 style={{ textAlign: 'center' }}>
Media
                      <figure>
  <img style={{ maxWidth: '100%' }} src="/images/heading-line.png" />
</figure>
                    </h2>
                  </div>
                  <MediaDetails
                    schoolId={schoolId}
                    schoolView
                  />
                </Card>
              </Grid>
            </Grid>
                <div ref={(el) => { this.schoolPrice = el; }}>
              <Grid container className={classes.content}>
                <Grid item xs={12} sm={12}>
                      <Card className={classes.content}>
                        <div className="content-list-heading ">
                          <h2 style={{ textAlign: 'center', paddingTop: 8 }}>
Prices
                            <figure>
  <img style={{ maxWidth: '100%' }} src="/images/heading-line.png" />
</figure>
                          </h2>
                        </div>
                        {(enrollmentFee && enrollmentFee.length == 0) && (classPricing && classPricing.length == 0) && (monthlyPricing && monthlyPricing.length == 0)
                          ? (
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Button onClick={this.handlePricingInfoRequestModal} color="primary" dense raised>
                                Request Pricing Info
                            </Button>
                          </div>
) : ''
                        }
                        <Grid container className={classes.themeSpacing}>
                          {enrollmentFee && enrollmentFee.length > 0
                            ? (
<Grid item xs={12} sm={6} md={6} lg={4} style={{ backgroundColor: '#dddd' }}>
                            <Typography align="center" type="headline" className={classes.themeSpacing}>
                                Enrollment Fee
                              </Typography>
                            <Grid container style={{ display: 'inline-table' }}>
                                {
                                  enrollmentFee && enrollmentFee.map((enrollmentFee, index) => (
                                        <Grid key={index} item xs={12} md={8} sm={12}  style= {{height:'100%', maxWidth: '100%', boxShadow: 'none'}} className={`${classes.card} ${classes.roundPapers} price-card-container`}>
                                          <Card style= {{height:'100%',boxShadow: 'none',border: '1px solid rgb(217, 205, 205)'}} className={`${classes.card} ${classes.roundPapers} price-card-container`}>
                                          <Grid item xs={6} sm={6} className={classes.content}>
                                            <Typography align="justify" type="title">
                                              {enrollmentFee.name}
                                            </Typography>
                                            <Typography component="p" style={{color: '#7f7f7f'}}>
                                              <b>Covers:</b> {
                                                isArray(enrollmentFee.selectedClassType) ?
                                                  enrollmentFee.selectedClassType.map((classType,index) => {
                                                    return <span key={index.toString()}>{classType.name} </span>
                                                  }) : "None"
                                              }
                                            </Typography>
                                          </Grid>
                                          <Grid item xs={3} sm={3} className={classes.content}>
                                            <Typography className={classes.dollarStyles}>
                                                ${enrollmentFee.cost}
                                                <Typography  style={{color: '#7f7f7f'}}>
                                                  &nbsp;for enrollment.
                                                </Typography>
                                            </Typography>
                                          </Grid>
                                          <Grid item xs={3} sm={3} className={classes.content} style={{textAlign: 'end',margin:'auto'}}>
                                            <Button className={classes.purchaseBtn} onClick={this.handlePurcasePackage.bind(this, "EP", enrollmentFee._id, schoolId)} color="accent" style={{ boxShadow: 'none'}} dense raised>
                                              <i class="material-icons">add_shopping_cart</i>
                                           </Button>
                                          </Grid>
                                        </Card>
                                        </Grid>
                                    ))
                                }
                              </Grid>
                          </Grid>
) : ''}

                          {classPricing && classPricing.length > 0
                            ? (
<Grid item xs={12} sm={6} md={6} lg={4} style={{ backgroundColor: 'aliceblue' }}>
                              <Typography align="center" type="headline" style={{ color: '#7f7f7f' }} className={classes.themeSpacing}>
                                Class Packages
                              </Typography>
                              <Grid container style={{ display: 'inline-table' }}>
                                {
                                  classPricing && classPricing.map((classPrice, index) => (
                                      <Grid key={index} item xs={12} md={8} sm={12} style={{maxWidth: '100%'}}>
                                        <Card style= {{height:'100%',boxShadow: 'none',border: '1px solid rgb(217, 205, 205)'}} className={`${classes.card} ${classes.roundPapers} price-card-container`}>
                                          <Grid item xs={6} sm={6} className={classes.content}>
                                            <Typography align='justify' type="title">
                                              {classPrice.packageName}
                                            </Typography>
                                            <Typography component="p" style={{color: '#7f7f7f'}}>
                                              <b>Expiration:</b> {(classPrice.expDuration && classPrice.expPeriod) ? `${classPrice.expDuration} ${classPrice.expPeriod}` : "None"}
                                            </Typography>
                                            <Typography component="p" style={{color: '#7f7f7f'}}>
                                              <b>Covers:</b> {
                                                isArray(classPrice.selectedClassType) ?
                                                  classPrice.selectedClassType.map((classType,index) => {
                                                    return <span key={index.toString()}>{classType.name} </span>
                                                  }) : "None"
                                              }
                                            </Typography>
                                          </Grid>
                                          <Grid item xs={3} sm={3} className={classes.content}>
                                            <Typography className={classes.dollarStyles} component="p">
                                              ${classPrice.cost}
                                              <Typography style={{color: '#7f7f7f'}}>for {classPrice.noClasses > 1 ? `${classPrice.noClasses} classes`: `${classPrice.noClasses} class` } </Typography>
                                            </Typography>
                                          </Grid>
                                          <Grid item xs={3} sm={3} className={classes.content} style={{textAlign: 'end',margin:'auto'}}>
                                            <Button  className={classes.purchaseBtn} onClick={this.handlePurcasePackage.bind(this, "CP", classPrice._id, schoolId)} color="accent" className={classes.purchaseBtn} dense raised>
                                              <i class="material-icons">add_shopping_cart</i>
                                           </Button>
                                          </Grid>
                                        </Card>
                                      </Grid>
                                    ))
                                }

                              </Grid>
                            </Grid>
)
                            : ''
                          }

                          {monthlyPricing && monthlyPricing.length > 0
                            ? (
<Grid item xs={12} sm={6} md={6} lg={4} style={{ backgroundColor: '#fafafa' }}>
                              <Typography align="justify" type="headline" className={classes.themeSpacing}>
                                Monthly Packages
                              </Typography>
                              <Grid container style={{ display: 'inline-table' }}>
                                {
                                  monthlyPricing && monthlyPricing.map((monthPrice, index) => {
                                    let paymentType = '';
                                    if (monthPrice.pymtType) {
                                      if (monthPrice.pymtType.autoWithDraw && monthPrice.pymtType.payAsYouGo) {
                                        paymentType += 'Automatic Withdrawal and Pay As You Go';
                                      } else if (monthPrice.pymtType.autoWithDraw) {
                                        paymentType += 'Automatic Withdrawal';
                                      } else if (monthPrice.pymtType.payAsYouGo) {
                                        paymentType += 'Pay As You Go';
                                      } else if (monthPrice.pymtType.payUpFront) {
                                        paymentType += 'Pay Up Front';
                                      }
                                    }
                                    return (
                                      <Grid key={index} item xs={12} md={8} sm={12} style={{ maxWidth: '100%' }}>
                                        <Card style={{ height: '100%', boxShadow: 'none', border: '1px solid rgb(217, 205, 205)' }} className={`${classes.card} price-card-container ${classes.roundPapers}`}>
                                          <Grid item xs={5} sm={5} className={classes.content}>
                                              <Typography align="justify" type="title">
                                                  {monthPrice.packageName}
                                                </Typography>
                                              <Typography component="p" style={{ color: '#7f7f7f' }}>
                                                  <b>Payment Method:</b> 
{' '}
{monthPrice.pymtMethod}
                                                </Typography>
                                              {
                                                  monthPrice.pymtType && (
                                                    <Fragment>
                                                      <Typography component="p" style={{ color: '#7f7f7f' }}>
                                                        <b>Payment Type:</b> 
{' '}
{paymentType}
                                                      </Typography>
                                                    </Fragment>
                                                  )
                                                }
                                              <Typography component="p" style={{ color: '#7f7f7f' }}>
                                                  <b>Covers:</b> 
{' '}
{
                                                    isArray(monthPrice.selectedClassType) ?
                                                      monthPrice.selectedClassType.map((classType,index) => {
                                                        return <span key={index.toString()}>{classType.name} </span>
                                                      }) : "None"
                                                  }
                                                </Typography>
                                            </Grid>
                                          {
                                              _.isEmpty(monthPrice.pymtDetails) ? 'None'
                                              : monthPrice.pymtDetails.map((payment) => (
                                                  <Grid item xs={4} sm={4} key={index.toString()}>
                                                    <Typography>
                                                      <Typography className={classes.dollarStyles}>
                                                      ${payment.cost}
                                                        <Typography style={{color: '#7f7f7f'}}>per month for</Typography>
                                                        <Typography style={{color: '#7f7f7f'}}> {payment.month} months</Typography>
                                                      </Typography>
                                                    </Typography>
                                                  </Grid>
                                                ))
                                            }
                                          <Grid item xs={3} sm={3} style={{ textAlign: 'end', margin: 'auto' }}>
                                              <Button className={classes.purchaseBtn} onClick={this.handlePurcasePackage.bind(this, 'MP', monthPrice._id, schoolId)} color="accent" style={{ boxShadow: 'none' }} dense raised>
                                                <i className="material-icons">add_shopping_cart</i>
                                              </Button>
                                            </Grid>
                                        </Card>
                                      </Grid>
                                    );
                                  })
                                }
                              </Grid>
                            </Grid>
)
                            : ''
                          }
                        </Grid>
                      </Card>
                    </Grid>
              </Grid>
            </div>

                {/* <div className="card">
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
            </div> */}


                {/* <div className="row">
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
                    </div> */}

                <div className="row">
              <div className="col-sm-12">
                        <div className="card">
                    <div className="card-content">
                            <div className="">
                            <div className="thumb about-school-top">
                            <figure className="about-head-image">
                            <div className="overlay-box" />
                            {/* <img src={ schoolData.mainImage || defaultSchoolImage }/> */}
                          </figure>
                            <div className="col-md-12" />
                            <div className="col-md-12" />

                          </div>
                          </div>
                          </div>
                    <div className="card-footer">
                            <div className="col-sm-12" />
                          </div>
                  </div>
                      </div>
              {/* <div className="col-sm-12">
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
                        </div> */}
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
              {/* <div className="row  card">
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
                              const skillClass = SkillClass.find({classTypeId: classTypeData._id}).fetch();
                              return skillClass.map((skillClassData, index) => {
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
                        </div> */}

              {/* <div className="card col-sm-12">
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
                        </div> */}
              {/* <div className="card">
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
                        </div> */}
            </div>
              </div>
              </div>
          </DocumentTitle>
  );
}
