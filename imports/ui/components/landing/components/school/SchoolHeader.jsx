import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import PrimaryButton from '../buttons/PrimaryButton.jsx';
import * as helpers from '../jss/helpers.js';
import { schoolDoorImg } from '../../site-settings.js';

const HeaderContent = styled.div`
  width: 500px;
  padding: ${helpers.rhythmDiv * 2}px;
`;

const Title = styled.h2`
  font-weight: 600;
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize * 3}px;
  color: ${helpers.black};
  margin: 0;
  line-height: 1;
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const Content = styled.p`
  margin: 0;
  line-height: 1;
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize * 2}px;
  color: ${helpers.black};
  font-weight: 400;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const HeaderContentWrapper = styled.div`
  ${helpers.flexCenter}
  justify-content: flex-start;
  height: 100%;
  position: relative;
`;

const Wrapper = styled.div`
  max-width: 1000px;
  height: 600px;
  margin: 0 auto;
  background-image: url(${props => props.bgSrc});
  background-size: 500px;
  background-position: 100% 100%;
  background-repeat: no-repeat;

  @media screen and (max-width: ${helpers.tablet}px) {
    background-position: calc(100% + 125px) 100%;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    background-position: calc(100% + 250px) 100%;
  }
`;

const HeaderOverlay = styled.div`
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255,255,255,0.5);
  z-index: 0;

  @media screen and ( max-width: ${helpers.tablet}px) {
    display: block;
  }
`;

const SchoolHeader = (props) => (
  <Wrapper bgSrc={props.schoolHeaderImgSrc}>
    <HeaderContentWrapper>
      <HeaderContent>
        <Title>{props.title}</Title>
        <Content>{props.content}</Content>
        <PrimaryButton onClick={props.onGetStartedBtnClick} label="Get Started For Free"/>
      </HeaderContent>
      <HeaderOverlay>

      </HeaderOverlay>
    </HeaderContentWrapper>
  </Wrapper>
);

SchoolHeader.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  schoolHeaderImgSrc: PropTypes.string,
}

SchoolHeader.defaultProps = {
  title: 'This is your school',
  content: 'Amazing things happen when people enter these doors',
  schoolHeaderImgSrc: schoolDoorImg
}

export default SchoolHeader;
