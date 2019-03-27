import { Fragment } from "react";
import styled, { keyframes } from "styled-components";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import { ContainerLoader } from "/imports/ui/loading/container";
import { specialFont } from "/imports/ui/components/landing/components/jss/helpers.js";
import { NewFooter } from "./NewFooter";
import React from "react";
import {CustomButton} from '/imports/ui/components/landing/components/buttons';

const changeContentAnim = keyframes`
0% {
  opacity:0;
}
100% {
  opacity:1;
}
`;
const Input = styled.input.attrs({
  type: "email"
})`
  margin: auto;
  position: relative;
  1px solid #ddd;
  outline: none;
  display: block;
  border-radius: 17px;
  border: 1px solid #ddd;
  height: 38px;
  min-width: 300px;
  text-align: center;
  font-family: ${specialFont};
  font-style: italic;
    ::placeholder {
      color: #ddd;
  font-family: ${specialFont};
  font-style: italic;

    }
  `;

const Center =  styled.div`
    height:224px;
    text-align: center;
`;
const Error = styled.div`
  font-family: ${specialFont};
  font-style: italic;
  color: red;
  margin-bottom: 12px;
  font-size: 15px;
`;

const Content = styled.div`
  min-height: 337px;
  transition: all 1s ease-out;
  ${props =>
    props.changeEmail
      ? `animation: ${changeContentAnim} 1s`
      : `animation: ${changeContentAnim} 1s`}
`;
export function ChangeEmailComponent(props) {
 
  return (
    <Fragment>
      <Content changeEmail={props.changeEmail}> 
      <Center>
      <form onSubmit={props.onSubmit}>
      <Input placeholder="Please Enter Email" id={'emailField'} required />
      <Error> {props.errorMessage}</Error>
      <CustomButton 
      label={'Send'}
      type={'Submit'}
      />
      <br/>
      <CustomButton 
      label={'Back'}
      onClick={props.back}
      />
      </form>
      </Center>
      </Content> 
    </Fragment>
  );
}
