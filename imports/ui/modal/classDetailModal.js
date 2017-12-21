import React from 'react';
import Dialog from 'material-ui/Dialog';
import moment from 'moment';
import { formStyles } from '/imports/util';
import FontIcon from 'material-ui/FontIcon';
import { blue500 } from 'material-ui/styles/colors';
import { Card, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import { ContainerLoader } from '/imports/ui/loading/container';
import { browserHistory, Link } from 'react-router';
import ClassType from "/imports/api/classType/fields";
import SLocation from "/imports/api/sLocation/fields";
import Classes from "/imports/api/classes/fields";
import '/imports/api/classInterest/methods';
import '/imports/api/classTimes/methods';

const styles = formStyles();

export default class ClassDetailModal extends React.Component{

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
        Meteor.call("classTimes.getClassTimes", {schoolId, classTypeId, classTimeId, locationId}, (error, {school, classTimes, classType, location}) => {
            console.log("classTimes.getClassTimes res -->>");
            console.log("classTimes.getClassTimes error -->>",error);
            this.setState({
                isLoading: false,
                school,
                classTimes,
                classType,
                location,
                error,
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
    const { eventData } = this.props;
  	return (
        <Dialog
          modal={false}
          open={this.props.showModal}
          bodyStyle={{padding: 0}}
          contentStyle={{ maxWidth: 600, maxheight: 1400 }}
          autoScrollBodyContent={true}
          onRequestClose={() => this.props.closeEventModal(false, null)}
        >
            { isLoading && <ContainerLoader/> }
            { error && <div style={{color: 'red'}}>{error}</div> }
            { !isLoading && !error && (
                    <Card>
                        <CardMedia
                            overlayContentStyle={{float: 'right', width: 25, height: 35, position: 'relative', background: 'none'}}
                            overlay={
                                <span>
                                    {
                                        eventData.attending && (
                                            <FontIcon
                                                style={{cursor: 'pointer'}}
                                                hoverColor={blue500} 
                                                className="material-icons"
                                                onClick={(event) => this.removeMyClassInterest(event, eventData.classTimeId)}
                                                color={config.themeColor.red}
                                            >
                                                delete
                                            </FontIcon>
                                        )
                                    }
                                </span>
                            }
                        >
                            <img src={this.getImageSrc(classType,school)} style={{height: '200px'}} alt="Card image cap" />
                            <CardTitle title={classType && classType.name} />
                            <CardText>
                              {classType && classType.desc}
                            </CardText>
                            <CardText>
                                <div style={{...styles.formControlInline, marginBottom: 15}}>
                                    <div style={styles.formControl}>
                                        <div style={styles.formControlInput}>
                                            <div className="circle-icon">
                                                <FontIcon 
                                                    className="material-icons"
                                                    color={config.themeColor.red}
                                                >
                                                    account_balance
                                                </FontIcon>
                                            </div>
                                            <div>
                                                <div className="card-header-title">SCHOOL</div>
                                                <div className="card-header-sub-title">
                                                    <p>{school && school.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={styles.formControl}>
                                        <div style={styles.formControlInput}>
                                            <div className="circle-icon">
                                                <FontIcon 
                                                    className="material-icons"
                                                    color={config.themeColor.red}
                                                >
                                                    date_range
                                                </FontIcon>
                                            </div>
                                            <div>
                                                <div className="card-header-title">DATE</div>
                                                <div className="card-header-sub-title">
                                                    <p>{eventData.startDate && eventData.startDate.format("dddd, Do MMM YYYY")}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>    
                                </div>
                                <div style={styles.formControlInline}>
                                    <div style={styles.formControl}>
                                        <div style={styles.formControlInput}>
                                            <div className="circle-icon">
                                                <FontIcon 
                                                    className="material-icons"
                                                    color={config.themeColor.red}
                                                >
                                                    location_on
                                                </FontIcon>
                                            </div>
                                            <div>
                                                <div className="card-header-title">LOCATION</div>
                                                <div className="card-header-sub-title">
                                                    <p>{location && `${location.address}, ${location.city}, ${location.state}`}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={styles.formControl}>
                                        <div style={styles.formControlInput}>
                                            <div className="circle-icon">
                                                <FontIcon 
                                                    className="material-icons"
                                                    color={config.themeColor.red}
                                                >
                                                    av_timer
                                                </FontIcon>
                                            </div>
                                            <div>
                                                <div className="card-header-title">TIME</div>
                                                <div className="card-header-sub-title">
                                                    <p>{`${eventData.eventStartTime} to ${eventData.eventEndTime}`}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>    
                                </div>
                            </CardText>
                            <CardText>
                                <div style={styles.formControl}>
                                    <div style={styles.formControlInput}>
                                        <strong className="card-title" style={{color: 'black'}}>Entire Class Dates</strong>
                                    </div>
                                </div>
                                <div style={styles.formControlInline}>
                                    <div style={{...styles.formControlInline, width: '50%'}}>
                                        <div style={styles.formControlInline}>
                                            <div style={styles.formControl}>
                                                <div style={styles.formControlInput}>
                                                    <div className="card-header-title">FROM : </div>
                                                    <div className="card-header-sub-title">
                                                        { eventData.startDate ? moment(eventData.startDate).format("Do MMM YYYY") : "NA"}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={styles.formControl}>
                                                <div style={styles.formControlInput}>
                                                    <div className="card-header-title">TO : </div>
                                                    <div className="card-header-sub-title">
                                                        { eventData.endDate ? moment(eventData.endDate).format("Do MMM YYYY") : "NA"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={styles.formControl} >
                                        <div className="alert-info-msg" style={styles.formControlInput}>
                                            <div>
                                                <FontIcon 
                                                    className="material-icons"
                                                    color={config.themeColor.red}
                                                >
                                                    warning
                                                </FontIcon>
                                            </div>
                                            <div>
                                                <p>This is a class series with start and end date.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardText>
                           { 
                                eventData.scheduleDetails && ( 
                                    <CardText>
                                        <div style={styles.formControl}>
                                            <div style={styles.formControlInput}>
                                                <strong className="card-title" style={{color: 'black'}}>Entire Class Times Schedule</strong>
                                            </div>
                                        </div>
                                        { 
                                            Object.keys(eventData.scheduleDetails).map((day, index) => { 
                                                const { startTime, duration} = eventData.scheduleDetails[day]; 
                                                const eventStartTime = moment(startTime).format("hh:mm"); 
                                                const eventEndTime = moment(new Date(startTime)).add(duration, "minutes").format("hh:mm"); 
                                                return (
                                                    <div style={styles.formControl} key={index}>
                                                        <div style={styles.formControlInput}>
                                                            {day} - {`${eventStartTime} to ${eventEndTime}`}
                                                        </div>
                                                    </div>
                                            ) }) 
                                        }
                                    </CardText>
                                )
                            }
                        </CardMedia>
                    </Card>
                )
            }
        </Dialog>
    )   
  }
}