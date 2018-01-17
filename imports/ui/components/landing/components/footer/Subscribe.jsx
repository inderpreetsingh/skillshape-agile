import React from 'react';
import styled from 'styled-components';

import {withStyles} from 'material-ui/styles';
import TextField from 'material-ui/TextField';

import PrimaryButton from '../buttons/PrimaryButton.jsx';
import * as helpers from '../jss/helpers.js';
import { FooterSectionHeader, FooterText } from './FooterHelpers';

const styles = {
    userEmailInput : {
        padding: helpers.rhythmDiv,
        background: helpers.lightTextColor,
        fontFamily: helpers.commonFont,
        borderRadius: 3
    },
    userEmailInputInkBar: {
        '&:after': {
            backgroundColor: helpers.darkBgColor
        }
    }
}

const SubscribeWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const Subscribe = (props) => (
    <SubscribeWrapper itemScope itemType="http://schema.org/SubscribeAction">
        <FooterSectionHeader>
            Find out about new features
        </FooterSectionHeader>

        <FooterText itemProp="agent" itemScope itemType="http://schema.org/Organization">
            We are working steadily towards new features, and
            benefits. Sign up to hear about whats new with <span itemProp="legalName">SkillShape</span>!
        </FooterText>

        <TextField  id="user-email"  placeholder="Email Address"  type="email"  color={helpers.lightTextColor} fullWidth
          InputProps={{
            classes: {
                input: props.classes.userEmailInput,
                inkbar: props.classes.userEmailInputInkBar
            }
          }}
          onChange={props.onEmailFieldChange}/>

        <FooterText itemProp="object" itemScope itemType="http://schema.org/Thing">
            We hate spam and will not share your <span itemProp="name">email address</span>
        </FooterText>

        <PrimaryButton
          itemScope
          itemType="http://schema.org/RegisterAction"
          label="Connect with SkillShape"
          fullWidth onClick={props.onConnectUsButtonClick}/>
    </SubscribeWrapper>
);

export default withStyles(styles)(Subscribe);
