import get from 'lodash/get';
import includes from 'lodash/includes';
import isEmpty from "lodash/isEmpty";
import ClearIcon from "material-ui-icons/Clear";
// import { blue500 } from 'material-ui/styles/colors';
import Dialog, { DialogActions, DialogTitle, withMobileDialog } from "material-ui/Dialog";
import Grid from "material-ui/Grid";
import Icon from "material-ui/Icon";
import IconButton from "material-ui/IconButton";
import { withStyles } from "material-ui/styles";
import moment from "moment";
import React from "react";
import { browserHistory, Link } from "react-router";
import styled from "styled-components";
import "/imports/api/classInterest/methods";
import ClassTimes from "/imports/api/classTimes/fields";
import "/imports/api/classTimes/methods";
import ClassTimeButton from "/imports/ui/components/landing/components/buttons/ClassTimeButton.jsx";
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
import ClassTimesBoxes from "/imports/ui/components/landing/components/classTimes/ClassTimesBoxes.jsx";
import MetaInfo from "/imports/ui/components/landing/components/helpers/MetaInfo.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import * as settings from "/imports/ui/components/landing/site-settings.js";
import { ContainerLoader } from "/imports/ui/loading/container";
import { checkForAddToCalender, formatClassTimesData, formatDataBasedOnScheduleType, formStyles, imageExists } from "/imports/util";
import Events from "/imports/util/events";
import { withPopUp } from "/imports/util";



const styles = theme => {
  return {
    dialogPaper: {
      overflowX: "hidden",
      padding: helpers.rhythmDiv * 2,
      maxWidth: 450,
      maxHeight: "80vh",
      height: 'auto'
    },
    dialogTitleRoot: {
      width: "100%",
      position: "absolute",
      right: helpers.rhythmDiv,
      top: helpers.rhythmDiv,
      padding: 0,
      marginBottom: 0
    },
    dialogAction: {
      width: "100%",
      justifyContent: "space-between"
    },
    dialogTitle: {
      position: "relative"
    },
    gridItem: {
      padding: 0
    },
    gridContainer: {
      padding: helpers.rhythmDiv
    },
    aboutClassGridContainer: {
      marginTop: helpers.rhythmDiv * 2,
      padding: `0 ${helpers.rhythmDiv * 3}px`
    },
    image: {
      verticalAlign: "middle",
      width: "100%",
      height: "100%",
      objectFit: "cover"
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
    iconButton: {
      height: "auto",
      width: "auto"
    },
    iconWithDetailContainer: {
      display: "inline-flex",
      alignItems: "center",
      marginTop: "10px"
    },
    bottomSpace: {},
    about: {
      width: "100%",
      fontSize: "21px",
      padding: "5px",
      backgroundColor: "aliceblue"
    }
  };
};

// const ButtonWrapper = styled.div`
//   width: 100%;
//   ${flexCenter}
//   padding: ${rhythmDiv}px 0px;
// `;



const ActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ButtonWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const InnerWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const ClassTimesWrapper = styled.div`
  padding: ${helpers.rhythmDiv * 2}px;
  width: 100%;
  display: flex;
  border: 2px solid #ccc;
`;

const IconsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-left: ${helpers.rhythmDiv}px;
`;

const IconsRowWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  > div {
    width: 50%;
  }
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
  margin-bottom: ${helpers.rhythmDiv}px;
  color: ${helpers.primaryColor};
  text-transform: ${props =>
    props.textTransform ? props.textTransform : "capitalize"};
  text-align: center;
  width: 100%;
  line-height: 1;
  margin-top: ${props => props.marginTop}px;
`;

const ClassTimeCardsWrapper = styled.div`
  width: 100%;
`;

const Text = styled.p`
  margin: 0;
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  font-weight: 400;
  line-height: 1;
  margin-bottom: ${props => props.marginBottom}px;
  text-align: ${props => (props.center ? "center" : "left")};
`;

const EventHeader = styled.div`
  ${helpers.flexHorizontalSpaceBetween};
  justify-content: space-around;
  max-width: 400px;
  width: 100%;

  @media screen and (max-width: 400px) {
    flex-direction: column;
  }
`;

const ImageContainer = styled.div`
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  ${helpers.coverBg};
  border-radius: 0%;
  margin-right: ${helpers.rhythmDiv * 2}px;
  margin-bottom: ${helpers.rhythmDiv}px;
  background-position: 50% 50%;
  background-image: url('${props => props.src}');
`;

const DialogTitleWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  font-family: ${helpers.specialFont};
  width: 100%;
`;

const EventName = Heading.extend`
  font-size: ${helpers.baseFontSize * 1.5}px;
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv}px;
`;
const ConfirmationDialog = styled.div`
  margin: 8px;
`;
const Div = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
`;
const ClassTypeDescription = styled.div`
  border: 2px solid black;
  width: 100%;
  padding: 7px;
  margin-top: 5px;
  margin-bottom: 12px;
  border-radius: 10px;
`;

const Event = styled.div`
  ${helpers.flexCenter} flex-direction: column;
  padding-right: ${helpers.rhythmDiv * 2}px;
`;

const EventDesc = Text.extend``;

const Capitalize = styled.span`
  text-transform: capitalize;
`;

const Italic = styled.span`
  font-style: italic;
`;

class ClassDetailModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      error: false,
      classImg: this.props.classType ? this.props.classType.classTypeImg : ""
    };
  }

  componentWillMount() {
    Meteor.call(
      "school.findSuperAdmin",
      null,
      this.props.eventData.schoolId,
      (err, res) => {
        if (res)
          if (get(res, 'superAdmin', null) == Meteor.userId() || includes(get(res, 'admins', []), Meteor.userId())) {
            this.setState({ adminAccess: true });
          }
      }
    );
    if (this.props.eventData) {
      const {
        schoolId,
        classTypeId,
        classTimeId,
        locationId
      } = this.props.eventData;
      this.setState({
        isLoading: true,
        removeFromCalendarPopUp: false,
        permanentlyRemove: false
      });
      Meteor.call(
        "classTimes.getClassTimes",
        { schoolId, classTypeId, classTimeId, locationId },
        (error, { school, classTimes, classType, location }) => {
          let addToMyCalender = checkForAddToCalender(classTimes);
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

  componentDidMount = () => {
    const { classType, school } = this.state;
    this.setImageSrc(classType, school);
  };

  componentDidUpdate = () => {
    const { classType, school } = this.state;
    this.setImageSrc(classType, school);
  };

  formatScheduleType = scheduleType => {
    const classScheduleType = scheduleType.toLowerCase();

    if (classScheduleType === "recurring" || classScheduleType === "ongoing")
      return (
        <Text>
          <Capitalize>{classScheduleType}</Capitalize>
        </Text>
      );

    return <Text>{"One Time"}</Text>;
  };

  formatScheduleType = scheduleType => {
    const classScheduleType = scheduleType.toLowerCase();

    if (classScheduleType === "recurring" || classScheduleType === "ongoing")
      return (
        <Text>
          <Capitalize>{classScheduleType}</Capitalize>
        </Text>
      );

    return <Text>{"One Time"}</Text>;
  };

  setImageSrc = (classType, school) => {
    imageExists((classType && classType.classTypeImg) || "")
      .then(res => {
        if (this.state.classImg !== classType.classTypeImg)
          this.setState({ classImg: classType.classTypeImg });
      })
      .catch(() => {
        if (this.state.classImg !== settings.classTypeImgSrc)
          this.setState({ classImg: settings.classTypeImgSrc });
      });

    // if (classType && classType.classTypeImg) {
    //   return classType.classTypeImg;
    // } else {
    //   return settings.classTypeImgSrc;
    // }
  };

  removeMyClassInterest = (event, classTimeId) => {
    this.setState({ isLoading: true });
    Meteor.call(
      "classInterest.removeClassInterestByClassTimeId",
      { userId: Meteor.userId(), classTimeId },
      (error, res) => {
        this.setState({ isLoading: false, error });
        this.props.closeEventModal(false, null);
        if (error) {
        }
      }
    );
  };

  handleClassInterest = (event, eventData) => {
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
  /*
  1.open dialog box
  2.Cancel=close
  3.Ok=functionality
  */
  handleRemoveFromMyCalendar = props => {
    Meteor.call(
      "classInterest.deleteEventFromMyCalendar",
      props.eventData.classTimeId,
      props.clickedDate
    );
    props.closeEventModal(false, null);
  };
  handlePermanentlyRemove = props => {
    Meteor.call(
      "classTimes.permanentlyRemove",
      props.eventData.classTimeId,
      props.clickedDate
    );
    this.setState({ removeFromCalendarPopUp: false });
    props.closeEventModal(false, null);
  };

  render() {
    const {
      isLoading,
      error,
      school,
      classType,
      location,
      addToMyCalender,
      classImg,
      classDetail
    } = this.state;
    const {
      eventData,
      fullScreen,
      classes,
      clickedDate,
      classInterestData,
      params,
      schoolName
    } = this.props;
    let enrollmentIds = get(this.state.classType, 'enrollmentIds', []);
    const classTypeData = ClassTimes.findOne({ _id: eventData.classTimeId });
    const formattedClassTimesDetails = formatDataBasedOnScheduleType(
      eventData,
      false
    ); // false is for not hiding the past schedule types.
    const classTimesData = ClassTimes.find({
      classTypeId: eventData.classTypeId
    });
    const allFormattedClassTimeDetails = formatClassTimesData(
      classTimesData,
      true
    ).filter(classTime => {
      if (
        classTime._id != eventData.classTimeId &&
        classTime.formattedClassTimesDetails &&
        classTime.formattedClassTimesDetails.totalClassTimes > 0
      ) {
        return true;
      }
      return false;
    }); // false is for not hiding the past schedule types;
    classTypeData.formattedClassTimesDetails = formattedClassTimesDetails;
    const scheduleDetails = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ];
    let route = this.state.adminAccess ? '/classdetails-instructor' : '/classdetails-student';
    return (
      <Dialog
        fullScreen={true}
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
              <Grid container classes={{ typeItem: classes.gridItem }}>
                <DialogTitle classes={{ root: classes.dialogTitleRoot }}>
                  <DialogTitleWrapper>
                    <IconButton
                      color="primary"
                      onClick={() => this.props.closeEventModal(false, null)}
                      classes={{ root: classes.iconButton }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </DialogTitleWrapper>
                </DialogTitle>

                <EventHeader>
                  <ImageContainer src={classImg}>
                    {
                      <div
                        style={{ position: "absolute", top: 10, right: 10 }}
                      />
                    }
                  </ImageContainer>
                  <Event center={classImg !== ""}>
                    <EventName>
                      {`${classType && classType.name.toLowerCase()}: ${
                        eventData.name
                        }`}
                    </EventName>
                    {/* {this.formatScheduleType(eventData.scheduleType)} */}
                  </Event>
                </EventHeader>
                {/* <Grid
                  item
                  sm={12}
                  md={12}
                  xs={12}
                  classes={{ typeItem: classes.gridItem }}
                >
                  <EventDesc>{eventData.desc || ""}</EventDesc>
                </Grid> */}
                <Grid item xs={6} classes={{ typeItem: classes.gridItem }}>
                  <div className={classes.iconWithDetailContainer}>
                    <div  className={classes.iconStyle}>
                      <Icon className="material-icons" color="primary">
                        date_range
                      </Icon>
                    </div>
                    <div>
                      <Text>
                        <Italic>Date</Italic>
                      </Text>
                      <Text>{clickedDate}</Text>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className={classes.iconWithDetailContainer}>
                    <div  className={classes.iconStyle}>
                      <Icon className="material-icons" color="primary">
                        av_timer
                      </Icon>
                    </div>
                    <div>
                      <Text>
                        <Italic>Time</Italic>
                      </Text>
                      <Text>
                        {/* timeUnits are added for mins,hours */}
                        {`${eventData.eventStartTime}`}

                        {eventData &&
                          eventData.durationAndTimeunits &&
                          "  For " + eventData.durationAndTimeunits}
                        {/* {scheduleDetails.map(value => {
                          if (classTypeData.formattedClassTimesDetails[value]) {
                            return (
                              classTypeData.formattedClassTimesDetails[value][0]
                                .duration +
                              " " +
                              classTypeData.formattedClassTimesDetails[value][0]
                                .timeUnits
                            );
                          }
                        })} */}
                      </Text>
                    </div>
                  </div>
                </Grid>
              </Grid>
              <center style={{ width: "100%" }}>
                {this.props.routeName !== "EmbedSchoolCalanderView" && (
                  <Grid container style={{ padding: "8px" }}>
                    {/*Removed previous two button and added two new button according to new task*/}
                    {/* <Grid item xs={6}>
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
                    </Grid> */}
                    {this.props &&
                      this.props.type == "attending" && (
                        <Grid item xs={6} style={{ margin: "auto" }}>
                          <ClassTimeButton
                            fullWidth
                            label="Remove from my Calendar"
                            noMarginBottom
                            onClick={() => {
                              this.setState({ removeFromCalendarPopUp: true });
                            }}

                          />
                        </Grid>
                      )}

                    {this.state.adminAccess && (
                      <Grid item xs={6} style={{ margin: "auto" }}>
                        <ClassTimeButton
                          fullWidth
                          noMarginBottom
                          label="Permanently Delete "
                          onClick={() => {
                            this.setState({ permanentlyRemove: true });
                          }}
                        />
                      </Grid>
                    )}

                    <Grid item xs={6} style={{ margin: "auto" }}>
                      {/* <Link to={{ pathname: route, state: { props: this.props,state:this.state} }}>
                        <ClassTimeButton
                          fullWidth
                          noMarginBottom
                          label="Class Detail"
                          onClick={()=>{}}
                        />
                        </Link> */}
                    </Grid>
                  </Grid>
                )}
              </center>
              <Grid container style={{ marginTop: "16px" }}>
                {!isEmpty(classTypeData) && (
                  <div style={{ backgroundColor: "", width: "100%" }}>
                    <Heading marginTop={helpers.rhythmDiv} textTransform="none">
                      This class is part of this Series:
                    </Heading>
                    <div>
                      <ClassTimesBoxes
                        inPopUp={true}
                        withSlider={false}
                        classTimesData={[classTypeData]}
                        classInterestData={classInterestData}
                        onModalClose={() => { this.props.closeEventModal(false, null) }}
                        params={params}
                        schoolName={schoolName}
                        enrollmentIds={enrollmentIds}
                      />
                    </div>
                  </div>
                )}
                <Grid container className={classes.aboutClassGridContainer}>
                  {/*<Typography component="p" style={{marginBottom:'20px'}}>
      							{classType && classType.desc}
                  </Typography>*/}
                  <center className={classes.about}>
                    {" "}
                    <i>{` About ${classType.name}`}</i>
                  </center>
                  <IconsWrapper>
                    <IconsRowWrapper>
                      <div
                        className={
                          classes.iconWithDetailContainer +
                          " " +
                          classes.bottomSpace
                        }
                      >
                        <div
                          className={classes.iconStyle}
                        >
                          <Icon className="material-icons" color="primary">
                            account_balance
                          </Icon>
                        </div>
                        <div>
                          <Text>{school && school.name}</Text>
                        </div>
                      </div>

                      <div
                        className={
                          classes.iconWithDetailContainer +
                          " " +
                          classes.bottomSpace
                        }
                      >
                        {/* <div
                        className="circle-icon"
                        className={classes.iconStyle}
                      >
                        <Icon className="material-icons" color="primary">
                          class
                        </Icon>
                      </div> */}
                        {/* <div>
                        <Text>
                          <Italic>Class Name</Italic>
                        </Text>
                        <Text>
                          <Capitalize>{`${classType &&
                            classType.name.toLowerCase()}`}</Capitalize>
                        </Text>
                      </div> */}
                      </div>
                    </IconsRowWrapper>
                    {location &&
                      location.address && (
                        <div className={classes.iconWithDetailContainer}>
                          <div
                            className={classes.iconStyle}
                          >
                            <Icon className="material-icons" color="primary">
                              location_on
                            </Icon>
                          </div>
                          <div>
                            <Text>
                              {location &&
                                `${location.address}, ${location.city}, ${
                                location.state
                                }`}
                            </Text>
                          </div>
                        </div>
                      )}
                  </IconsWrapper>
                  <Grid item xs={12}>
                    {classTypeData &&
                      classTypeData.ageMin &&
                      classTypeData.ageMax && (
                        <MetaInfo
                          data={`  ${classTypeData.ageMin} to ${
                            classTypeData.ageMax
                            }`}
                          title={"Age:" + " "}
                        />
                      )}
                    {classTypeData &&
                      classTypeData.gender &&
                      classTypeData.gender !== "All" && (
                        <MetaInfo
                          data={classTypeData.gender}
                          title={"Gender: " + ""}
                        />
                      )}

                    {classTypeData &&
                      classTypeData.experienceLevel &&
                      classTypeData.experienceLevel == "All" ? (
                        <MetaInfo
                          data={"  All levels are welcome"}
                          title={"Experience:  " + " "}
                        />
                      ) : classTypeData.experienceLevel && (
                        <MetaInfo
                          data={`  ${classTypeData.experienceLevel}`}
                          title={"Experience:  " + " "}
                        />
                      )}
                    {classType &&
                      classType.desc && (
                        <MetaInfo
                          data={`  ${classType.desc}`}
                          title={"Description:"}
                          marginBottom={16}
                        />
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
                </Grid>

                {!isEmpty(allFormattedClassTimeDetails) && (
                  <div style={{ backgroundColor: "aliceblue", width: "100%" }}>
                    <Heading marginTop={helpers.rhythmDiv} textTransform="none">
                      More class times for{" "}
                      <Capitalize>{classType.name.toLowerCase()}</Capitalize>
                    </Heading>
                    <div>
                      <ClassTimesBoxes
                        inPopUp={true}
                        withSlider={false}
                        classTimesData={allFormattedClassTimeDetails}
                        classInterestData={classInterestData}
                        onModalClose={() => { this.props.closeEventModal(false, null) }}
                        params={params}
                        schoolName={schoolName}
                        enrollmentIds={enrollmentIds}
                      />
                    </div>
                  </div>
                )}
              </Grid>

              <DialogActions className={classes.dialogAction}>
                {/* <ClassTimeButton
                  fullWidth
                  label="View Class"
                  noMarginBottom
                  onClick={() =>
                    this.goToClassTypePage(
                      classType.name,
                      eventData.classTypeId
                    )
                  }
                />
                <ClassTimeButton
                  fullWidth
                  noMarginBottom
                  label="View School"
                  onClick={() => this.goToSchoolPage(school)}
                />
                <ClassTimeButton
                  fullWidth
                  noMarginBottom
                  label="Close"
                  onClick={() => {
                    this.props.closeEventModal(false, null);
                  }}
                /> */}
                <ActionButtons>
                  <ButtonWrapper>
                    <FormGhostButton
                      darkGreyColor
                      label="Close"
                      onClick={() => {
                        this.props.closeEventModal(false, null);
                      }}
                    />
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <FormGhostButton
                      label="View Class"
                      onClick={() =>
                        this.goToClassTypePage(
                          classType.name,
                          eventData.classTypeId
                        )
                      }
                    />
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <FormGhostButton
                      label="View School"
                      onClick={() => this.goToSchoolPage(school)}
                    />
                  </ButtonWrapper>
                </ActionButtons>
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
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="xs"
          open={this.state.removeFromCalendarPopUp}
          aria-labelledby="confirmation-dialog-title"
        >
          <DialogTitle id="confirmation-dialog-title">Confirmation</DialogTitle>
          <ConfirmationDialog>
            Do You Really want to remove this event from your Calendar.
          </ConfirmationDialog>
          <DialogActions>
            {/* <Button
              color="primary"
              onClick={() => this.setState({ removeFromCalendarPopUp: false })}
            >
              Cancel
            </Button> */}
            <FormGhostButton
              darkGreyColor
              label="Cancel"
              onClick={() => this.setState({ removeFromCalendarPopUp: false })}
            />
            {/* <Button
              color="primary"
              onClick={() => this.handleRemoveFromMyCalendar(this.props)}
            >
              Ok
            </Button> */}
            <FormGhostButton
              label="Ok"
              onClick={() => this.handleRemoveFromMyCalendar(this.props)}
            />
          </DialogActions>
        </Dialog>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="xs"
          open={this.state.permanentlyRemove}
          aria-labelledby="confirmation-dialog-title"
        >
          <DialogTitle id="confirmation-dialog-title">Confirmation</DialogTitle>
          <ConfirmationDialog>
            Permanently delete this event from the class time.
          </ConfirmationDialog>
          <DialogActions>
            {/* <Button
              color="primary"
              onClick={() => this.setState({ permanentlyRemove: false })}
            >
              Cancel
            </Button> */}
            <FormGhostButton
              label=" Cancel"
              onClick={() => this.setState({ permanentlyRemove: false })}
            />
            {/* <Button
              color="primary"
              onClick={() => this.handlePermanentlyRemove(this.props)}
            >
              Ok
            </Button> */}
            <FormGhostButton
              label="Ok"
              onClick={() => this.handlePermanentlyRemove(this.props)}
            />
          </DialogActions>
        </Dialog>
      </Dialog>
    );
  }
}

export default withMobileDialog()(withStyles(styles)(withPopUp(ClassDetailModal)));
