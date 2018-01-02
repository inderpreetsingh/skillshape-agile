import React, {Fragment} from 'react';
import moment from 'moment';
import { formStyles } from '/imports/util';
// import { blue500 } from 'material-ui/styles/colors';

import Dialog, {
  DialogActions,
  withMobileDialog,
} from 'material-ui/Dialog';
import Icon from 'material-ui/Icon';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';

import { ContainerLoader } from '/imports/ui/loading/container';
import { browserHistory, Link } from 'react-router';
import ClassType from "/imports/api/classType/fields";
import SLocation from "/imports/api/sLocation/fields";
import '/imports/api/classInterest/methods';
import '/imports/api/classTimes/methods';

const formStyle = formStyles();

const styles = theme => {
  console.log("theme", theme);
  return {
    image: {
      verticalAlign: 'middle',
      width: 'auto',
      height: 250,
    },
    imageContainer: {
      backgroundColor: theme.palette.grey[100],
      display: 'inline-flex',
      alignItems: 'center',
      color: '#fff',
      width: '100%',
      minHeight: 250,
      justifyContent: 'center',
      backgroundSize: 'auto',
    },
    iconStyle: {
        marginRight: '5px'
    },
    iconWithDetailContainer: {
        display:'inline-flex',
        alignItems: "center"
    }
  }
}

class ClassDetailModal extends React.Component{

  constructor(props){
    super(props);
    this.state = {
        isLoading: true,
        error: false
    }
  }

  componentWillMount() {
    console.log("classTimes.getClassTimes calling start -->>",this.props);
    if(this.props.eventData) {
        const {schoolId, classTypeId, classTimeId, locationId} = this.props.eventData;
        this.setState({
            isLoading: true,
        })
        Meteor.call("classTimes.getClassTimes", {schoolId, classTypeId, classTimeId, locationId}, (error, {school, classTimes, classType, location}) => {
            console.log("classTimes.getClassTimes res -->>");
            console.log("classTimes.getClassTimes error -->>",error);
            this.setState({
                isLoading: false,
                school,
                classTimes,
                classType,
                location,
                error
            })
        })
    } else {
        this.setState({
            error: "Event Data not found!!!!",
            isLoading: false,
        })
    }

  }

  getImageSrc = (classType, school) => {
  	if(classType && classType.classTypeImg) {
  		return classType.classTypeImg
  	} else if(school && school.mainImage) {
  		return school.mainImage
  	} else {
  		return "/images/logo-location.png";
  	}
  }

  removeMyClassInterest = (event, classTimeId) => {
    console.log("<<_____removeMyClassInterest-->>>>",classTimeId)
    this.setState({isLoading: true})
    Meteor.call("classInterest.removeClassInterestByClassTimeId",{classTimeId},(error, res) => {
        this.setState({isLoading: false,error})
        this.props.closeEventModal(false, null)
        if(error) {
            console.error("Error :-",error);
        }
    })
  }

  render() {
    console.log("ClassDetailModal render props -->>", this.props);
    console.log("ClassDetailModal render state -->>", this.state);
    const { isLoading, error, school, classType, classTimes, location } = this.state;
    const { eventData, fullScreen, classes } = this.props;
    return (
        <Dialog
          fullScreen={fullScreen}
          open={this.props.showModal}
          onClose={() => this.props.closeEventModal(false, null)}
          aria-labelledby="responsive-dialog-title"
        >
            { isLoading && <ContainerLoader/> }
            { error && <div style={{color: 'red'}}>{error}</div> }
            { !isLoading && !error && (
                    <Card>
                        <CardMedia style={{height:250}}>
                            <div className={classes.imageContainer}>
                                <div style={{position: "absolute", top: 10, right: 10}}>
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
                                </div>
                                <img className={classes.image} src={this.getImageSrc(classType,school)}/>
                            </div>
                        </CardMedia>
                        <CardContent>
                            <Typography type="headline" component="h2">
                                {classType && classType.name}
                            </Typography>
                            <Typography component="p" style={{marginBottom:'20px'}}>
                                {classType && classType.desc}
                            </Typography>
                            <Grid container>
                                <Grid item xs={6}>
                                    <div className={classes.iconWithDetailContainer}>
                                        <div className="circle-icon" className={classes.iconStyle}>
                                            <Icon
                                                className="material-icons"
                                                color="primary"
                                            >
                                                account_balance
                                            </Icon>
                                        </div>
                                        <div>
                                            <Typography type="caption" >SCHOOL</Typography>
                                            <Typography type="caption" >{school && school.name}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div className={classes.iconWithDetailContainer}>
                                        <div className="circle-icon" className={classes.iconStyle}>
                                            <Icon
                                                className="material-icons"
                                                color="primary"
                                            >
                                                date_range
                                            </Icon>
                                        </div>
                                        <div>
                                            <Typography type="caption" >DATE</Typography>
                                            <Typography type="caption" >{eventData.startDate && eventData.startDate.format("dddd, Do MMM YYYY")}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div className={classes.iconWithDetailContainer}>
                                        <div className="circle-icon" className={classes.iconStyle}>
                                            <Icon
                                                className="material-icons"
                                                color="primary"
                                            >
                                                location_on
                                            </Icon>
                                        </div>
                                        <div>
                                            <Typography type="caption" >LOCATION</Typography>
                                            <Typography type="caption" >{location && `${location.address}, ${location.city}, ${location.state}`}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
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
                                </Grid>
                            </Grid>
                            <Typography type="p" style={{marginBottom:'20px', marginTop:'20px'}}>
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
                                </Grid>
                                <Grid item xs={6}>
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
                            </Grid>
                            {
                                eventData.scheduleDetails && (
                                    <Fragment>
                                    <Typography type="p" style={{marginBottom:'20px', marginTop:'20px'}}>
                                        Entire Class Times Schedule
                                    </Typography>
                                    {
                                        Object.keys(eventData.scheduleDetails).map((day, index) => {
                                            const { startTime, duration} = eventData.scheduleDetails[day];
                                            const eventStartTime = moment(startTime).format("hh:mm");
                                            const eventEndTime = moment(new Date(startTime)).add(duration, "minutes").format("hh:mm");
                                            return (
                                                <Typography type="caption" >
                                                        {day} - {`${eventStartTime} to ${eventEndTime}`}
                                                </Typography>
                                        ) })
                                    }
                                    </Fragment>
                                )
                            }
                        </CardContent>
                    </Card>
                )
            }
            {fullScreen && (
                <DialogActions>
                    <Button onClick={()=>{this.props.closeEventModal(false, null)}} color="primary">
                      Close
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    )
  }
}

export default withMobileDialog()(withStyles(styles)(ClassDetailModal));