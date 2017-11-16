import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory, Link } from 'react-router';
import moment from 'moment';

class ClassDetailModal extends React.Component{

  constructor(props){
    super(props);
    this.state = {}
  }

  componentDidMount() {
    $('#classDetailModal').modal('show')
    $('#classDetailModal').on('hidden.bs.modal', () => {
      this.props.closeEventModal(false, null);
		})		
  }

  getImageSrc = (skillclass, classType, school) => {
  	if(classType && classType.classTypeImg) {
  		return classType.classTypeImg
  	} else if(skillclass && skillclass.classImagePath) {
  		return skillclass.classImagePath
  	} else if(school && school.mainImage) {
  		return school.mainImage
  	} else {
  		return "/images/logo-location.png";
  	}
  }

  render() {
    console.log("ClassDetailModal render props -->>", this.props);
  	const {
  		skillclass,
  		classType,
  		school,
      eventData,
      classLocation,
  	} = this.props;

    let repeats = skillclass.repeats ? JSON.parse(skillclass.repeats) : null;
    console.log("ClassDetailModal render repeats -->>", repeats);
  	return (<div className="modal fade " id="classDetailModal" role="dialog">
	    <div className="modal-dialog" style={{maxWidth: '550px'}}>
	      <div className="modal-content">
	      	<div className="card" style={{margin: '0px'}}>
	      		<Link className="link-redirect link" to={`/schools/${school.slug}`}>
					  	<img className="card-img-top" src={this.getImageSrc(skillclass,classType,school)} style={{height: '200px'}} alt="Card image cap"/>
	      		</Link>
	      		<div className="card-block" style={{margin: '20px'}}>
					    <h3 className="card-title" style={{color: 'black', fontWeight: '400'}}>{classType.name}</h3>
					    <p className="card-text" style={{fontSize: 'x-small'}}>{classType.desc}</p>
					  </div>
            <div className="card-block" style={{margin: '20px', borderBottom: '2px solid #ccc'}}>
              <div className="row" style={{margin: '0px'}}>
                <div className="col-sm-6 no-padding">
                  <div className="col-sm-2 circle-icon">
                    <i className="fa fa-university fa-lg pull-left" aria-hidden="true"></i>
                  </div>
                  <div className="col-sm-10">
                    <div className="card-header-title">SCHOOL</div>
                    <div className="card-header-sub-title">
                      <p>{school.name}</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 no-padding">
                  <div className="col-sm-2 circle-icon">
                    <i className="fa fa-calendar fa-lg pull-left" aria-hidden="true"></i>
                  </div>
                  <div className="col-sm-10">
                    <div className="card-header-title">DATE</div>
                    <div className="card-header-sub-title">
                      <p>{eventData.start && eventData.start.format("dddd, Do MMM YYYY")}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row" style={{margin: '0px'}}>
                <div className="col-sm-6 no-padding">
                  <div className="col-sm-2 circle-icon">
                    <i className="fa fa-map-marker fa-lg pull-left" style={{marginLeft: '3px'}} aria-hidden="true"></i>
                  </div>
                  <div className="col-sm-10">
                    <div className="card-header-title">LOCATION</div>
                    <div className="card-header-sub-title">
                      <p>{`${classLocation.address}, ${classLocation.city}, ${classLocation.state}`}</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 no-padding">
                  <div className="col-sm-2 circle-icon">
                    <i className="fa fa-clock-o fa-lg pull-left" aria-hidden="true"></i>
                  </div>
                  <div className="col-sm-10">
                    <div className="card-header-title">TIME</div>
                    <div className="card-header-sub-title">
                      <p>{`${eventData.eventStartTime} to ${eventData.eventEndTime}`}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-block" style={{margin: '20px'}}>
              <strong className="card-title" style={{color: 'black'}}>Entire Class Dates</strong>
              <div className="row">
                <div className="col-sm-5 no-padding">
                  <div className="col-sm-6">
                    <div className="card-header-title">FROM</div>
                    <div className="card-header-sub-title">
                      {(repeats && repeats.start_date) ? moment(repeats.start_date).format("Do MMM YYYY") : "NA"}
                    </div>
                  </div>
                  
                  <div className="col-sm-6">
                    <div className="card-header-title">TO</div>
                    <div className="card-header-sub-title">
                      {(repeats && repeats.end_date) ? moment(repeats.end_date).format("Do MMM YYYY") : "NA"}
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 no-padding">
                  <div className="alert-info-msg">
                    <div className="col-sm-1 no-padding">
                      <i className="fa fa-info-circle" aria-hidden="true"></i>
                    </div>
                    <div className="col-sm-11 no-padding">
                      <p>This is a class series with start and end date.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
					</div>       
	  		</div>        
	 		</div>        
		</div>)        
  }
}

export default createContainer(props => {
	const { classId, classTypeId, locationId } = props.eventData;
 	console.log("ClassDetailModal createContainer props -->>",props)
 	
  let skillclass = SkillClass.findOne({ _id: classId });
 	let classType = ClassType.findOne({_id: classTypeId});
 	let school = School.findOne({_id: skillclass.schoolId});
  let classLocation = SLocation.findOne({_id: locationId});
 	
  console.log("ClassDetailModal createContainer  skillclass-->>",skillclass)
 	console.log("ClassDetailModal createContainer  classType-->>",classType)
  console.log("ClassDetailModal createContainer  school-->>",school)
 	console.log("ClassDetailModal createContainer  classLocation-->>",classLocation)
  
  return { 
    ...props,
    skillclass,
    classType,
    school,
    classLocation
  }

}, ClassDetailModal);