import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { browserHistory } from "react-router";

import NotFoundIcon from "/imports/ui/components/landing/components/icons/NotFound.jsx";
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";

import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

const Wrapper = styled.div`
  ${helpers.flexCenter} flex-direction: column;
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

  @media screen and (max-width: ${helpers.mobile}px) {
    font-size: ${helpers.baseFontSize * 2}px;
  }
`;

const ButtonsWrapper = styled.div`
  ${helpers.flexCenter} align-items: stretch;
  width: 100%;

  @media screen and (max-width: ${helpers.mobile}px) {
    flex-direction: column;
    align-items: center;
    padding: 0 0 0 ${helpers.rhythmDiv}px;
  }
`;

const IconWrapper = styled.div`
  width: ${helpers.rhythmDiv * 23}px;
  height: ${helpers.rhythmDiv * 23}px;
`;

const NotFound = props => (
  <Wrapper>
    <IconWrapper>
      <NotFoundIcon />
    </IconWrapper>

    <Title>{props.title}</Title>

    {props.withButton && (
      <ButtonsWrapper>
        <PrimaryButton
          fullWidth={true}
          onClick={() => browserHistory.push("/")}
          label="Back to SkillShape Home"
          noMarginBottom
        />
      </ButtonsWrapper>
    )}
  </Wrapper>
);

NotFound.defaultProps = {
  title: "404 Page Not Found",
  withButton: true
};

NotFound.propTypes = {
  title: PropTypes.string,
  withButton: PropTypes.boolean
};

export default NotFound;
