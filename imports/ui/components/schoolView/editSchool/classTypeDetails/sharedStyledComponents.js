import React from 'react';
import styled from 'styled-components';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';


export const AddCTFormWrapper = styled.div`
  background: white;
  max-width: calc(50% - ${helpers.rhythmDiv}px);
  width: 100%;
  margin-right: ${helpers.rhythmDiv * 2}px;
  padding: ${helpers.rhythmDiv}px ${helpers.rhythmDiv * 2}px;

  :nth-child(2n) {
    margin-right: 0;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    max-width: 100%;
    margin-right: 0;
    margin-bottom: ${helpers.rhythmDiv * 2}px;
  }
`;

export const AddLinkedTime = styled.div`
  ${helpers.flexCenter}  
  max-width: calc(50% - ${helpers.rhythmDiv * 2}px);
  flex-grow: 1;
  align-self: stretch;
  width: 100%;
  border: 1px dotted #333;

  :last-child {
    margin-right: 0;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    max-width: 100%;
    height: 160px;
  }
`;
