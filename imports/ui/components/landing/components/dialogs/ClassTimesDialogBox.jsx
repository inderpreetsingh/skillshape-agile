import { isEmpty } from "lodash";
import ClearIcon from "material-ui-icons/Clear";
import Dialog, { DialogActions, DialogContent, DialogTitle, withMobileDialog } from "material-ui/Dialog";
import Grid from "material-ui/Grid";
import Icon from "material-ui/Icon";
import IconButton from "material-ui/IconButton";
import { MuiThemeProvider, withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import moment from "moment";
import PropTypes from "prop-types";
import React from "react";
import { browserHistory } from "react-router";
import { scroller } from "react-scroll";
import styled from "styled-components";
import ClassInterest from "/imports/api/classInterest/fields";
import School from "/imports/api/school/fields";
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
import ClassTimesBoxes from "/imports/ui/components/landing/components/classTimes/ClassTimesBoxes";
import MetaInfo from "/imports/ui/components/landing/components/helpers/MetaInfo.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import muiTheme from "/imports/ui/components/landing/components/jss/muitheme.jsx";
import { classTypeImgSrc } from "/imports/ui/components/landing/site-settings.js";
import Events from "/imports/util/events";
import withImageExists from "/imports/util/withImageExists";

const ButtonWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;
const styles = {
  dialog: {
    padding: `${helpers.rhythmDiv}px`,
    overflowX: "hidden"
  },
  dialogPaper: {
    maxWidth: 400,
    background: "white",
    margin: helpers.rhythmDiv,
    overflowY: "auto"
  },
  dialogTitle: {
    // padding: `0 ${helpers.rhythmDiv * 3}px`,
    // paddingTop: helpers.rhythmDiv * 2
    padding: 0
  },
  dialogContent: {
    overflowX: "hidden",
    padding: 0
  },
  iconButton: {
    position: "absolute",
    top: -24,
    right: -8,
    zIndex: 3
    // boxShadow: helpers.buttonBoxShadow
  },
  iconWithDetailContainer: {
    display: "inline-flex",
    alignItems: "center"
  },
  bottomSpace: {
    marginBottom: helpers.rhythmDiv * 2
  },
  dataMargin: {
    marginLeft: "13px"
  },
  dialogAction: {
    width: "100%",
    justifyContent: "space-between",
    padding: helpers.rhythmDiv * 2
  },
  about: {
    width: "100%",
    fontSize: "21px",
    padding: "5px",
    backgroundColor: "aliceblue"
  }
};
const ClassTypeDescription = styled.div`
  border: 2px solid black;
  width: 100%;
  padding: 7px;
  margin-top: 5px;
  margin-bottom: 12px;
  border-radius: 10px;
`;
const DialogTitleWrapper = styled.div`
  ${helpers.flexCenter} width: 100%;
  padding: 0;
  position: relative;
`;
const Italic = styled.span`
  font-style: italic;
`;
const MyScrollToElement = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  // padding: ${helpers.rhythmDiv * 2}px 0;
  padding-top: ${helpers.rhythmDiv * 2}px;
  @media screen and (max-width: ${helpers.mobile + 100}px) {
    padding: ${helpers.rhythmDiv * 2}px 0;
  }
`;

const ClassContainer = styled.div`
  width: 90%;
  padding: ${helpers.rhythmDiv}px;
  margin: 3px auto;
  border-radius: ${helpers.rhythmDiv}px;
  background: #ffffff;
`;

const ClassContainerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${helpers.rhythmDiv}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ContentWrapper = styled.div`
  max-width: 400px; //Max width which we want for the class time cards
  width: 100%;
  margin: 0 auto;
`;

const ContentHeader = styled.div`
  max-width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 ${helpers.rhythmDiv * 2}px;
  margin-bottom: ${helpers.rhythmDiv * 4}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    ${helpers.flexCenter} flex-direction: column;
  }
`;

const ClassTypeCoverImg = styled.div`
  ${helpers.coverBg} background-position: center center;
  width: 100px;
  height: 100px;
  margin-right: ${helpers.rhythmDiv}px;
  border-radius: 0%;
  background-image: url(${props => props.src});
  flex-shrink: 0;

  @media screen and (max-width: ${helpers.mobile}px) {
    margin-bottom: ${helpers.rhythmDiv}px;
  }
`;

const ClassTimes = styled.div`
  ${helpers.flexCenter} flex-direction: column;
  padding-right: ${helpers.rhythmDiv * 2}px;
  flex-shrink: 1;
`;

const ClassTypeName = styled.h2`
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  text-align: center;
  font-weight: 400;
  font-size: ${helpers.baseFontSize * 2}px;
  color: ${helpers.primaryColor};
  text-transform: capitalize;
  font-family: ${helpers.specialFont};
  line-height: 1;
`;

const ClassTimesFor = styled.p`
  margin: 0;
  margin-bottom ${helpers.rhythmDiv}px;
  font-family: ${helpers.specialFont};
  font-weight: 400;
  font-size: ${helpers.baseFontSize}px;
  color: ${helpers.headingColor};
  line-height: 1;
`;

const CalenderButtonWrapper = styled.div`
  margin: ${helpers.rhythmDiv} 0 0 0;
  ${helpers.flexCenter} justify-content: flex-end;
`;

const ErrorWrapper = styled.span`
  color: red;
  float: right;
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
const ScheduleType = styled.span`
  display: inline-block;
  padding: ${helpers.rhythmDiv}px;
  font-size: 12px;
  font-weight: 500;
  font-family: ${helpers.specialFont};
  background: ${helpers.lightTextColor};
  color: ${helpers.primaryColor};
  border-radius: 2px;
`;

const RequestsClassTimes = styled.div`
  display: flex;
  justify-content: center;
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
const classTypeImgConfig = {
  defaultImage: classTypeImgSrc,
  originalImagePath: "classTypeImg"
};

const ClassTypeCoverWithDefaultImg = withImageExists(
  props => <ClassTypeCoverImg src={props.bgImg} />,
  classTypeImgConfig
);

class ClassTimesDialogBox extends React.Component {
  constructor(props) {
    super(props);

    this.scrollTo("myScrollToElement");
  }
  componentDidMount() {
    if (this.myDiv) {
      this.myDiv.style.backgroundColor = "red";
    }
    setTimeout(() => {
      let divElement = $("#myScrollToElement").offset();
      let offset = divElement.top;
      // send offset of modal to iframe script
      function sendTopOfPopup(e) {
        parent.postMessage(JSON.stringify({ popUpOpened: true, offset }), "*");
      }
      // Call sendTopOfPopup()
      sendTopOfPopup();
    }, 0);
  }
  checkForAddToCalender = data => {
    const userId = Meteor.userId();
    if (isEmpty(data) || isEmpty(userId)) {
      return true;
    } else {
      return isEmpty(
        ClassInterest.find({ classTimeId: data._id, userId }).fetch()
      );
    }
  };

  goToClassTypePage = (className, classId) => {
    browserHistory.push(`/classType/${className}/${classId}`);
    this.props.onModalClose();
  };
  scrollTo(name) {
    scroller.scrollTo(name || "content-container", {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart"
    });
  }
  goToSchoolPage = schoolId => {
    let schoolData = School.findOne(schoolId);
    browserHistory.push(`/schools/${schoolData.slug}`);
    this.props.onModalClose();
  };
  getDatesBasedOnScheduleType = data => {
    let startDate = "";
    let endDate = "";
    const dateFormat = "DD-MM-YYYY";
    const scheduleType = data.scheduleType.toLowerCase();
    const scheduleDetails = data.scheduleDetails;

    if (scheduleType === "recurring") {
      startDate = moment(new Date(data.startDate)).format(dateFormat);
      endDate = moment(new Date(data.endDate)).format(dateFormat);
      //debugger;
      if (startDate == "Invalid date") {
        return `Recurring ending on ${endDate}`;
      } else if (endDate == "Invalid date") {
        return `Recurring starting from ${startDate}`;
      }
      return `Recurring from ${startDate} to ${endDate}`;
    } else if (scheduleType === "ongoing") {
      return `Ongoing`;
    } else {
      startDate = moment(new Date(scheduleDetails["oneTime"].startDate)).format(
        dateFormat
      );
      return `Onetime on ${startDate}`;
    }
  };

  addToMyCalender = data => {
    // check for user login or not
    const userId = Meteor.userId();
    if (!isEmpty(userId)) {
      const doc = {
        classTimeId: data._id,
        classTypeId: data.classTypeId,
        schoolId: data.schoolId,
        userId
      };
      this.handleClassInterest({
        methodName: "classInterest.addClassInterest",
        data: { doc }
      });
    } else {
      // Show Login popup
      Events.trigger("loginAsUser");
    }
  };

  handleClassInterest = ({ methodName, data }) => {
    Meteor.call(methodName, data, (err, res) => {});
  };

  getSchedules = classesData => {
    const ourSchedules = [];

    classesData.forEach(data => {
      const addToCalender = this.checkForAddToCalender(data);

      if (data.scheduleType === "oneTime") {
        // If schedule is one time..
        data.scheduleDetails.oneTime.forEach(currentData => {
          const myScheduleData = JSON.parse(JSON.stringify(data));
          myScheduleData.scheduleDetails.oneTime = { ...currentData };

          ourSchedules.push(
            <MyClassInfo
              data={myScheduleData}
              getDatesBasedOnScheduleType={this.getDatesBasedOnScheduleType}
              addToMyCalender={this.addToMyCalender}
              handleClassInterest={this.handleClassInterest}
              addToCalender={addToCalender}
            />
          );

          // console.info(myScheduleData,"---------------------------");
        });
      } else {
        // If schedule is ongoing or recurring..
        ourSchedules.push(
          <MyClassInfo
            data={data}
            addToCalender={addToCalender}
            getDatesBasedOnScheduleType={this.getDatesBasedOnScheduleType}
            addToMyCalender={this.addToMyCalender}
            handleClassInterest={this.handleClassInterest}
          />
        );
      }
    });

    // console.info(classesData,ourSchedules,"ourSchedules....");

    return ourSchedules;
  };

  render() {
    // const classTimesData = this.normalizeScheduledetails(this.props.classesData);
    const {
      classInterestData,
      classTimesData,
      classes,
      open,
      onModalClose,
      classTypeName,
      classTypeImg,
      errorText,
      hideClassTypeOptions,
      handleClassTimeRequest,
      experienceLevel,
      desc,
      gender,
      filters,
      ageMin,
      ageMax,
      _id,
      schoolId,
      params
    } = this.props;
    {
    }

    return (
      <Dialog
        open={open}
        onClose={onModalClose}
        aria-labelledby="modal"
        classes={{ root: classes.dialog, paper: classes.dialogPaper }}
      >
        <MuiThemeProvider theme={muiTheme}>
          <MyScrollToElement id="myScrollToElement" ref={c => (this.myDiv = c)}>
            <DialogTitle classes={{ root: classes.dialogTitle }}>
              <DialogTitleWrapper>
                <IconButton
                  color="primary"
                  className={classes.iconButton}
                  onClick={onModalClose}
                >
                  <ClearIcon />
                </IconButton>
              </DialogTitleWrapper>
            </DialogTitle>
            <DialogContent
              classes={{ root: classes.dialogContent }}
              style={{ overflow: "hidden" }}
            >
              {isEmpty(classTimesData) ? (
                <ClassContainer>
                  <Typography caption="p">
                    No class times have been given by the school. Please click
                    this button to request the school complete their listing
                  </Typography>
                  <br />

                  <RequestsClassTimes>
                    {/* <PrimaryButton
                      icon
                      onClick={handleClassTimeRequest}
                      iconName="perm_contact_calendar"
                      label="Request class times"
                    /> */}
                    <FormGhostButton
                      icon
                      onClick={handleClassTimeRequest}
                      iconName="perm_contact_calendar"
                      label="Request class times"
                    />
                  </RequestsClassTimes>
                </ClassContainer>
              ) : (
                <ContentWrapper>
                  <ContentHeader>
                    {/*<ClassTypeCoverImg src={classTypeImg} /> */}
                    <ClassTypeCoverWithDefaultImg classTypeImg={classTypeImg} />
                    <ClassTimes>
                      <ClassTimesFor>Class Times for</ClassTimesFor>
                      <ClassTypeName>
                        {classTypeName.toLowerCase()}
                      </ClassTypeName>
                    </ClassTimes>
                  </ContentHeader>
                  <center className={classes.about}>
                    {" "}
                    <i>{` About ${classTypeName}`}</i>
                  </center>
                  <Grid container style={{ padding: "22px" }}>
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
                            className="circle-icon"
                            className={classes.iconStyle}
                          >
                            <Icon className="material-icons" color="primary">
                              account_balance
                            </Icon>
                          </div>
                          <div className={classes.dataMargin}>
                            <Text>
                              {filters &&
                                filters.schoolName &&
                                filters.schoolName}
                            </Text>
                          </div>
                        </div>

                        <div
                          className={
                            classes.iconWithDetailContainer +
                            " " +
                            classes.bottomSpace
                          }
                        />
                      </IconsRowWrapper>
                      {filters &&
                        filters.locationTitle && (
                          <div className={classes.iconWithDetailContainer}>
                            <div
                              className="circle-icon"
                              className={classes.iconStyle}
                            >
                              <Icon className="material-icons" color="primary">
                                location_on
                              </Icon>
                            </div>
                            <div className={classes.dataMargin}>
                              <Text>
                                {filters &&
                                  filters.locationTitle &&
                                  filters.locationTitle}
                              </Text>
                            </div>
                          </div>
                        )}
                    </IconsWrapper>
                    <Grid item xs={12}>
                      {ageMin &&
                        ageMax && (
                          <MetaInfo
                            data={`  ${ageMin} to ${ageMax}`}
                            title={"Age:" + " "}
                          />
                        )}
                      {gender &&
                        gender !== "All" && (
                          <MetaInfo data={gender} title={"Gender: " + ""} />
                        )}

                      {experienceLevel && experienceLevel == "All" ? (
                        <MetaInfo
                          data={"  All levels are welcome"}
                          title={"Experience:  " + " "}
                        />
                      ) : (
                        <MetaInfo
                          data={`  ${experienceLevel}`}
                          title={"Experience:  " + " "}
                        />
                      )}
                    </Grid>
                    {desc && (
                      <MetaInfo
                        data={`  ${desc}`}
                        title={"Description:"}
                        marginBottom={16}
                      />
                    )}
                  </Grid>
                  <ClassTimesBoxes
                    inPopUp={true}
                    withSlider={false}
                    classTimesData={classTimesData}
                    classInterestData={classInterestData}
                    onModalClose={onModalClose}
                    params= {params}
                  />
                </ContentWrapper>
              )}
              {this.props.errorText && <ErrorWrapper>{errorText}</ErrorWrapper>}
            </DialogContent>
            <DialogActions className={classes.dialogAction}>
              {/* <ClassTimeButton
                  fullWidth
                  label="View Class"
                  noMarginBottom
                  onClick={(e) =>
                   { onModalClose(e);
                    this.goToClassTypePage(
                      classTypeName,
                      _id
                    )

                  }
                  }
                />
                <ClassTimeButton
                  fullWidth
                  noMarginBottom
                  label="View School"
                  onClick={(e) => {onModalClose(e);this.goToSchoolPage(schoolId);}
                  }
                />
                <ClassTimeButton
                  fullWidth
                  noMarginBottom
                  label="Close"
                  onClick={onModalClose}
                /> */}
              {!hideClassTypeOptions && (
                <Grid style={{ display: "flex", justifyContent: "flex-end" }}>
                 <ButtonWrapper>
                    <FormGhostButton
                      darkGreyColor
                      label="Close"
                      onClick={onModalClose}
                    />
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <FormGhostButton
                      onClick={e => {
                        onModalClose(e);
                        this.goToClassTypePage(classTypeName, _id);
                      }}
                      label="View Class"
                    />
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <FormGhostButton
                      onClick={e => {
                        onModalClose(e);
                        this.goToSchoolPage(schoolId);
                      }}
                      label="View School"
                    />
                  </ButtonWrapper>
                 
                </Grid>
              )}
            </DialogActions>
          </MyScrollToElement>
        </MuiThemeProvider>
      </Dialog>
    );
  }
}

ClassTimesDialogBox.propTypes = {
  onModalClose: PropTypes.func,
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  hideClassTypeOptions: PropTypes.bool,
  classesData: PropTypes.arrayOf({
    timing: PropTypes.string,
    desc: PropTypes.string,
    addToCalender: PropTypes.bool,
    scheduleType: PropTypes.string
  }),
  errorText: PropTypes.string
};

ClassTimesDialogBox.defaultProps = {
  hideClassTypeOptions: false
};

export default withMobileDialog()(withStyles(styles)(ClassTimesDialogBox));
