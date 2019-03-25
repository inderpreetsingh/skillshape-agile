import { Fragment } from "react";
import styled, { keyframes } from "styled-components";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import { ContainerLoader } from "/imports/ui/loading/container";
import { specialFont } from "/imports/ui/components/landing/components/jss/helpers.js";
import { NewFooter } from "./NewFooter";
import {CustomButton} from '/imports/ui/components/landing/components/buttons';
import React from "react";
import {ChangeEmailComponent} from './changeEmail';

const emailSvgAnim = keyframes`
50%   {
      right: -18%;
      top: -19%;
      opacity: 1;
}    
51% {
  right: 104%;
  top: 83%;
  opacity: 0;
}
100 %{
  right: 34%;
  top: 27%;
  opacity: 1;
}
`;
const initialEmailAnim = keyframes`
1% {
  right: 104%;
  top: 83%;
  opacity: 0;
}
100 %{
  right: 34%;
  top: 27%;
  opacity: 1;
}
`;
const changeContentAnim = keyframes`
0% {
  opacity:0;
}
100% {
  opacity:1;
}
`;
const initialChangeContentAnim = keyframes`
0% {
  top:58px;
  position:relative;
}
100% {
  top:0px;
  position:relative;
}
`;
const groupSvgAnim = keyframes`
0% {
  transform : rotate(0deg);
}
100% {
  transform: rotate(360deg);
}`;
const initialGroupSvgAnim = keyframes`
0% {
  transform : rotate(360deg);
}
100% {
  transform: rotate(0deg);
}`;

const ButtonsWrapper = styled.div`
  width: 100%;
  margin-bottom: 90px;
`;

const EmailStatus = styled.div`
  width: fit-content;
  margin: 10px auto 10px auto;
  font-weight: lighter;
  font-size: 21px;
  background-color: ${helpers.primaryColor};
  border-radius: 25px;
  color: white;
  font-style: italic;
  font-family: ${specialFont};
  box-shadow: 4px 11px 2px -4px #888888;
  transition: all 0.3s ease-out;
  visibility: ${props => (props.emailSend ? "visible" : "hidden")};
  padding: ${props => (props.emailSend ? "4px 50px 4px 50px" : "0px")};
  height: ${props => (props.emailSend ? "35px" : "0px")};
`;
const GroupSvg = styled.div`
  background-image: url(${config.groupSvg});
  background-repeat: no-repeat;
  height: 122px;
  width: 121px;
  ${props => ( `animation: ${props.initialLoad ? initialGroupSvgAnim : props.emailSend ? groupSvgAnim : ""} 1s ease-in ${props.initialLoad ? "0.3s" :''};` )}
`;
const EmailSvg = styled.div`
  background-image: url(${config.emailSvg});
  background-position: 100% calc(100% - 14px);
  background-repeat: no-repeat;
  max-height: 422px;
  width: 55px;
  position: absolute;
  height: 71px;
  top: 25%;
  right: 27%;
  ${props => (`animation: ${props.emailSend ? emailSvgAnim : props.initialLoad ? initialEmailAnim : ''} 1s ease-in ${props.initialLoad ? "0.3s" :''};`)}
`;
const Text = styled.div`
  margin: auto;
  text-align: center;
  width: fit-content;
  font-family: ${specialFont};
  font-size: 48px;
  color: #333;
  line-height: 1.5;
  font-style: italic;
  @media screen and (max-width: ${helpers.mobile}px) {
    font-size: 24px;
  }
`;
const Summary = styled.div`
  margin: auto;
  font-family: ${specialFont};
  font-size: 24px;
  font-weight: lighter;
  color: #555;
  margin-bottom: 24px;
  word-break: break-word;
  max-width: 405px;
  text-align: center;
  font-style: italic;
  @media screen and (max-width: ${helpers.mobile}px) {
    font-size: 16px;
    padding: 5px 30px 5px 30px;
  }
`;
const Counter = styled.div`
  font-family: ${specialFont};
  font-style: italic;
  font-weight: lighter;
  margin: 5px auto 5px auto;
`;
const Container = styled.div`
  background-color: #f2f2f2;
  height: max-content;
`;
const ImagesContainer = styled.div`
  position: relative;
  width: fit-content;
  margin-bottom: 24px;
  margin-top: 41px;
`;

const ChangeEmailButton = styled.div`
  color: blue;
  font-family: ${specialFont};
  font-size: 19px;
  font-style: italic;
  font-weight: lighter;
  position: relative;
  top: 10px;
  cursor: pointer;
  text-decoration: underline;
`;
const Footer = styled.div`
  height: 48px;
  background: #ddd;
  bottom: 0;
  width: 100%;
  position: fixed;
`;
const Content = styled.div`
${props => `animation: ${props.initialLoad ? initialChangeContentAnim : !props.changeEmail ? changeContentAnim :'' } 1s ease-in ${props.initialLoad ? "0.3s" :''};`}
`;
export function EmailVerifyDashboardRender() {
  const {
    state: { email, isLoading, disabled, emailSend,changeEmail ,errorMessage,initialLoad},
    reSendEmailVerificationLink,handleState,onSubmit
  } = this;
  return (
    <Fragment>
      <Container>
        {isLoading && <ContainerLoader />}
        <NewFooter />
        <EmailStatus emailSend={emailSend}>An email send again!</EmailStatus>
        <center>
          <ImagesContainer>
            <GroupSvg emailSend={emailSend} initialLoad={initialLoad}/>
            <EmailSvg emailSend={emailSend} initialLoad={initialLoad} />
          </ImagesContainer>
        </center>
      
        {!changeEmail ?
           <Content changeEmail={changeEmail} initialLoad={initialLoad}> <Text> Please check your inbox!.</Text>
         <Summary>
           {" "}
           We just send a confirmation link to {email}. Click the link in the
           email to sign in to your dashboard.
         </Summary>
         <center>
           <ButtonsWrapper>
             <CustomButton
               disabled={disabled}
               onClick={()=>{reSendEmailVerificationLink()}}
               label={"Resend Email"}
             />
             <Counter id="counter" />
             <ChangeEmailButton  onClick={()=>{handleState('changeEmail',true)}}>or Change Email</ChangeEmailButton>
           </ButtonsWrapper>
         </center> </Content>  
         : <ChangeEmailComponent 
         changeEmail={changeEmail}
         onSubmit={onSubmit} 
         errorMessage={errorMessage}
         back={()=>{handleState('changeEmail',false)}}
         />}
         
      <Footer/>
      </Container>
    </Fragment>
  );
}
