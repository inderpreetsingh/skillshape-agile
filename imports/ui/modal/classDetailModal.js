import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory, Link } from 'react-router';

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
  	const {
  		skillclass,
  		classType,
  		school
  	} = this.props;

  	return (<div className="modal fade " id="classDetailModal" role="dialog">
	    <div className="modal-dialog" style={{maxWidth: '450px'}}>
	      <div className="modal-content">
	      	<div className="card">
	      		<Link className="link-redirect link" to={`/schools/${school.slug}`}>
					  	<img className="card-img-top" src={this.getImageSrc(skillclass,classType,school)} alt="Card image cap"/>
	      		</Link>
	      		<div className="card-block" style={{padding: '10px'}}>
					    <h4 className="card-title" style={{color: 'black', fontWeight: '400'}}>{classType.name}</h4>
					    <p className="card-text" style={{fontSize: 'smaller'}}>{classType.desc}</p>
					  </div>
					</div>       
	  		</div>        
	 		</div>        
		</div>)        
  }
}

export default createContainer(props => {
	let { classId, classTypeId } = props.data;
 	console.log("ClassDetailModal createContainer props -->>",props)
 	let skillclass = SkillClass.findOne({ _id: classId })
 	let classType = ClassType.findOne({_id: classTypeId})
 	let school = School.findOne({_id: skillclass.schoolId})
 	console.log("ClassDetailModal createContainer  skillclass-->>",skillclass)
 	console.log("ClassDetailModal createContainer  classType-->>",classType)
 	console.log("ClassDetailModal createContainer  school-->>",school)
  return { 
    ...props,
    skillclass,
    classType,
    school
  }

}, ClassDetailModal);