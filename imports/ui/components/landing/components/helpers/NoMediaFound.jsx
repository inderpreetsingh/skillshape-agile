import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton.jsx';
import {logoSrc} from '/imports/ui/components/landing/site-settings.js';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const Wrapper = styled.div`
  width: 100%;
  height: 300px;
  background: ${helpers.noMediaFound};
  padding: ${helpers.rhythmDiv * 2}px;
`;

const LogoWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv * 4}px;
`;

const LogoImg = styled.div`
  height: 50px;
  width: 50px;
  margin: 0 auto;
  ${helpers.coverBg}
  background-image: url('${props => props.logoSrc}');
`;

const Title = styled.h2`
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize * 2}px;
  margin-bottom: ${helpers.rhythmDiv * 4}px;
  color: ${helpers.darkBgColor};
  font-weight: 300;
  font-style: italic;
`;

const Content = styled.div`
  max-width: 350px;
  margin: 0 auto;
`;

const ActionButtons = styled.div`
  ${helpers.flexCenter}
  justify-content: space-between;
`;


const NoMediaFound = (props)  => (<Wrapper>
  <Content>
  <LogoWrapper>
    <LogoImg logoSrc={logoSrc} />
  </LogoWrapper>

  <Title>{props.schoolName} has not uploaded any media yet.</Title>

  <ActionButtons>
    <a href={props.siteLink} target="_blank">
      <FormGhostButton darkGreyColor label="Visit Site" icon iconName="web" onClick={props.onVisitSiteButtonClick} />
    </a>

    <FormGhostButton darkGreyColor label="Email Us" icon iconName="email" onClick={props.onEmailButtonClick} />
  </ActionButtons>
  </Content>
</Wrapper>);

export default NoMediaFound;
