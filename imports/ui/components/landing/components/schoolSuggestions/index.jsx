import isEmpty from 'lodash/isEmpty';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import styled from 'styled-components';
import SchoolSuggestion from '/imports/api/schoolSuggestion/fields';
import BrandBar from '/imports/ui/components/landing/components/BrandBar';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import SuggestionTable from '/imports/ui/components/landing/components/schoolSuggestions/SuggestionTable';
import { ContainerLoader } from '/imports/ui/loading/container';

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
      accessAllowed: true,
      noLoggedIn: false,
    };
  }

  _setAccessForUser = (currentUser) => {
    // debugger;
    if (!isEmpty(currentUser)) {
      const accessAllowed = checkMyAccess({ user: currentUser });
      if (accessAllowed) {
        this.setState({ accessAllowed: true, noLoggedIn: false });
      } else {
        this.setState({ accessAllowed: false, noLoggedIn: false });
      }
    } else {
      this.setState({ noLoggedIn: true });
    }
  };

  componentWillMount = () => {
    const { currentUser } = this.props;
    this._setAccessForUser(currentUser);
  };

  componentWillReceiveProps = (nextProps) => {
    const { currentUser } = nextProps;
    this._setAccessForUser(currentUser);
  };

  render() {
    const { accessAllowed, noLoggedIn } = this.state;
    const { schoolSuggestions, isLoading } = this.props;

    if (noLoggedIn) {
      return <h1>Not Logged In!</h1>;
    }

    return (
      <Wrapper>
        <BrandBar positionStatic currentUser={this.props.currentUser} />
        {!accessAllowed ? (
          <h2>No Access Allowed</h2>
        ) : (
          <ContentWrapper>
            <Heading>School Suggestions</Heading>
            {isLoading ? <ContainerLoader /> : <SuggestionTable data={schoolSuggestions} />}
          </ContentWrapper>
        )}
      </Wrapper>
    );
  }
}

export default createContainer((props) => {
  let schoolSuggestions;
  let isLoading = true;
  const schoolSuggestionsSubscription = Meteor.subscribe('schoolSuggestion.getAllSuggestions');
  if (schoolSuggestionsSubscription && schoolSuggestionsSubscription.ready()) {
    isLoading = false;
    schoolSuggestions = SchoolSuggestion.find({}).fetch();
  }
  return {
    ...props,
    isLoading,
    schoolSuggestions,
  };
}, SchoolSuggestionsView);
