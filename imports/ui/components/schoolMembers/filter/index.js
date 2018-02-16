import React ,{Component} from 'react';
import SchoolMemberFilterRender from "./schoolMemberFilter";

export default class SchoolMemberFilter extends Component {

  state = {
    memberName:null
  }

  componentDidMount() {
    /*setTimeout(()=> {
      let autocomplete = new google.maps.places.Autocomplete(this.address);
      autocomplete.addListener('place_changed', () => {
        let place = autocomplete.getPlace();
        let coords = [];
        coords[0] = place.geometry['location'].lat();
        coords[1] = place.geometry['location'].lng();
        console.log(place.geometry['location'].lat());
        console.log(place.geometry['location'].lng());

        this.claimcoords = coords;
      })
    },5000)*/
  }
  handleMemberNameChange = (event) => {
    console.log("handleMemberNameChange",event.target.value,this);
    this.setState({filters:{schoolId:this.props.schoolData._id,textSearch:event.target.value}});
    /*Meteor.call('school.getSchoolMembers',{textSearch:event.target.value,schoolId:this.props.schoolData._id},function(err,res) {
      console.log("My res===>",res);
    });*/
  }
  render() {
    return SchoolMemberFilterRender.call(this, this.props);
  }

}