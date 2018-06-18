import React, { Fragment } from "react";
import moment from "moment";
import styled from "styled-components";
import { formStyles } from "/imports/util";
// import { blue500 } from 'material-ui/styles/colors';

import Dialog, { DialogActions, withMobileDialog } from "material-ui/Dialog";

import Icon from "material-ui/Icon";
import Card, { CardActions, CardContent, CardMedia } from "material-ui/Card";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import Grid from "material-ui/Grid";
import { withStyles } from "material-ui/styles";

import { ContainerLoader } from "/imports/ui/loading/container";
import { browserHistory, Link } from "react-router";
import ClassType from "/imports/api/classType/fields";
import ClassTimes from "/imports/api/classTimes/fields";
import SLocation from "/imports/api/sLocation/fields";

import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";
import {
  flexCenter,
  rhythmDiv,
} from "/imports/ui/components/landing/components/jss/helpers";
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';

import "/imports/api/classInterest/methods";
import "/imports/api/classTimes/methods";
import { checkForAddToCalender } from "/imports/util";
import ClassTimeButton from "/imports/ui/components/landing/components/buttons/ClassTimeButton.jsx";
import ClassTime from "/imports/ui/components/landing/components/classTimes/ClassTime.jsx";
import Events from "/imports/util/events";

const formStyle = formStyles();

const styles = theme => {
  console.log("theme", theme);
  return {
    dialogPaper: {
      overflowX: 'hidden',
      padding: helpers.rhythmDiv * 2,
      maxWidth: 400
    },
    image: {
      verticalAlign: "middle",
      width: "100%",
      height: "100%"
    },
    imageContainer: {
      backgroundColor: "#000",
      display: "inline-flex",
      alignItems: "center",
      color: "#fff",
      width: "100%",
      minHeight: 200,
      justifyContent: "center",
      backgroundSize: "auto",
      height: "200px"
    },
    iconStyle: {
      marginRight: "5px"
    },
    iconWithDetailContainer: {
      display: "inline-flex",
      alignItems: "center"
    }
  };
};


const ButtonWrapper = styled.div`
  width: 100%;
  ${flexCenter}
  padding: ${rhythmDiv}px 0px;
`;
const InnerWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const ClassTimesWrapper = styled.div`
  padding: 16px;
  width: 100%;
  display: flex;
  border: 2px solid #ccc;
`;

const scheduleDetails = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

const ImageContent = styled.p`
  margin: 0;
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  font-weight: 400;
`;

const EventName = ImageContent.extend`
  margin: ${helpers.rhythmDiv * 2}px 0;
  color: ${helpers.primaryColor};
  font-size: ${helpers.baseFontSize * 2}px;
`;

const EventDesc = ImageContent.extend`
`;

class ClassDetailModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      error: false
    };
  }

  componentWillMount() {
    // console.log("classTimes.getClassTimes calling start -->>",this.props);
    if (this.props.eventData) {
      const {
        schoolId,
        classTypeId,
        classTimeId,
        locationId
      } = this.props.eventData;
      this.setState({
        isLoading: true
      });
      Meteor.call(
        "classTimes.getClassTimes",
        { schoolId, classTypeId, classTimeId, locationId },
        (error, { school, classTimes, classType, location }) => {
          // console.log("classTimes.getClassTimes res -->>");
          // console.log("classTimes.getClassTimes error -->>",error);
          let addToMyCalender = checkForAddToCalender(classTimes);
          console.log("addToCalender________", addToMyCalender);
          this.setState({
            isLoading: false,
            school,
            classTimes,
            classType,
            location,
            error,
            addToMyCalender
          });
        }
      );
    } else {
      this.setState({
        error: "Event Data not found!!!!",
        isLoading: false
      });
    }
  }

  getImageSrc = (classType, school) => {
    console.log("getImageSrc classtype school", classType, school);

    if (classType && classType.classTypeImg) {
      return classType.classTypeImg;
    } else if (school && school.mainImage) {
      return school.mainImage;
    } else {
      return "/images/logo-location.png";
    }
  };

  removeMyClassInterest = (event, classTimeId) => {
    console.log("<<_____removeMyClassInterest-->>>>", classTimeId);
    this.setState({ isLoading: true });
    Meteor.call(
      "classInterest.removeClassInterestByClassTimeId",
      { classTimeId },
      (error, res) => {
        this.setState({ isLoading: false, error });
        this.props.closeEventModal(false, null);
        if (error) {
          console.error("Error :-", error);
        }
      }
    );
  };

  handleClassInterest = (event, eventData) => {
    console.log("eventData====>", eventData);
    if (Meteor.userId()) {
      const doc = {
        classTimeId: eventData.classTimeId,
        classTypeId: eventData.classTypeId,
        schoolId: eventData.schoolId,
        userId: Meteor.userId()
      };
      // Start Loading
      this.setState({ isLoading: true });
      Meteor.call("classInterest.addClassInterest", { doc }, (err, res) => {
        console.log(res, err);
        // Stop loading and close modal.
        this.setState({ isLoading: false, error: err });
        this.props.closeEventModal(false, null);
      });
    } else {
      // Show Login popup
      Events.trigger("loginAsUser");
      this.props.closeEventModal(false, null);
    }
  };

  renderdaySchedule = (data, eventData) => {
    let type = eventData.scheduleType;
    const result = data.map((item, index) => {
      const { startTime, duration } = item;
      let startDate = moment(item.startDate).format("DD:MM:YYYY");
      let endDate = moment(item.endDate).format("DD:MM:YYYY");
      // let endDate = new Date(eventData.endDate);
      let date = new Date(startTime);
      let day = date.getDay();
      let scheduleDay = scheduleDetails[day - 1];
      const eventStartTime = moment(startTime).format("hh:mm");
      const eventEndTime = moment(new Date(startTime))
        .add(duration, "minutes")
        .format("hh:mm");
      if (type == "OnGoing") {
        return `Every ${scheduleDay} at ${eventStartTime}`;
      } else if (type == "recurring") {
        return `Every ${scheduleDay} at ${eventStartTime} from ${startDate} to ${endDate}`;
      } else if (type == "oneTime") {
        return `${scheduleDay} ${startDate} at ${eventStartTime}`;
      }
    });
    return result.toString();
  };

  goToSchoolPage = school => {
    browserHistory.push(`/schools/${school.slug}`);
    this.props.closeEventModal(false, null);
  };
  goToClassTypePage = (className, classId) => {
    browserHistory.push(`/classType/${className}/${classId}`);
    this.props.closeEventModal(false, null);
  };

  render() {
    // console.log("ClassDetailModal render props -->>", this.props);
    // console.log("ClassDetailModal render state -->>", this.state);
    const {
      isLoading,
      error,
      school,
      classType,
      classTimes,
      location,
      addToMyCalender
    } = this.state;
    const { eventData, fullScreen, classes, clickedDate } = this.props;
    console.log("eventData____________", eventData);
    let classTypeData = ClassTimes.findOne({ _id: eventData.classTimeId });
    return (
      <Dialog
        fullScreen={false}
        open={this.props.showModal}
        onClose={() => this.props.closeEventModal(false, null)}
        aria-labelledby="responsive-dialog-title"
        classes={{
          paper: classes.dialogPaper
        }}
      >
        {isLoading && <ContainerLoader />}
        {error && <div style={{ color: "red" }}>{error}</div>}
        {!isLoading &&
          !error && (
            <Grid container style={{ padding: "16px" }}>
              <Grid container>
                <Grid item sm={12} md={12} xs={12}>
                  <CardMedia style={{ height: 200 }}>
                    <div className={classes.imageContainer}>
                      {/*<div style={{position: "absolute", top: 10, right: 10}}>
											{
												eventData.attending && (
													<Button fab aria-label="delete" color="accent" onClick={(event) => this.removeMyClassInterest(event, eventData.classTimeId)} className={classes.button}>
													   <Icon
															className="material-icons"
														>
															delete
														</Icon>
													</Button>
												)
											}
										</div>*/}

                      <img
                        className={classes.image}
                        src={this.getImageSrc(classType, school)}
                      />
                    </div>
                  </CardMedia>
                </Grid>
                <Grid item sm={12} md={12} xs={12}>
                  <Grid item sm={12} md={12} xs={12}>
                    <EventName>{eventData.name}</EventName>
                  </Grid>
                  <Grid item sm={12} md={12} xs={12}>
                    <EventDesc>{eventData.desc || ""}</EventDesc>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <div className={classes.iconWithDetailContainer}>
                    <div className="circle-icon" className={classes.iconStyle}>
                      <Icon className="material-icons" color="primary">
                        date_range
                      </Icon>
                    </div>
                    <div>
                      <Typography type="caption">DATE</Typography>
                      <Typography type="caption">{clickedDate}</Typography>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className={classes.iconWithDetailContainer}>
                    <div className="circle-icon" className={classes.iconStyle}>
                      <Icon className="material-icons" color="primary">
                        av_timer
                      </Icon>
                    </div>
                    <div>
                      <Typography type="caption">TIME</Typography>
                      <Typography type="caption">{`${
                        eventData.eventStartTime
                      }`}</Typography>
                    </div>
                  </div>
                </Grid>
              </Grid>
              <Grid
                container
                style={{
                  padding: "16px",
                  border: "2px solid #ccc",
                  marginTop: "16px"
                }}
              >
                <Grid item xs={12}>
                  {eventData.scheduleType == "OnGoing" ? (
                    <Typography component="p">
                      This is an Ongoing class.
                    </Typography>
                  ) : (
                    ""
                  )}
                  {eventData.scheduleType == "oneTime" ? (
                    <Typography>This is a non-repeating class.</Typography>
                  ) : (
                    ""
                  )}
                  {eventData.scheduleType == "recurring" ? (
                    <Typography>
                      This is a Repeating Class with START/END.
                    </Typography>
                  ) : (
                    ""
                  )}
                </Grid>
                <Grid item xs={12}>
                  {eventData.scheduleDetails && (
                    <Fragment>
                      <Typography
                        type="headline"
                        style={{ marginBottom: "20px", marginTop: "20px" }}
                        component="h2"
                      >
                        Times:
                      </Typography>
                      {Object.keys(eventData.scheduleDetails).map(
                        (day, index) => {
                          return (
                            <Typography type="caption">
                              {this.renderdaySchedule(
                                eventData.scheduleDetails[day],
                                eventData
                              )}
                            </Typography>
                          );
                        }
                      )}
                    </Fragment>
                  )}
                  {addToMyCalender ? (
                    <ClassTimeButton
                      icon
                      onClick={event => {
                        this.handleClassInterest(event, eventData);
                      }}
                      label="Add to my Calender"
                      iconName="add_circle_outline"
                    />
                  ) : (
                    <ClassTimeButton
                      icon
                      onClick={event =>
                        this.removeMyClassInterest(event, eventData.classTimeId)
                      }
                      label="Remove from calendar"
                      iconName="delete"
                    />
                  )}
                </Grid>
              </Grid>
              <Grid
                container
                style={{ border: "2px solid #ccc", marginTop: "16px" }}
              >
                <Grid item sm={12} md={12} xs={12}>
                  <Typography type="headline" component="h2">
                    {classType && classType.name}
                  </Typography>
                  {/*<Typography component="p" style={{marginBottom:'20px'}}>
										{classType && classType.desc}
									</Typography>*/}
                </Grid>
                <Grid item xs={12}>
                  <div className={classes.iconWithDetailContainer}>
                    <div className="circle-icon" className={classes.iconStyle}>
                      <Icon className="material-icons" color="primary">
                        account_balance
                      </Icon>
                    </div>
                    <div>
                      <Typography type="caption">SCHOOL</Typography>
                      <Typography type="caption">
                        {school && school.name}
                      </Typography>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className={classes.iconWithDetailContainer}>
                    <div className="circle-icon" className={classes.iconStyle}>
                      <Icon className="material-icons" color="primary">
                        location_on
                      </Icon>
                    </div>
                    <div>
                      <Typography type="caption">LOCATION</Typography>
                      <Typography type="caption">
                        {location &&
                          `${location.address}, ${location.city}, ${
                            location.state
                          }`}
                      </Typography>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} style={{ padding: "16px" }}>
                  {classTypeData &&
                    classTypeData.ageMin && (
                      <Typography type="caption">
                        Age:{classTypeData.ageMin}
                      </Typography>
                    )}
                  {classTypeData &&
                    classTypeData.gender &&
                    classTypeData.gender !== "All" && (
                      <Typography type="caption">
                        {classTypeData.gender}
                      </Typography>
                    )}
                  {classTypeData &&
                  classTypeData.experienceLevel &&
                  classTypeData.experienceLevel == "All" ? (
                    <Typography type="caption">
                      Experience: All levels are welcomed
                    </Typography>
                  ) : (
                    <Typography type="caption">
                      {classTypeData &&
                        classTypeData.experienceLevel &&
                        `Experience: ${classTypeData.experienceLevel}`}
                    </Typography>
                  )}
                </Grid>
                {/*<Grid item xs={6}>
									<div className={classes.iconWithDetailContainer}>
										<div className="circle-icon" className={classes.iconStyle}>
											<Icon
												className="material-icons"
												color="primary"
											>
												av_timer
											</Icon>
										</div>
										<div>
											<Typography type="caption" >TIME</Typography>
											<Typography type="caption" >{`${eventData.eventStartTime} to ${eventData.eventEndTime}`}</Typography>
										</div>
									</div>
								</Grid>*/}
                {this.props.routeName !== "EmbedSchoolCalanderView" && (
                  <Grid container style={{ padding: 8 }}>
                    <Grid item xs={6}>
                      <PrimaryButton
                        fullWidth
                        noMarginBottom
                        label="View Class Type"
                        boxShadow
                        noMarginBottom
                        onClick={() =>
                          this.goToClassTypePage(
                            classType.name,
                            eventData.classTypeId
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <PrimaryButton
                        fullWidth
                        noMarginBottom
                        label="View School"
                        boxShadow
                        noMarginBottom
                        onClick={() => this.goToSchoolPage(school)}
                      />
                    </Grid>
                  </Grid>
                )}
              </Grid>
              {fullScreen && (
                <Grid container>
                  <Grid item xs={12}>
                    <DialogActions>
                      <Button
                        onClick={() => {
                          this.props.closeEventModal(false, null);
                        }}
                        color="primary"
                      >
                        Close
                      </Button>
                    </DialogActions>
                  </Grid>
                </Grid>
              )}
              {/*<Typography type="p" style={{marginBottom:'20px', marginTop:'20px'}}>
								Entire Class Dates
							</Typography>
							<Grid container>
								<Grid item xs={6}>
									<div>
										<div style={{display: 'inline-flex'}}>
											<Typography type="caption" >FROM : </Typography>
											<Typography type="caption" >{ eventData.startDate ? moment(eventData.startDate).format("Do MMM YYYY") : "NA"}</Typography>
										</div>
									</div>
									<div>
										<div style={{display: 'inline-flex'}}>
											<Typography type="caption" >TO : </Typography>
											<Typography type="caption" >{ eventData.endDate ? moment(eventData.endDate).format("Do MMM YYYY") : "NA"}</Typography>
										</div>
									</div>
								</Grid>*/}
              {/*<Grid item xs={6}>
									<div className={classes.iconWithDetailContainer}>
										<div className="circle-icon" className={classes.iconStyle}>
											<Icon
												className="material-icons"
												color="accent"
											>
												warning
											</Icon>
										</div>
										<div>
											<Typography type="caption" >This is a class series with start and end date.</Typography>
										</div>
									</div>
							</Grid>
								</Grid>*/}

              {/*<ButtonWrapper>
						  <PrimaryButton icon iconName="add_circle_outline" label="Join This Class" onClick={this.props.onJoinClassButtonClick}/>
						</ButtonWrapper>*/}
            </Grid>
          )}
      </Dialog>
    );
  }
}

export default withMobileDialog()(withStyles(styles)(ClassDetailModal));
