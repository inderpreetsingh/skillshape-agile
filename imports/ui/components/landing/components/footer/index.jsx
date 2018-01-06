import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Grid from 'material-ui/Grid';

import ConnectWithUs from './ConnectWithUs';
import FooterNav from './FooterNav';
import HowSkillShapeWorks from './HowSkillShapeWorks';
import Subscribe from './Subscribe'; 

import * as helpers from '../jss/helpers.js';

const Container = styled.div`
    overflow: hidden;
    width: 100%;
    background-color: ${helpers.darkBgColor};
    padding: ${helpers.rhythmDiv * 2}px;
`;

const Footer = (props) => (
    <Container>
        <Grid container spacing={16} justify="space-between" alignItems="flex-start">
            <Grid item md={3} sm={6} xs={12}>
                {props.firstSection ? props.firstSection : <HowSkillShapeWorks /> }
            </Grid>
            
            <Grid item md={1} sm={6} xs={12}>
                {props.secondSection ? props.secondSection : <FooterNav />}
            </Grid>
            
            <Grid item md={3} sm={6} xs={12}>
                {props.thirdSection ? props.thirdSection: 
                <Subscribe 
                    onEmailFieldChange={props.onEmailFieldChange}
                    onConnectUsButtonClick={props.onConnectUsButtonClick} />}
            </Grid>
            
            <Grid item md={2} sm={6} xs={12}>
                {props.fourthSection ? props.fourthSection: <ConnectWithUs />} 
            </Grid>
        </Grid>
    </Container>
);

Footer.propTypes = {
    firstSection: PropTypes.element,
    secondSection: PropTypes.element,
    thirdSection: PropTypes.element,
    fourthSection: PropTypes.element,
    onEmailFieldChange: PropTypes.func,
    onConnectUsButtonClick: PropTypes.func
}

export default Footer;