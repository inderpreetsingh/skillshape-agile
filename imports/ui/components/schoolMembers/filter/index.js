import React ,{Component} from 'react';
import SchoolMemberFilterRender from "./schoolMemberFilter";

export default class SchoolMemberFilter extends Component {

  state = {
    memberName:null
  }

  render() {
    return SchoolMemberFilterRender.call(this, this.props);
  }

}