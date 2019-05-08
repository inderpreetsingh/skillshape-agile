import React, { Fragment } from 'react';
import { get, isEmpty } from 'lodash';
import styled from 'styled-components';
import PrimaryButton from '/imports/ui/components/landing/components/buttons/PrimaryButton.jsx';
import BrandBar from '/imports/ui/components/landing/components/BrandBar.jsx';
import Footer from '/imports/ui/components/landing/components/footer/index.jsx';
import { listenOnUrlChange } from '/imports/util';

const H2 = styled.h2`
  word-break: break-word;
`;
const H3 = styled.h3`
  max-height: 267px;
  overflow: scroll;
  overflow-x: hidden;
  @media screen and (max-width: 600px) {
    max-height: 190px;
  }
`;
const BackGround = styled.div`
  display: table;
  background-color: #424242;
  height: -webkit-fill-available;
  padding: 10px;
	font-family: 'Zilla Slab',serif;
	width: 100%;
  font-size: large;
  background-size: cover;
`;
const Details = styled.details`
  margin-top: 12px;
  white-space: pre-line;
`;
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
    listenOnUrlChange(this.resetHasErrorState);
  }

	resetHasErrorState = () => {
	  if (this.state.hasError) { this.setState({ hasError: false }); }
	}

	componentDidCatch(error, errorInfo) {
	  this.setState({
	    error,
	    errorInfo,
	    hasError: true,
	  });
	}

	render() {
	  if (this.state.hasError) {
	    const error = get(this.state, 'error', 'error name').toString();
	    const errorInfo = get(this.state, 'errorInfo.componentStack', 'error stack info');
	    const url = document.URL;
	    Meteor.call('emailMethods.errorBoundary', { error, errorInfo, url });
	    const currentUser = Meteor.user();
	    return (
  <Fragment>
    <BrandBar
      positionStatic
      currentUser={currentUser}
      isUserSubsReady={!isEmpty(currentUser)}
    />
    <BackGround>
      <center>
        <H2>Oops Something Went Wrong.</H2>
        <br />
        <h4>An Email is sent about this bug to technical team.</h4>
        <PrimaryButton
          onClick={() => document.location.reload(true)}
          label="Refresh"
          noMarginBottom
        />
        <Details>
          <H3>
            {' '}
            {error}
            <br />
            {errorInfo}

          </H3>
        </Details>
      </center>
    </BackGround>
    <Footer />
  </Fragment>
	    );
	  }
	  return this.props.children;
	}
}
