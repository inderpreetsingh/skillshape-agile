import React, { Fragment } from 'react';
import styled from 'styled-components';
import { specialFont } from "/imports/ui/components/landing/components/jss/helpers.js";

const Wrapper = styled.div`
  background-color: aliceblue;
  height: 100%;
  width: 100%;
  position: absolute;
  min-height: 200px;
`;
const HelperText = styled.div`
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  font-size: 24px;
  font-family: ${specialFont};
  font-style: italic;
`;


const OAuthRender = (props) => {
   
    return (
        <Fragment>
            <Wrapper><HelperText> {props.errorText  || "Please Wait..."}</HelperText></Wrapper>
        </Fragment>
    );
};

export default OAuthRender;
