import React from 'react';
import styled from 'styled-components';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

export const CTFormRow = styled.div`
  ${helpers.flexCenter}

  @media screen and (max-width: ${helpers.mobile}px) {
    flex-direction: column;
  }
`;

export const CTFormControlHW = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  max-width: calc(50% - ${helpers.rhythmDiv}px);
  width: 100%;
`;


export const CTFormWrapper = styled.div`
  background: white;
  max-width: calc(50% - ${helpers.rhythmDiv}px);
  width: 100%;
  margin-right: ${helpers.rhythmDiv * 2}px;
  padding: ${helpers.rhythmDiv}px ${helpers.rhythmDiv * 2}px;
  position: relative;
  :nth-child(2n) {
    margin-right: 0;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    max-width: 100%;
    margin-right: 0;
    margin-bottom: ${helpers.rhythmDiv * 2}px;
  }
`;

export const LinkedTime = styled.div`
  ${helpers.flexCenter}  
  max-width: calc(50% - ${helpers.rhythmDiv * 2}px);
  flex-grow: 1;
  align-self: stretch;
  width: 100%;
  border: 1px dotted #333;
  min-height: 100px;

  :last-child {
    margin-right: 0;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    max-width: 100%;
    height: 160px;
  }
`;
