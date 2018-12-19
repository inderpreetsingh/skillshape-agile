import React from 'react';
import IconButton from "material-ui/IconButton";
import ClearIcon from 'material-ui-icons/Clear';


import { Heading } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const TitleBarHeading = Heading.withComponent('span').extend``;

export const DialogBoxTitleBar = (props) => (
    <DialogTitleContainer variant={props.variant}>
        <TitleBarHeading>
            {props.title}
        </TitleBarHeading>
        <IconButton
            color="primary"
            onClick={props.onModalClose}
            classes={{ root: props.classes.iconButton }}>
            <ClearIcon />
        </IconButton >
    </DialogTitleContainer>
)

export const DialogTitleContainer = styled.div`
  ${helpers.flexCenter};
  ${props => {
        switch (props.variant) {
            case 'text-left-aligned': return `justify-content: space-between;`;
                break;
            default: '';
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
  flex-wrap: wrap;
`;

export const ActionButton = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;

