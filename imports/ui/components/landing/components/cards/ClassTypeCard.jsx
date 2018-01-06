import React , {Fragment,Component} from 'react';
import ReactStars from 'react-stars';
import { MuiThemeProvider} from 'material-ui/styles';
import Typography from 'material-ui/Typography';

import styled from 'styled-components';

import CardsReveal from './CardsReveal.jsx';
import SecondaryButton from '../buttons/SecondaryButton.jsx';
import PrimaryButton from '../buttons/PrimaryButton.jsx';
import ClassTimesDialogBox from '../dialogs/ClassTimesDialogBox.jsx';

import * as helpers from '../jss/helpers.js';
import MuiTheme from '../jss/muitheme';

import ClassTypeCardBody from './ClassTypeCardBody.jsx';
import ClassTypeCardDescription from './ClassTypeCardDescription.jsx';

import classTimesData from '../../constants/classTimesData';

class ClassTypeCard extends Component {
    state = {
        dialogOpen: false,
    }
    handleDialogState = (state) => (e) => {
        e.stopPropagation();
        console.log(e,e.stopPropagation(),"clickced");
        this.setState({
            dialogOpen: state
        });
    }
    render() {

        return(
            <Fragment>
            {this.state.dialogOpen && 
            <ClassTimesDialogBox 
                classesData={classTimesData}
                open={this.state.dialogOpen} 
                onModalClose={this.handleDialogState(false)} />}
            <CardsReveal {...this.props} 
                body={    
                <ClassTypeCardBody 
                    ratings={this.props.ratings} 
                    reviews={this.props.reviews} 
                    onJoinClassButtonClick={this.handleDialogState(true)} />
                }
                descriptionContent={
                <ClassTypeCardDescription 
                    ratings={this.props.ratings}
                    reviews={this.props.reviews}
                    description={this.props.description}
                    onClassTimeButtonClick={this.handleDialogState(true)}/>
                } />
            </Fragment>
            )
        }
}

export default ClassTypeCard;
    