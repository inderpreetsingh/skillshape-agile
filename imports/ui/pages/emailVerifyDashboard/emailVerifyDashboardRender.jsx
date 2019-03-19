import React, { Fragment } from "react";
import styled from "styled-components";
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton.jsx';
import { ContainerLoader } from "/imports/ui/loading/container";

const Center = styled.div``;
const Head = styled.div`
  width: 200px;
  margin: auto;
`;
const Logo = styled.div`
  width: 50px;
  display: inline-block;
`;
const Img = styled.img`
  width: 100%;
  vertical-align: bottom;
`;
const TextWrapper = styled.div`
  display: inline-block;
  padding: 20px 0;
`;
const H1 = styled.h1`
  font-weight: light;
  font-size: 24px;
  color: #ac1616;
  margin: 0;
  line-height: 1;
`;
const ButtonsWrapper = styled.div`
  width: 100%;
  margin: 20px 0px 10px 0px;
`;
const P = styled.p`
  font-size: 16px;
  margin: 0;
  line-height: 1;
`;
const EmailStatus = styled.div`
    width: fit-content;
    margin: 10px auto 10px auto;
    font-weight: lighter;
    font-size: 21px;
    background-color:${helpers.primaryColor};
    padding: 5px 15px 5px 15px;
    border-radius: 25px;
    color: white;
    font-family: 'Zilla Slab',serif;
    box-shadow: 4px 11px 2px -4px #888888;
`;
const GroupSvg = styled.div`
  background-image: url(${config.groupSvg});
  background-size: 119px;
  background-position: 100% calc(100% - 14px);
  background-repeat: no-repeat;
  height: 138px;
  max-height: 600px;
  width: auto;
  margin-right:45%;
  @media screen and (max-width: ${helpers.mobile}px) {
    margin-right:38%;
  }
  `;
const EmailSvg = styled.div`
  background-image: url(${config.emailSvg});
  background-position: 100% calc(100% - 14px);
  background-repeat: no-repeat;
  height: 59px;
  max-height: 422px;
  width: 36px;
  position: relative;
  bottom: 100px;
 
`;
const Text = styled.div`
  margin: auto;
  width: fit-content;
  font-family: "Zilla Slab", serif;
  font-size: 18px;
  font-weight: 400;
  margin-top: -60px;
`;
const Summary = styled.div`
  margin: 10px auto auto auto;
  width: 222px;
  font-family: "Zilla Slab", serif;
  font-size: 16px;
  font-weight: lighter;
`;
export function EmailVerifyDashboardRender () {
  const {state:{email,isLoading},reSendEmailVerificationLink} = this;
  return (
    <Fragment>
      {isLoading && <ContainerLoader/>}
        <Head>
          <Logo>
            <Img src={config.skillShapeLogo} />
          </Logo>
          <TextWrapper>
            <H1>Skillshape,</H1>
            <P>your path revealed</P>
          </TextWrapper>
        </Head>
        <EmailStatus>
          An email send again!
        </EmailStatus>
        <center> <GroupSvg /><EmailSvg /></center>
        <Text> Please check your inbox!.</Text>
        <Summary> We just send a confirmation link to {email}.Click the link to sign in to your dashboard.</Summary>
        <center>
          <ButtonsWrapper>
          <FormGhostButton
            label={'Resend Email'}
            onClick={reSendEmailVerificationLink}
          />
          </ButtonsWrapper>
        </center>
    </Fragment>
  );
};
