import React from 'react';
import styled from 'styled-components';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

export const styles = {
  formField: {
    marginRight: helpers.rhythmDiv,
  },
  formFieldSmReset: {
    marginRight: helpers.rhythmDiv,
    [`@media screen and (max-width: ${helpers.mobile}px)`]: {
      marginRight: 0
    }
  },
  iconButton: {
    background: "white",
    fontSize: helpers.baseFontSize,
    height: 'auto',
    width: 'auto',
    borderRadius: '50%',
  },
  icon: {
    color: helpers.alertColor
  },
  pickerField: {
    margin: 0,
  }
}


export const CTIconButtonWrapper = styled.div`
  position: absolute;
  top: ${helpers.rhythmDiv}px;
  right: ${helpers.rhythmDiv}px;
  margin-bottom: ${helpers.rhythmDiv}px;
`;


export const CTFormRow = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  ${props => props.marginBottom && `margin-bottom: ${props.marginBottom}px;`}
  
  @media screen and (max-width: ${helpers.mobile}px) {
    flex-direction: column;
  }
`;

export const CTFormControlHW = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  max-width: calc(50% - ${helpers.rhythmDiv}px);
  width: 100%;
  margin-bottom: ${helpers.rhythmDiv * 2}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    max-width: 100%;
  }
`;


export const CTFormWrapper = styled.div`
  background: white;
  width: 100%;
  padding: ${helpers.rhythmDiv * 2}px;
  padding-right: ${helpers.rhythmDiv * 5}px;
  position: relative;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  border-radius: 3px;
  
  @media screen and (max-width: ${helpers.mobile}px) {
    max-width: 100%;
    margin-right: 0;
    margin-bottom: ${helpers.rhythmDiv * 2}px;
  }
`;

export const LinkedTime = styled.div`
  ${helpers.flexCenter}  
  flex-grow: 1;
  align-self: stretch;
  border-radius: 3px;
  width: 100%;
  border: 1px dotted #333;
  height: 120px;
`;
