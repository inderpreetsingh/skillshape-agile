import React ,{Component} from 'react';
import ClaimSchoolFilterRender from "./claimSchoolFilterRender";

export default class ClaimSchoolFilter extends Component {


  componentDidMount() {
    setTimeout(()=> {
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
    },5000)
  }
  render() {
    return ClaimSchoolFilterRender.call(this, this.props);
  }

}