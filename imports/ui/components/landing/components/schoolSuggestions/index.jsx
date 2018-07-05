import React, {Component} from 'react';
import { checkSuperAdmin, cutString } from '/imports/util';

class SchoolSuggestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessAllowed: false
    }
  }

  componentWillMount = () => {
    const user = Meteor.user();
    const adminUser = checkMyAccess({user});
    if(adminUser) {
      this.setState({ accessAllowed: true});
    }
  }

  render() {
    const {accessAllowed} = this.state;

    if(!accessAllowed) {
      return <h2>No Access Allowed</h2>
    }

    return (<div>
        MySchool Suggestions...
      </div>)
  }
}

export default SchoolSuggestions;
