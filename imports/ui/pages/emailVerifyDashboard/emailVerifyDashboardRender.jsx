import React, { Fragment } from "react";
import styled,{keyframes} from "styled-components";
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';
import { ContainerLoader } from "/imports/ui/loading/container";


const emailSvgAnim = keyframes`
   0% {
     transform : rotate(0deg);
   }
   100% {
     transform: rotate(360deg);
   }
}`;
const Head = styled.div`
  justify-content: center;
  display: flex;
  height: 64px;
  background-color: white;
`;
const Logo = styled.div`
  width: 24px;
  height: 24px;
  display: inline-block;
  top: 20px;
  position: relative;
`;
const Img = styled.img`
  width: 100%;
  vertical-align: bottom;
`;
const TextWrapper = styled.div`
  display: inline-block;
  padding: 20px 0;
  display: flex;
 
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
  margin: 1px 0px 0px 5px;
  font-weight: 400;
`;
const EmailStatus = styled.div`
    width: fit-content;
    margin: 10px auto 10px auto;
    font-weight: lighter;
    font-size: 21px;
    background-color:${helpers.primaryColor};
    border-radius: 25px;
    color: white;
    font-family: 'Zilla Slab',serif;
    box-shadow: 4px 11px 2px -4px #888888;
    transition: all 0.3s ease-out;
    visibility: ${props => props.emailSend ? "visible" : "hidden"};
    padding: ${props => props.emailSend ? "5px 4% 5px 4%" : "0px"};
    height: ${props => props.emailSend ? "35px" : "0px"};
`;
const GroupSvg = styled.div`
  background-image: url(${config.groupSvg});
  background-size: 119px;
  background-position: 100% calc(100% - 14px);
  background-repeat: no-repeat;
  height: 138px;
  max-height: 600px;
  width: 121px;
  @media screen and (max-width: ${helpers.mobile}px) {
    margin-right:38%;
  }
  `;
const EmailSvg = styled.div`
  background-image: url(${config.emailSvg});
  background-position: 100% calc(100% - 14px);
  background-repeat: no-repeat;
  max-height: 422px;
  width: 36px;
  position: absolute;
  transition: all 0.3s ease-out;
  height: 59px;
  top: 27%;
  right: 34%;
  ${props=> props.emailSend ? `animation: ${emailSvgAnim} 0.5s` : ''}
`;
const Text = styled.div`
  margin: auto;
  width: fit-content;
  font-family: "Zilla Slab", serif;
  font-size: 48px;
  color: #333;
  line-height: 1.5;
  margin-bottom: 24px;
  @media screen and (max-width: ${helpers.mobile}px) {
    font-size: 36px;
  }
`;
const Summary = styled.div`
  margin: 10px auto auto auto;
  width: 355px;
  font-family: "Zilla Slab", serif;
  font-size: 24px;
  font-weight: lighter;
  color: #555;
  margin-bottom: 24px;
`;
const Counter = styled.div`
  font-family: monospace;
  margin:5px auto 5px auto;
`;
const Container = styled.div`
background-color: #f2f2f2;
`;
const ImagesContainer = styled.div`
position: relative;
width: fit-content;
margin-bottom: 24px;
`;
const CustomButton = styled.button`
  background-color: #333;
  color: #f2f2f2;
  height: 48px;
  min-width: 200px;
  font-family: "Zilla Slab", serif;
  font-size: 24px;
  padding: 8px 16px;
  box-sizing: border-box;
  border: 2px;
  border-radius: 5px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer' };
`;
export function EmailVerifyDashboardRender () {
  const {state:{email,isLoading,disabled,emailSend},reSendEmailVerificationLink} = this;
  return (
    <Fragment>
      <Container>
      {isLoading && <ContainerLoader/>}
        <Head>
          <Logo>
            <Img src={config.skillShapeLogo} />
          </Logo>
          <TextWrapper>
            <H1>Skillshape,</H1><P>your path revealed</P>
          </TextWrapper>
        </Head>
        <EmailStatus emailSend={emailSend}>
          An email send again!
        </EmailStatus>
        <center> <ImagesContainer><GroupSvg /><EmailSvg emailSend={emailSend}/></ImagesContainer></center>
        <Text> Please check your inbox!.</Text>
        <Summary> We just send a confirmation link to {email}.Click the link to sign in to your dashboard.</Summary>
        <center>
          <ButtonsWrapper>
          <CustomButton
            disabled={disabled}
            onClick={reSendEmailVerificationLink}
          >Resend Email</CustomButton>
          <Counter id="counter"/>
          </ButtonsWrapper>
        </center>
        </Container>
    </Fragment>
  );
};
