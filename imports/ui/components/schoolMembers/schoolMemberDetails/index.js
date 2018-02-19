import React ,{Component} from 'react';
import SchoolMemberDetailsRender from "./schoolMemberDetailsRender";

export default class SchoolMemberDetails extends Component {

  state = {
  }

  render() {
    return SchoolMemberDetailsRender.call(this, this.props);
  }

}