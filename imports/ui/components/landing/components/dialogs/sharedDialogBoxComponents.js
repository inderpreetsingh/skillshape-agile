import { get } from 'lodash';
import ClearIcon from 'material-ui-icons/Clear';
import IconButton from 'material-ui/IconButton';
import React from 'react';
import styled from 'styled-components';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import { Heading } from '/imports/ui/components/landing/components/jss/sharedStyledComponents';

const TitleBarHeading = Heading.withComponent('span').extend`
    ${props => props.fontSize && `font-size: ${helpers.fontSize}px`}
`;

export const DialogBoxTitleBar = props => (
  <DialogTitleContainer variant={get(props.titleProps, 'variant', '')}>
    <TitleBarHeading fontSize={get(props.titleProps, 'fontSize', '')}>
      {props.title}
    </TitleBarHeading>
    <IconButton
      color="primary"
      onClick={props.onModalClose}
      classes={{ root: get(props.classes, 'iconButton', '') }}
    >
      <ClearIcon />
    </IconButton>
  </DialogTitleContainer>
);

export const DialogTitleContainer = styled.div`
  ${helpers.flexCenter};
  ${(props) => {
    switch (props.variant) {
      case 'text-left-aligned':
        return 'justify-content: space-between;';
      default:
        return '';
    }
  }}
`;

export const DialogTitleWrapper = styled.h1`
  ${helpers.flexCenter};
  font-family: ${helpers.specialFont};
  font-weight: 500;
  width: 100%;
  margin: 0;

  @media screen and (max-width: ${helpers.mobile}px) {
    font-size: ${helpers.baseFontSize * 1.25}px;
  }
`;

export const ActionButtons = styled.div`
  ${helpers.flexCenter}
  width: 100%;
  justify-content: ${props => props.justifyContent || 'center'};
  flex-wrap: wrap;
`;

export const ActionButton = styled.div`
  display: flex;
  margin-bottom: ${helpers.rhythmDiv}px;
`;
