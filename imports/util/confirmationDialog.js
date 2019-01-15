import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton.jsx';
import styled from "styled-components";
import { rhythmDiv } from '/imports/ui/components/landing/components/jss/helpers.js';
import React from "react";
const ButtonWrapper = styled.div`margin-bottom: ${rhythmDiv}px;`;

export function confirmationDialog(data) {
   const {title,content,buttons,type,popUp} = data;
   popUp.appear(type, {
    title,
    content,
    RenderActions: (<ButtonWrapper>
      {buttons.map((obj)=>{
          return ( 
              <FormGhostButton
                  applyClose
                  {...obj}
              />
          )
      })}
  </ButtonWrapper>)
  }, true);
  }