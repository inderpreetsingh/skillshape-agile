import { Fragment } from "react";
import styled, { keyframes } from "styled-components";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import { ContainerLoader } from "/imports/ui/loading/container";
import { specialFont } from "/imports/ui/components/landing/components/jss/helpers.js";
import { NewFooter } from "./NewFooter";
import React from "react";
import {CustomButton} from '/imports/ui/components/landing/components/buttons';

const Input = styled.input.attrs({
  type: "email"
})`
  margin: auto;
  bottom: 27px;
  margin-top: 48px;
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
export function ChangeEmailComponent(props) {
 
  return (
    <Fragment>
      <Center>
      <form onSubmit={props.onSubmit}>
      <Input placeholder="Please Enter Email" id={'emailField'} required />
      <CustomButton 
      label={'Send'}
      type={'Submit'}
      />
      </form>
      </Center>
    </Fragment>
  );
}
