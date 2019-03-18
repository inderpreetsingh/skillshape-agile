import { isEmpty,get } from "lodash";
import Icon from "material-ui/Icon";
import Paper from "material-ui/Paper";
import { withStyles } from "material-ui/styles";
import PropTypes from "prop-types";
import React, { Component, Fragment } from "react";
import { scroller } from "react-scroll";
import styled from "styled-components";
import ClassTimeButton from "/imports/ui/components/landing/components/buttons/ClassTimeButton.jsx";
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
import ClassTimesList from "/imports/ui/components/landing/components/classTimes/ClassTimesList.jsx";
import NonUserDefaultDialogBox from "/imports/ui/components/landing/components/dialogs/NonUserDefaultDialogBox.jsx";
import ThinkingAboutAttending from "/imports/ui/components/landing/components/dialogs/ThinkingAboutAttending";
import TrendingIcon from "/imports/ui/components/landing/components/icons/Trending.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import { Text } from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";
import { CLASS_TIMES_CARD_WIDTH } from "/imports/ui/components/landing/constants/classTypeConstants.js";
import { ContainerLoader } from "/imports/ui/loading/container.js";
import { formatDate, getUserFullName, withPopUp } from "/imports/util";






const styles = {
  classTimeIcon: {
    fontSize: helpers.baseFontSize,
    color: helpers.black,
    marginRight: helpers.rhythmDiv / 2
  },
  descriptionPanelCloseIcon: {
    top: 0,
    left: `calc(100% - ${helpers.rhythmDiv * 4}px)`,
    fontSize: helpers.baseFontSize,
    color: helpers.black,
    padding: helpers.rhythmDiv,
    borderRadius: "50%",
    background: "white",
    position: "absolute",
    boxShadow: helpers.buttonBoxShadow,
    cursor: "pointer"
  },
  descriptionPanel: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    transition: "transform 0.2s linear",
    maxHeight: "272px",
    transformOrigin: "50% 100%",
    paddingTop: helpers.rhythmDiv,
    marginBottom: helpers.rhythmDiv,
    overflowY: "auto",
    background: "white",
    borderRadius: 5
  }
};

const ClassTimeContainer = styled.div`
  ${helpers.flexHorizontalSpaceBetween} flex-direction: column;
  max-width: 100%;
  width: 100%;
  height: ${props => (props.inPopUp ? "auto" : "380px")};
  padding: ${helpers.rhythmDiv * 2}px;
  position: relative;
  z-index: 0;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    margin: 0 auto;
  }

  @media screen and (max-width: ${helpers.mobile + 100}px) {
    max-width: ${props => (props.inPopUp ? "100%" : CLASS_TIMES_CARD_WIDTH)}px;
  }
`;

const ClassTimeContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  flex-grow: 1;
`;

const ClassTimeContentInnerWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  ${props => props.showDescription && "filter: blur(2px);"};
`;

const ClassTimeDescription = Text.extend`
  padding: ${helpers.rhythmDiv}px;
  width: calc(100% - 24px);
  max-height: 100%;
  overflow-y: auto;
`;

const ClassTypeName = Text.withComponent("h4").extend`
  font-size: ${props =>
    props.inPopUp ? helpers.baseFontSize * 1.5 : helpers.baseFontSize * 1.25}px;
  text-align: center;
  text-transform: capitalize;
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const ScheduleType = Text.extend`
  font-weight: 300;
  text-align: center;
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const RecurringDate = Text.extend`
  font-size: 14px;
  font-weight: 500;
`;

const ClassTimeLocationWrapper = styled.div`
  padding: 0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const EventLocation = styled.div`
  ${helpers.flexCenter} justify-content: flex-start;
  flex-direction: ${props => (!props.locationTitle ? "column-reverse" : "row")};
  margin-bottom: ${helpers.rhythmDiv / 2}px;
`;

let ClassTimeRoom, ClassTimeLocation;
ClassTimeLocation = ClassTimeRoom = styled.div`
  ${helpers.flexCenter};
  ${props => !props.locationTitle && "align-items: flex-start;"};
`;

ClassTimeLocation = ClassTimeLocation.extend`
  margin-right: ${helpers.rhythmDiv}px;
`;

let LocationTitle, LocationDetails, RoomName;
LocationTitle = LocationDetails = RoomName = Text.extend`
  font-weight: 300;
  font-style: italic;
  margin: 0;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  transition: 0.1s ease-in opacity;
  ${props => (props.showCard ? "opacity: 0" : "opacity: 1")};
  ${props => props.marginBottom && `margin-bottom: ${helpers.rhythmDiv}px;`};
`;

const TrendingWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top: 0;
  right: ${helpers.rhythmDiv * 2}px;
  left: auto;
`;

const ClassTimesCardWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  max-height: auto;
  // max-height: ${props =>
    props.inPopUp ? "auto" : "296px"}; // computed height
`;

const ClickableLink = Text.extend`
  cursor: pointer;
  font-style: italic;
  font-weight: 300;
  display: inline;

  &:hover {
    text-decoration: underline;
  }
`;

const Trending = () => {
  return (
    <TrendingWrapper>
      <TrendingIcon />
    </TrendingWrapper>
  );
};

class ClassTime extends Component {
  state = {
    isLoading: false,
    showCard: false,
    showDescription: false,
    thinkingAboutAttending: false,
    description: this.props.desc
  };

  componentWillReceiveProps(nextProps) {
    if (this.state.description != nextProps.desc) {
      this.setState(state => {
        return {
          ...state,
          description: nextProps.desc
        };
      });
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.escFunction, false);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.escFunction, false);
  }

  componentWillMount() {
    Meteor.call(
      "classTypeLocationRequest.getUserRecord",
      this.props.classTypeId,
      (err, res) => {
        if (err) {
        } else {
          this.setState({ notification: res });
        }
      }
    );
  }

  handleShowMoreLinkClick = event => {
    this.handleDescriptionState(true)(event);
  };

  escFunction = event => {
    if (event.keyCode === 27) {
      this.handleDescriptionState(false)(event);
    }
  };

  

  handleNonUserDialogBoxState = state => e => {
    this.setState({
      nonUserDialogBox: state
    });
  };

  reformatNewFlowData = () => {
    const newData = {};
    let { formattedClassTimesDetails, scheduleType } = this.props;
    scheduleType = scheduleType.toLowerCase();
    return formattedClassTimesDetails;
  };

  setDescription = description => {
    if (this.state.description !== description) {
      this.setState(state => {
        return {
          ...state,
          description
        };
      });
    }
  };

  handleShowMoreLinkClick = completeDesc => event => {
    this.setDescription(completeDesc);
    this.handleDescriptionState(true)(event);
  };

  returnClickableLink(completeDesc, shortDesc) {
    return (
      <span>
        {shortDesc}{" "}
        <ClickableLink onClick={this.handleShowMoreLinkClick(completeDesc)}>
          click for more info.
        </ClickableLink>
      </span>
    );
  }

  getScheduleTypeFormatted = () => {
    const { startDate, endDate, scheduleType, addToCalendar } = this.props;
    const classScheduleType = scheduleType.toLowerCase();

    if (classScheduleType === "recurring") {
      const strAsDesc =
        "This is a Closed Series. Enrollment closes once the first class starts. If you join the class, you are enrolled in all the classes in the series.";

      return (
        <Fragment>
          <ScheduleType>
            {addToCalendar == "closed"
              ? this.returnClickableLink(strAsDesc, "This is closed series.")
              : "This is a series class time."}{" "}
            {<br />}
          </ScheduleType>
        </Fragment>
      );
    } else if (classScheduleType === "onetime") {
      /* Adding manual small letters splitted schedule type one time*/
      const strAsDesc =
        "This is a Closed Single/set. Enrollment closes once the first class starts. If you join the class, you are enrolled in all the classes in the series.";

      return (
        <ScheduleType>
          {addToCalendar == "closed"
            ? this.returnClickableLink(strAsDesc, "This is closed single/set.")
            : "This is a single/set class time."}{" "}
          {<br />}
        </ScheduleType>
      );
    }
    return (
      <ScheduleType>
        {`This is an ${classScheduleType} class time.`}
      </ScheduleType>
    );
  };

  getWrapperClassName = addToCalendar =>
    addToCalendar ? "add-to-calendar" : "remove-from-calendar";

  getOuterClockClassName = addToCalendar =>
    addToCalendar ? "add-to-calendar-clock" : "remove-from-calendar-clock";

  getDotColor = addToCalendar =>
    addToCalendar ? helpers.primaryColor : helpers.cancel;

  getCalenderButton = (addToCalender, formattedClassTimesDetails) => {
    const iconName = addToCalender ? "add_circle_outline" : "delete";
    // const label = addToCalender ? "Remove from Calender" :  "Add to my Calendar";

    return (
      <div style={{ display: "flex" }}>
        <FormGhostButton
          onClick={() => {
            this.setState({
              thinkingAboutAttending: true,
              addToCalendar: addToCalender
            });
          }}
          label="Thinking About Attending"
        />
      </div>
    );
  };

  scrollTo(name) {
    scroller.scrollTo(name || "content-container", {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart"
    });
  }

 

  getClassTimeRoomInfo = () => {
    const { selectedLocation, classes } = this.props;

    if (
      isEmpty(selectedLocation) ||
      (typeof selectedLocation.rooms === "undefined" ||
        !selectedLocation.rooms.length)
    ) {
      return null;
    }

    const { rooms } = selectedLocation;

    return (
      <ClassTimeRoom>
        <Icon className={classes.classTimeIcon}>{"meeting_room"}</Icon>
        <RoomName>{rooms.map(room => room.name).join(",")}</RoomName>
      </ClassTimeRoom>
    );
  };

  getClassTimeLocation = () => {
    // debugger;
    const { selectedLocation, classes } = this.props;

    if (isEmpty(selectedLocation)) {
      return null;
    }

    let eventAddress = "";
    const addressComponents = ["address", "city", "state", "country"];
    const eventLocationTitle = selectedLocation.title || "";
    addressComponents.forEach(component => {
      if (selectedLocation[component])
        eventAddress += ", " + selectedLocation[component];
    });
    eventAddress = eventAddress.replace(",", "");

    const RoomInfo = this.getClassTimeRoomInfo();
    return (
      <ClassTimeLocationWrapper>
        <EventLocation locationTitle={eventLocationTitle} roomInfo={RoomInfo}>
          <ClassTimeLocation locationTitle={eventLocationTitle}>
            <Icon className={classes.classTimeIcon}>{"location_on"}</Icon>
            <LocationTitle>
              {eventLocationTitle ? eventLocationTitle : eventAddress}
            </LocationTitle>
          </ClassTimeLocation>
          {this.getClassTimeRoomInfo()}
        </EventLocation>
        {eventLocationTitle && (
          <LocationDetails>{eventAddress}</LocationDetails>
        )}
      </ClassTimeLocationWrapper>
    );
  };

  

  handleDescriptionState = descriptionState => e => {
    e.stopPropagation();
    this.setState(state => {
      return {
        ...state,
        showDescription: descriptionState
      };
    });
  };

  render() {
    // debugger;
    const {
      selectedLocation,
      desc,
      startDate,
      endDate,
      scheduleType,
      name,
      classes,
      inPopUp,
      formattedClassTimesDetails,
      onModalClose,
      editMode,
      classTimeData,
      onEditClassTimesClick,
      schoolId,
      params,
      classTypeId,
      popUp,
      schoolData,
      enrollmentIds,
      schoolName
    } = this.props;
    // const formattedClassTimes = formatDataBasedOnScheduleType(this.props);
    const {
      thinkingAboutAttending,
      description,
      addToCalendar,
      notification
    } = this.state;
    const {_id:classTimeId} = classTimeData || {};
    // console.group("formattedClassTimes");
    // console.groupEnd();

    //const showDescription = this.showDescription(formattedClassTimes);
    const {selectedLocation:{timeZone}} = classTimeData;
    const {name:classTimeName,classTypeName:{name:className}} = classTimeData;
    const dotColor = this.getDotColor(this.props.addToCalendar);
    const title = `${className}: ${classTimeName}`; 
    return (
      <Fragment>
        {" "}
        {formattedClassTimesDetails.totalClassTimes > 0 && (
          <Fragment>
            {this.state.isLoading && <ContainerLoader />}
            {this.state.nonUserDialogBox && (
              <NonUserDefaultDialogBox
                title={"Sign In"}
                content={"You need to sign in to add classes"}
                open={this.state.nonUserDialogBox}
                onModalClose={this.handleNonUserDialogBoxState(false)}
              />
            )}
            {thinkingAboutAttending &&
              !editMode && (
                <ThinkingAboutAttending
                  schoolId = {schoolId}
                  open={thinkingAboutAttending}
                  onModalClose={() => {
                    this.setState({ thinkingAboutAttending: false });
                  }}
                  name= {title}
                  params = {params}
                  classTypeId = {classTypeId}
                  classTimeId = {classTimeId}
                  popUp={popUp}
                  schoolName={schoolName ? schoolName : schoolData && get(schoolData[0],'name','School')}
                />
              )}
            <div>
              <ClassTimeContainer
                editMode
                onClick={this.handleDescriptionState(false)}
                inPopUp={inPopUp}
                className={`class-time-bg-transition ${editMode ? 'add-to-calendar' : this.getWrapperClassName(
                  this.props.addToCalendar
                )}`}
                key={this.props._id}
              >
                <ClassTimeContent>
                  {/*Class type name */}
                  <ClassTypeName inPopUp={inPopUp}>{`${name}`}</ClassTypeName>

                  <ClassTimeContentInnerWrapper
                    showDescription={this.state.showDescription}
                  >
                    {/* Schedule type */}
                    {this.getScheduleTypeFormatted()}

                    {/* Class Location */}
                    {this.getClassTimeLocation()}

                    {scheduleType === "recurring" && (
                      <RecurringDate>
                        Between {formatDate(startDate, "MMM")} and{" "}
                        {formatDate(endDate, "MMM")}
                      </RecurringDate>
                    )}

                    {/* class times */}
                    <ClassTimesCardWrapper inPopUp={inPopUp}>
                      <ClassTimesList
                        inPopUp={true}
                        show={true}
                        formattedClassTimes={this.reformatNewFlowData()}
                        scheduleType={scheduleType}
                        timeZone={timeZone}
                      />
                    </ClassTimesCardWrapper>
                  </ClassTimeContentInnerWrapper>

                  {/* description */}
                  <Paper
                    className={classes.descriptionPanel}
                    style={{
                      transform: this.state.showDescription
                        ? "scaleY(1)"
                        : "scaleY(0)"
                    }}
                  >
                    <Icon
                      classes={{
                        root: classes.descriptionPanelCloseIcon
                      }}
                      onClick={this.handleDescriptionState(false)}
                    >
                      {"close"}
                    </Icon>

                    <ClassTimeDescription>{description}</ClassTimeDescription>
                  </Paper>
                </ClassTimeContent>

                {/* View All times button */}
                <ButtonsWrapper>
                  {this.state.description && (
                    <ButtonWrapper marginBottom>
                      <ClassTimeButton
                        white
                        fullWidth
                        icon
                        iconName="description"
                        label="View Description"
                        onClick={e => {
                          e.stopPropagation();

                          this.setState(state => {
                            return {
                              ...state,
                              description: desc ? desc : state.description,
                              showDescription: true
                            };
                          });
                        }}
                      />
                    </ButtonWrapper>
                  )}
                  {!editMode ? (
                    <ButtonWrapper>
                      {this.getCalenderButton(this.props.addToCalendar)}
                    </ButtonWrapper>
                  ) : (
                    <ButtonWrapper>
                      <FormGhostButton
                        label="Edit ClassTime"
                        icon
                        iconName="edit"
                        onClick={onEditClassTimesClick(classTimeData)}
                      />
                    </ButtonWrapper>
                  )}
                </ButtonsWrapper>
                {this.props.isTrending && <Trending />}
              </ClassTimeContainer>{" "}
            </div>
          </Fragment>
        )}
      </Fragment>
    );
  }
}

ClassTime.propTypes = {
  description: PropTypes.string.isRequired,
  addToCalendar: PropTypes.bool.isRequired,
  scheduleType: PropTypes.string.isRequired,
  inPopUp: PropTypes.bool, // True => the class time cards are present inside of pop up in homepage,  false => are on the classtype page
  isTrending: PropTypes.bool,
  editMode: PropTypes.bool
};

ClassTime.defaultProps = {
  editMode: false
};
// export default withPopUp(withShowMoreText(ClassTime, { description: "desc"}));
export default withPopUp(withStyles(styles)(ClassTime));
