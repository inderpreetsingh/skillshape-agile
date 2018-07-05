import React, {Component} from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { ContainerLoader } from '/imports/ui/loading/container.js';
import SuggestionTable from '/imports/ui/components/landing/components/schoolSuggestions/SuggestionTable.jsx';
import SchoolSuggestion from '/imports/api/schoolSuggestion/fields.js';

class SchoolSuggestionsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessAllowed: false
    }
  }

  componentWillMount = () => {
    const { currentUser } = this.props;
    const accessAllowed = checkMyAccess({user:currentUser});
    // console.log(accessAllowed,checkMyAccess({user: currentUser}))
    if(accessAllowed) {
      this.setState({ accessAllowed: true});
    }
  }

  render() {
    const {accessAllowed} = this.state;
    const {schoolSuggestions,isLoading} = this.props;
    if(!accessAllowed) {
      return <h2>No Access Allowed</h2>
    }else if(isLoading) {
      return <ContainerLoader />
    }

    return (<div>
        <SuggestionTable data={schoolSuggestions}/>
      </div>)
  }
}

export default createContainer(props => {
  let schoolSuggestions;
  let isLoading = true;
  const schoolSuggestionsSubscription = Meteor.subscribe('schoolSuggestion.getAllSuggestions');
  if(schoolSuggestionsSubscription && schoolSuggestionsSubscription.ready()) {
    isLoading = false;
    schoolSuggestions = SchoolSuggestion.find({}).fetch();
  }
  return {
    ...props,
    isLoading,
    schoolSuggestions: schoolSuggestions
  }
},SchoolSuggestionsView);
