import React , {Fragment,Component} from 'react';
import ReactStars from 'react-stars';
import { get, isEmpty } from 'lodash';
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
import ClassTimes from "/imports/api/classTimes/fields";

class ClassTypeCard extends Component {
    state = {
        dialogOpen: false,
    }
    handleDialogState = (state) => (e) => {
        e.stopPropagation();
        console.log(e,e.stopPropagation(),"clickced");
        this.setState({
            dialogOpen: state,
            classTimesDialogBoxError: null,
        });
    }

    getClassTimes = (classTypeId) => {
        if(classTypeId)
            return ClassTimes.find({classTypeId}).fetch();
    }

    handleClassTimeRequest = (schoolId, classTypeId, classTypeName) => {
        console.log("handleClassTimeRequest --->>",schoolId, classTypeId)
        if(Meteor.userId()) {
            Meteor.call("classTimesRequest.notifyToSchool", {schoolId, classTypeId, classTypeName}, (err, res) => {
                console.log("err -->>",err);
                console.log("handleClassTimeRequest res -->>",res);
                let modalObj = {
                    dialogOpen: false
                }

                if(res && res.message) {
                    modalObj.classTimesDialogBoxError = res.message;
                    modalObj.dialogOpen = true
                }
                this.setState(modalObj)
            })
        } else {
            alert("Please login !!!!")
        }
    }

    render() {
        console.log("ClassTypeCard props --->>",this.props);
        const cardRevealData = {
                        ageMin:this.props.ageMin,
                        ageMax:this.props.ageMax,
                        gender:this.props.gender,
                        experienceLevel:this.props.experienceLevel,
                        description:this.props.desc,
                        name:this.props.name,
                    }
        const classTimesData = this.getClassTimes(get(this.props, "_id", null))
        return(
            <Fragment>
            {
                this.state.dialogOpen &&
                <ClassTimesDialogBox
                    classesData={classTimesData}
                    open={this.state.dialogOpen}
                    onModalClose={this.handleDialogState(false)}
                    handleClassTimeRequest={this.handleClassTimeRequest.bind(this, this.props.schoolId, this.props._id, this.props.name)}
                    errorText={this.state.classTimesDialogBoxError}
                />
            }
            <CardsReveal {...this.props}
                body={
                <ClassTypeCardBody
                    ratings={this.props.ratings}
                    reviews={this.props.reviews}
                    onJoinClassButtonClick={this.handleDialogState(true)} />
                }
                descriptionContent={
                <ClassTypeCardDescription
                    classTimeCheck={!isEmpty(classTimesData)}
                    ratings={this.props.ratings}
                    reviews={this.props.reviews}
                    description={this.props.desc}
                    onClassTimeButtonClick={this.handleDialogState(true)}
                    cardRevealInfo={cardRevealData}
                    />
                } />
            </Fragment>
            )
        }
}

export default ClassTypeCard;
