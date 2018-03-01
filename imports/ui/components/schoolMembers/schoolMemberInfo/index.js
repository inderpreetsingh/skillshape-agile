import React ,{Component} from 'react';
import SchoolMemberDetailsRender from "./schoolMemberDetailsRender";

export default class SchoolMemberInfo extends Component {

  state = {
  }

  render() {
    return SchoolMemberDetailsRender.call(this, this.props);
  }

}