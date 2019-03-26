import React from "react";
import styled from "styled-components";
import { specialFont } from "/imports/ui/components/landing/components/jss/helpers.js";

export const Head = styled.div`
  justify-content: center;
  display: flex;
  height: 51px;
  background-color: white;
  padding: 0px 15px 0px 15px;
`;
export const P = styled.p`
  font-weight: lighter;
  font-size: 19px;
  margin: 1px 0px 0px 5px;
  font-family: ${specialFont};
`;
export const Logo = styled.div`
  width: 24px;
  height: 24px;
  display: inline-block;
  top: 20px;
  position: relative;
`;
export const Img = styled.img`
  width: 100%;
  vertical-align: bottom;
`;
export const TextWrapper = styled.div`
  display: inline-block;
  padding: 20px 0;
  display: flex;
`;
export const H1 = styled.h1`
  font-weight: lighter;
  font-size: 24px;
  color: #ac1616;
  margin: 0;
  line-height: 1;
  font-family: ${specialFont};
`;
export const NewFooter = () =>{
    return(   <Head>
        <Logo>
          <Img src={config.skillShapeLogo} />
        </Logo>
        <TextWrapper>
          <H1>Skillshape,</H1>
          <P>your path revealed.</P>
        </TextWrapper>
      </Head>)
}
