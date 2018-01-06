import React, {Fragment} from 'react';
import styled from 'styled-components';
import ReactStars from 'react-stars';
import PropTypes from 'prop-types';
import { MuiThemeProvider} from 'material-ui/styles';
import Typography from 'material-ui/Typography';

import PrimaryButton from '../buttons/PrimaryButton.jsx';
import SecondaryButton from '../buttons/SecondaryButton.jsx';

import * as helpers from '../jss/helpers.js';
import MuiTheme from '../jss/muitheme';

import Grid from 'material-ui/Grid'

const Reviews = styled.a`
    color: ${helpers.primaryColor};
`;


const ClassTypeCardDescription = (props) => (
    <MuiThemeProvider theme={MuiTheme}>
        <Fragment>
            <div>
                <ReactStars size={15} value={props.ratings} edit={false}/>
                <Reviews href="#">
                    <Typography>{props.reviews} Reviews</Typography>
                </Reviews>
            </div>
            
            <div className="description">
             <Grid container spacing={8}>
             <Grid item xs={12}>
                <Typography>{props.description}</Typography>
              </Grid>
               <Grid item xs={12} sm={6}>
                    <SecondaryButton fullWidth label="View Details"/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <SecondaryButton fullWidth label="View School" />
                </Grid>
                <Grid item xs={12}>
                    <PrimaryButton label="View Class Times" fullWidth onClick={props.onClassTimeButtonClick}/>
                </Grid>
                </Grid>
            </div>
        </Fragment>
    </MuiThemeProvider>    
);

ClassTypeCardDescription.propTypes = {
    ratings : PropTypes.number,
    reviews: PropTypes.number,
    description: PropTypes.string,
    onClassTimeButtonClick: PropTypes.func
};

export default ClassTypeCardDescription;


