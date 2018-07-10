import React, {Component, Fragment} from 'react';
import styled from 'styled-components';
import { createContainer } from 'meteor/react-meteor-data';

import { ContainerLoader } from '/imports/ui/loading/container.js';
import BrandBar from '/imports/ui/components/landing/components/BrandBar.jsx';
import SuggestionTable from '/imports/ui/components/landing/components/schoolSuggestions/SuggestionTable.jsx';
import SchoolSuggestion from '/imports/api/schoolSuggestion/fields.js';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const Heading = styled.h2`
  font-size: ${helpers.baseFontSize * 2}px;
  font-weight: 400;
  text-align: center;
  font-family: ${helpers.specialFont};
  color: ${helpers.primaryColor};
  margin: ${helpers.rhythmDiv * 2}px 0;
`;

const Wrapper = styled.div`
  background: white;

  overflow-x: hidden;
`;

const ContentWrapper = styled.div`
  padding: ${helpers.rhythmDiv * 2}px;
  margin-bottom: ${helpers.rhythmDiv * 4}px;
`;

class SchoolSuggestionsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessAllowed: true
    }
  }

  componentDidMount = () => {
    const { currentUser } = this.props;
    console.log(currentUser," in the will mount");
    const accessAllowed = checkMyAccess({user:currentUser});
    // console.log(accessAllowed,checkMyAccess({user: currentUser}))
    if(accessAllowed) {
      this.setState({ accessAllowed: true});
    }else {
      this.setState({accessAllowed: false});
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { currentUser } = nextProps;
    console.log(currentUser," in the recieve props");
    const accessAllowed = checkMyAccess({user:currentUser});
    // console.log(accessAllowed,checkMyAccess({user: currentUser}))
    if(accessAllowed) {
      this.setState({ accessAllowed: true});
    }else {
      this.setState({accessAllowed: false});
    }
  }

  render() {
    const {accessAllowed} = this.state;
    const {schoolSuggestions, isLoading} = this.props;

    // debugger;
    return (<Wrapper>
        <BrandBar positionStatic currentUser={this.props.currentUser} />
        {!accessAllowed ? <h2>No Access Allowed</h2>
        :
        <ContentWrapper>
          <Heading>School Suggestions</Heading>
          {isLoading ? <ContainerLoader /> : <SuggestionTable data={schoolSuggestions}/>}
        </ContentWrapper>
        }
      </Wrapper>)
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
