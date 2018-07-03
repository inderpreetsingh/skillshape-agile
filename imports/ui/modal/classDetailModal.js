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

import {checkForAddToCalender ,formatDate, formatTime, formatClassTimesData, formatDataBasedOnScheduleType} from '/imports/util';

import ClassTimesBoxes from "/imports/ui/components/landing/components/classTimes/ClassTimesBoxes.jsx";
import ClassTimeButton from "/imports/ui/components/landing/components/buttons/ClassTimeButton.jsx";
import ClassTime from "/imports/ui/components/landing/components/classTimes/ClassTime.jsx";
import MetaInfo from "/imports/ui/components/landing/components/helpers/MetaInfo.jsx";

import Events from "/imports/util/events";
import * as settings from "/imports/ui/components/landing/site-settings.js";

const formStyle = formStyles();

const styles = theme => {
  console.log("theme", theme);
  return {
    dialogPaper: {
      overflowX: 'hidden',
      padding: helpers.rhythmDiv * 2,
      maxWidth: 400
    },
    dialogAction: {
      width: '100%',
      marginTop: helpers.rhythmDiv * 2
    },
    gridItem: {
      padding: 0
    },
    gridContainer: {
      padding: helpers.rhythmDiv
    },
    image: {
      verticalAlign: "middle",
      width: "100%",
      height: "100%",
      objectFit: 'cover'
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
      alignItems: "center",
    },
    bottomSpace: {
      marginBottom: helpers.rhythmDiv * 2
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

const Heading = styled.h2`
  font-size: ${helpers.baseFontSize * 1.5}px;
  font-family: ${helpers.specialFont};
  font-weight: 400;
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  color: ${helpers.primaryColor};
  text-transform: ${props => props.textTransform ? props.textTransform : 'capitalize'};
  text-align: center;
  width: 100%;
  line-height: 1;
  margin-top: ${props => props.marginTop}px;
`;

const Text = styled.p`
  margin: 0;
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  font-weight: 400;
  line-height: 1;
  margin-bottom: ${props => props.marginBottom}px;
  text-align: ${props => props.center ? 'center' : 'left'};
`;

const EventWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween};
  max-width: 400px;
  width: 100%;
`;

const ImageContainer = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  ${helpers.coverBg};
  background-position: 50% 50%;
  background-image: url('${props => props.src}');
`;

const EventName = Heading.extend`
  font-size: ${helpers.baseFontSize * 1.5}px;
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const Event = styled.div`
  ${helpers.flexCenter}
  flex-direction: column;
  padding-right: ${helpers.rhythmDiv*2}px;
`;

const ScheduleType = Text.extend``;

const EventDesc = Text.extend``;

const Capitalize = styled.span`
  text-transform: capitalize;
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
    } else {
      return settings.classTypeImgSrc;
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
    const { eventData, fullScreen, classes, clickedDate, classInterestData, classTimesData } = this.props;
    console.log("eventData____________", classTimesData,eventData);
    let classTypeData = ClassTimes.findOne({ _id: eventData.classTimeId });
    const formattedClassTimesDetails = formatDataBasedOnScheduleType(eventData,false); // false is for not hiding the past schedule types.
    const allFormattedClassTimeDetails = formatClassTimesData(classTimesData,false).filter(classTime => classTime._id != eventData.classTimeId) //false is for not hiding the past schedule types;
    classTypeData.formattedClassTimesDetails = formattedClassTimesDetails;
    console.log(classTypeData,eventData,formattedClassTimesDetails,"event ................................. data");
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
              <Grid container classes={{typeItem: classes.gridItem}}>
                <EventWrapper>
                  <ImageContainer src={this.getImageSrc(classType, school)}>
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

                    {/*<img
                      className={classes.image}
                      src={this.getImageSrc(classType, school)}
                    />*/}
                  </ImageContainer>
                  <Event>
                    <EventName>{eventData.name}</EventName>
                    <ScheduleType>{eventData.scheduleType}</ScheduleType>
                  </Event>
                </EventWrapper>
                <Grid item sm={12} md={12} xs={12} classes={{typeItem: classes.gridItem}}>
                  <EventDesc>{eventData.desc || ""}</EventDesc>
                </Grid>
                <Grid item xs={6} classes={{typeItem: classes.gridItem}}>
                  <div className={classes.iconWithDetailContainer}>
                    <div className="circle-icon" className={classes.iconStyle}>
                      <Icon className="material-icons" color="primary">
                        date_range
                      </Icon>
                    </div>
                    <div>
                      <Text>DATE</Text>
                      <Text>{clickedDate}</Text>
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
                      <Text>TIME</Text>
                      <Text>{`${
                        eventData.eventStartTime
                      }`}</Text>
                    </div>
                  </div>
                </Grid>
              </Grid>

              <Grid
                container
                style={{ marginTop: "16px" }}
              >
                <Heading marginTop={helpers.rhythmDiv}>
                  {classType && classType.name.toLowerCase()}
                </Heading>
                  {/*<Typography component="p" style={{marginBottom:'20px'}}>
										{classType && classType.desc}
									</Typography>*/}
                <div className={classes.iconWithDetailContainer + ' ' + classes.bottomSpace}>
                  <div className="circle-icon" className={classes.iconStyle}>
                    <Icon className="material-icons" color="primary">
                      account_balance
                    </Icon>
                  </div>
                  <div>
                    <Text>SCHOOL</Text>
                    <Text>
                      {school && school.name}
                    </Text>
                  </div>
                </div>
                <div className={classes.iconWithDetailContainer}>
                  <div className="circle-icon" className={classes.iconStyle}>
                    <Icon className="material-icons" color="primary">
                      location_on
                    </Icon>
                  </div>
                  <div>
                    <Text>LOCATION</Text>
                    <Text>
                      {location &&
                        `${location.address}, ${location.city}, ${
                          location.state
                        }`}
                    </Text>
                  </div>
                </div>
                <Grid item xs={12}>
                  {classTypeData &&
                    classTypeData.ageMin && (
                      <MetaInfo data={classTypeData.ageMin} title="Age: " />
                  )}
                  {classTypeData &&
                    classTypeData.gender &&
                    classTypeData.gender !== "All" && (
                      <MetaInfo data={classTypeData.gender} title="Gender: " />
                  )}

                  {classTypeData &&
                  classTypeData.experienceLevel &&
                  classTypeData.experienceLevel == "All" ? (
                    <MetaInfo data={"All levels are welcomed"} title="Experience: " />
                  ) :
                  (<MetaInfo data={classTypeData.experienceLevel} title="Experience: " />)}
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
                      <ClassTimeButton
                        fullWidth
                        label="View Class Type"
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
                      <ClassTimeButton
                        fullWidth
                        noMarginBottom
                        label="View School"
                        onClick={() => this.goToSchoolPage(school)}
                      />
                    </Grid>
                  </Grid>
                )}
              </Grid>

              <Grid
                container
                style={{ marginTop: "16px" }}
              >
                <div>
                  <Heading marginTop={helpers.rhythmDiv} textTransform="none">This class time is part of</Heading>
                  <ClassTimesBoxes
                    inPopUp={true}
                    withSlider={false}
                    classTimesData={[classTypeData]}
                    classInterestData={classInterestData}
                  />
                </div>

                <div>
                  <Heading marginTop={helpers.rhythmDiv} textTransform="none">More class times for <Capitalize>{classType.name.toLowerCase()}</Capitalize></Heading>
                  <ClassTimesBoxes
                    inPopUp={true}
                    withSlider={false}
                    classTimesData={allFormattedClassTimeDetails}
                    classInterestData={classInterestData}
                  />
                </div>
              </Grid>

              <DialogActions className={classes.dialogAction}>
                <Button
                  onClick={() => {
                    this.props.closeEventModal(false, null);
                  }}
                  color="primary"
                >
                  Close
                </Button>
              </DialogActions>

              {/*fullScreen && (

              )*/}
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
