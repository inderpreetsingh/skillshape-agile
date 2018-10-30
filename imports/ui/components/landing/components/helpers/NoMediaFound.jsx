import React from 'react';
import styled from 'styled-components';
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton.jsx';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';
import { logoSrc } from '/imports/ui/components/landing/site-settings.js';


const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 300px;
  background: ${helpers.noMediaFound};
  padding: ${helpers.rhythmDiv * 2}px;
  display: flex;
  align-items: center;
`;

const Content = styled.div`
  max-width: 400px;
  margin: 0 auto;
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


const ActionButtons = styled.div`
  ${helpers.flexCenter}
  justify-content: space-around;

  @media screen and (max-width: ${helpers.mobile}px) {
    flex-direction: column;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;

  @media screen and (max-width: ${helpers.mobile}px) {
    width: 100%;
    margin-bottom: ${props => props.marginBottom}px;
  }
`;

const MyLink = styled.a`
  text-decoration: none;
  width: 100%;
`;

const NoMediaFound = (props)  => (<Wrapper>
  <Content>
  <LogoWrapper>
    <LogoImg logoSrc={logoSrc} />
  </LogoWrapper>

  <Title>{props.schoolName} has not uploaded any media yet.</Title>

  <ActionButtons>
    <ButtonWrapper marginBottom={helpers.rhythmDiv * 2}>
      <MyLink href={props.siteLink} target="_blank">
        <FormGhostButton darkGreyColor fullWidth label="Visit Site" icon iconName="web" onClick={props.onVisitSiteButtonClick} />
      </MyLink>
    </ButtonWrapper>

    <ButtonWrapper>
      <FormGhostButton darkGreyColor fullWidth label="Send Email" icon iconName="email" onClick={props.onEmailButtonClick} />
    </ButtonWrapper>
  </ActionButtons>
  </Content>
</Wrapper>);

export default NoMediaFound;
