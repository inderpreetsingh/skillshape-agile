import get from 'lodash/get';
import PropTypes from 'prop-types';
import React from 'react';
import DocumentTitle from 'react-document-title';
import styled from 'styled-components';
import PrimaryButton from './buttons/PrimaryButton.jsx';
import SecondaryButton from './buttons/SecondaryButton.jsx';
import Duster from './icons/Duster.jsx';
import Plant from './icons/Plant.jsx';
import * as helpers from './jss/helpers.js';
// TODO: Automatic imports depending upon variables used - intellij
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton.jsx';


const Wrapper = styled.div`
  ${helpers.flexCenter}
  flex-direction: column;
  max-width: ${helpers.baseFontSize * 30}px;
  width: 100%;
  margin: ${helpers.rhythmDiv * 4}px auto;
  padding: 0 ${helpers.rhythmDiv * 2}px;
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

  @media screen and (max-width: ${helpers.mobile}px) {
    flex-direction: column;
    align-items: center;
    padding: 0 0 0 ${helpers.rhythmDiv}px;
  }
`;

const IconWrapper = styled.div`
  width: ${helpers.rhythmDiv * 24}px;
  height: ${helpers.rhythmDiv * 24}px;
  margin-bottom: ${helpers.rhythmDiv * 2}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    margin-bottom: 0;
    display: none;
  }
`;

const IconWrapperSmallScreen = IconWrapper.extend`
  width: ${helpers.rhythmDiv * 16}px;
  height: ${helpers.rhythmDiv * 16}px;
  display: none;

  @media screen and (max-width: ${helpers.mobile}px) {
    display: block;
  }
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

const GreenDuster = () => <Duster color={helpers.primaryColor} />;

const NoResults = props => (
  <DocumentTitle title={get(props, 'route.name', 'Untitled')}>
    <Wrapper>
      {props.icon && (
      <IconWrapper>
        <Plant />
      </IconWrapper>
      )}

      {props.icon && (
      <IconWrapperSmallScreen>
        {' '}
        <Plant width={`${helpers.rhythmDiv * 16}px`} height={`${helpers.rhythmDiv * 16}px`} />
        {' '}
      </IconWrapperSmallScreen>
      )}

      {!props.hideTitle && <Title>Wow! you are the first one here with this idea.</Title>}

      {!props.ghostButtons
        ? (
          <ButtonsWrapper>
            <PrimaryButton fullWidth onClick={props.removeAllFiltersButtonClick} label="Clear Filters" icon customIcon={Duster} noMarginBottom />
            <OrText> or </OrText>
            {props.showSchoolSuggestion
              ? <SecondaryButton fullWidth onClick={props.schoolSuggestionButtonClick} label="Give Suggestion" icon iconName="sentiment_satisfied" noMarginBottom />
              : <SecondaryButton fullWidth onClick={props.addYourSchoolButtonClick} label="Add your school" icon iconName="domain" noMarginBottom />}
          </ButtonsWrapper>
        )
        : (
          <ButtonsWrapper>
            <FormGhostButton fullWidth onClick={props.removeAllFiltersButtonClick} label="Clear Filters" icon customIcon={GreenDuster} noMarginBottom />
            <OrText> or </OrText>
            {props.showSchoolSuggestion
              ? <FormGhostButton darkGreyColor fullWidth onClick={props.schoolSuggestionButtonClick} label="Give Suggestion" icon iconName="sentiment_satisfied" noMarginBottom />
              : <FormGhostButton darkGreyColor fullWidth onClick={props.addYourSchoolButtonClick} label="Add your school" icon iconName="domain" noMarginBottom />}
          </ButtonsWrapper>
        )}
    </Wrapper>
  </DocumentTitle>
);

NoResults.propTypes = {
  removeAllFiltersButtonClick: PropTypes.func,
  addYourSchoolButtonClick: PropTypes.func,
  schoolSuggestionButtonClick: PropTypes.func,
  icon: PropTypes.bool,
  hideTitle: PropTypes.bool,
  ghostButtons: PropTypes.bool,
};

NoResults.defaultProps = {
  icon: true,
  hideTitle: false,
  ghostButtons: false,
  removeAllFiltersButtonClick: () => {},
  addYourSchoolButtonClick: () => {},
  schoolSuggestionButtonClick: () => {},

};

export default NoResults;
