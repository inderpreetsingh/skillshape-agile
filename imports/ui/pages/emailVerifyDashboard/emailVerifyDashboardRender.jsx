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
const changeEmailAnim = keyframes`
1% {
  right: 103%;
  top: 82%;
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
const changeGroupSvgAnim = keyframes`
0% {
  transform : rotate(0deg);
}
100% {
  transform: rotate(359deg);
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
  text-align: center;
  display:flex;
  justify-content:center;
  flex-wrap: wrap;
  @media screen and (max-width: ${helpers.tablet}px) {
    display: block;
  }
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
  text-align: center;
  min-width: 280px;
  font-family: ${specialFont};
  transition: all 0.3s ease-out;
  visibility: ${props => (props.emailSend || props.isLoading || props.initialLoad ? "visible" : "hidden")};
  padding: ${props => (props.emailSend || props.isLoading || props.initialLoad  ? "4px 50px 4px 50px" : "0px")};
  height: ${props => (props.emailSend || props.isLoading || props.initialLoad ? "35px" : "0px")};
`;
const GroupSvg = styled.div`
  background-image: url(${config.groupSvg});
  background-repeat: no-repeat;
  height: 122px;
  width: 121px;
  ${props => ( `animation: ${props.initialLoad  ? initialGroupSvgAnim :!props.changeEmail ? changeGroupSvgAnim : props.emailSend ? groupSvgAnim : ""} 1s ease-in ${props.initialLoad ? "0.2s" :''};` )}
  ${props => (props.isLoading ? `animation: ${changeGroupSvgAnim} 0.5s linear infinite;` :'')}
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
  ${props => (`animation: ${ props.changeEmail  ? changeEmailAnim :props.emailSend ? emailSvgAnim : props.initialLoad ? initialEmailAnim : ''} 1s ease-in ${props.initialLoad ? "0.2s" :''};`)}
  ${props => (``)}
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
  @media screen and (max-width: ${helpers.tablet}px) {
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
  @media screen and (max-width: ${helpers.tablet}px) {
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
  height: -webkit-fill-available;
  position: relative;
`;
const ImagesContainer = styled.div`
  position: relative;
  width: fit-content;
  margin:41px auto 24px auto;
`;

const ChangeEmailButton = styled.div`
    color: #333;
    height: 48px;
    font-family: ${specialFont};
    font-size: 24px;
    padding: 8px 30px;
    box-sizing: border-box;
    border-radius: 5px;
    font-style: italic;
    font-weight: lighter;
    margin-top: 10px;
    border: 1px solid;
    max-width: 200px;
    margin: 10px auto 10px auto;
    cursor: pointer;

@media screen and (max-width: ${helpers.tablet}px) {
  color: blue;
  border: 0px;
  font-size: 19px;
  font-style: italic;
  font-weight: lighter;
  position: relative;
  cursor: pointer;
  text-decoration: underline;
}
`;
const Footer = styled.div`
  height: 48px;
  background: #ddd;
  bottom: 0;
  width: 100%;
  position: fixed;
`;
const Content = styled.div`
${props => `animation: ${props.initialLoad ? initialChangeContentAnim : !props.changeEmail ? changeContentAnim :'' } 1s ease-in ${props.initialLoad ? "0.2s" :''};`}
`;

const Center = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;
export function EmailVerifyDashboardRender() {
  const {
    state: { email, isLoading, disabled, emailSend,changeEmail ,errorMessage,initialLoad},
    reSendEmailVerificationLink,handleState,onSubmit
  } = this;
  return (
    <Fragment>
        <NewFooter />
      <Container>
        <Center>
        <EmailStatus emailSend={emailSend} isLoading={isLoading} initialLoad={initialLoad} >{isLoading ? 'Please wait!' : emailSend ?"An email send again!" : initialLoad ? "Email is send": "" }</EmailStatus>
          <ImagesContainer>
            <GroupSvg emailSend={emailSend} initialLoad={initialLoad}  changeEmail={changeEmail} isLoading={isLoading}/>
            <EmailSvg emailSend={emailSend} initialLoad={initialLoad}  changeEmail={changeEmail} isLoading={isLoading} />
          </ImagesContainer>
        {!changeEmail ?
           <Content changeEmail={changeEmail} initialLoad={initialLoad}> <Text> Please check your inbox!.</Text>
         <Summary>
           {" "}
           We just send a confirmation link to {email}. Click the link in the
           email to sign in to your dashboard.
         </Summary>
           <ButtonsWrapper>
             <CustomButton
               disabled={disabled}
               onClick={()=>{reSendEmailVerificationLink()}}
               label={"Resend Email"}
               id="counter"
             />
             <ChangeEmailButton  onClick={()=>{handleState('changeEmail',true)}}>Change Email</ChangeEmailButton>
           </ButtonsWrapper>
          </Content>  
         : <ChangeEmailComponent 
         changeEmail={changeEmail}
         onSubmit={onSubmit} 
         errorMessage={errorMessage}
         back={()=>{handleState('changeEmail',false)}}
         />}
         </Center>
      </Container>
      <Footer/>
    </Fragment>
  );
}
