import React from 'react';
import IconButton from "material-ui/IconButton";
import ClearIcon from 'material-ui-icons/Clear';


import { Heading } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
import { DialogTitleContainer } from './sharedDialogBoxStyles';
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