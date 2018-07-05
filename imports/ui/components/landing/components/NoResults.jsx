import React from 'react';
import get from 'lodash/get';
import DocumentTitle from 'react-document-title';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Plant from './icons/Plant.jsx';
import Duster from './icons/Duster.jsx';

//TODO: Automatic imports depending upon variables used - intellij
import PrimaryButton from './buttons/PrimaryButton.jsx';
import SecondaryButton from './buttons/SecondaryButton.jsx';
import Footer from './footer/index.jsx';

import * as helpers from './jss/helpers.js';
import { noResultsImgSrc } from '../site-settings.js';

const Wrapper = styled.div`
  ${helpers.flexCenter}
  flex-direction: column;
  max-width: ${helpers.baseFontSize * 30}px;
  margin: ${helpers.rhythmDiv * 4}px auto;
`;

const Title = styled.h1`
  font-family: ${helpers.specialFont};
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  font-weight: 300;
  color: ${helpers.black};
  font-size: ${helpers.baseFontSize * 3}px;
  font-style: italic;

  @media screen and (max-width: ${helpers.mobile + 100}px) {
    font-size: ${helpers.baseFontSize * 2}px;
  }
`;

const ButtonsWrapper = styled.div`
  ${helpers.flexCenter}
  align-items: stretch;
  width: 100%;
  margin-bottom: ${helpers.rhythmDiv * 2}px;

  @media screen and (max-width: ${helpers.mobile + 150}px) {
    flex-direction: column;
    align-items: center;
    padding: 0 0 0 ${helpers.rhythmDiv}px;
  }
`;

const IconWrapper = styled.div`
  width: ${helpers.rhythmDiv * 24}px;
  height: ${helpers.rhythmDiv * 24}px;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const NoResultsImg = styled.div`
  background-position: 50% 50%;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url('${props => props.imgSrc}');
  width: 100%;
  height: 100%;
`;

const OrText = styled.p`
  font-weight: 400;
  font-style: italic;
  font-family: ${helpers.specialFont};
  font-size: 28px;
  margin: 0 ${helpers.rhythmDiv * 2}px 0 ${helpers.rhythmDiv}px;

  @media screen and (max-width: ${helpers.mobile + 100}px) {
    margin-bottom: ${helpers.rhythmDiv}px;
  }
`;

const NoResults = (props) => (
  <DocumentTitle title={get(props, "route.name", "Untitled")}>
  <Wrapper>
    <IconWrapper>
      <Plant />
    </IconWrapper>

    <Title>Wow! you are the first one here with this idea.</Title>

    <ButtonsWrapper>
      <PrimaryButton fullWidth={true} onClick={props.removeAllFiltersButtonClick} label="Clear Filters" icon customIcon={Duster} noMarginBottom />
      <OrText> or </OrText>
      <SecondaryButton fullWidth={true} onClick={props.addYourSchoolButtonClick} label="Add your school" icon iconName="domain" noMarginBottom/>
    </ButtonsWrapper>
    {props.showSchoolSuggestion && <ButtonsWrapper>
    <PrimaryButton
      fullWidth={true}
      onClick={props.schoolSuggestionButtonClick}
      label="Suggest School"
      icon
      iconName="sentiment_satisfied"
      noMarginBottom />
    </ButtonsWrapper>}
  </Wrapper>
  </DocumentTitle>
);

NoResults.propTypes = {
  imgSrc: PropTypes.string,
  removeAllFiltersButtonClick: PropTypes.func,
  addYourSchoolButtonClick: PropTypes.func,
  schoolSuggestionButtonClick: PropTypes.func
}

NoResults.defaultProps = {
  imgSrc: noResultsImgSrc
}

export default NoResults;
