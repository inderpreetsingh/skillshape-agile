import PropTypes from 'prop-types';
import React,{Fragment} from 'react';
import styled from 'styled-components';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';
import { ContainerLoader } from '/imports/ui/loading/container';
import {withPopUp} from '/imports/util';
import {confirmationDialog} from '/imports/util';
import Notification from "/imports/ui/components/landing/components/helpers/Notification.jsx";
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton.jsx';
import {isEmpty} from 'lodash';

class CompletePrompt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser:Meteor.user()
        };
    }
    GenerateNotificationContent = () =>{
        const {currentUser} = this.state;
        let itemLists = ['My Profile'];
        console.log('TCL: CompletePrompt -> GenerateNotificationContent -> currentUser', currentUser)
        if(!isEmpty(currentUser)){
            const {roles=[] } = currentUser;
            let isSchool = false;
            roles.map((role)=>{
                if(role == 'School'){
                    isSchool = true;
                }
            })
            if(isSchool){
              itemLists = ['My Profile','School Info','Locations','Class Types','Class Times','Prices'];
            }
            return <div>
                {itemLists.map((item, index) => {
                    return <FormGhostButton
                        darkGreyColor
                        onClick={() => { }}
                        label={item}
                        icon
                        iconName="check"
                    />
                })}
            </div>
        }
        return '';
    }
    
    render() {
        const {currentUser} = this.state;
        if(isEmpty(currentUser)){
            return <Fragment/>
        }
        return (
            <Notification
                notificationContent={this.GenerateNotificationContent()}
                bgColor={helpers.primaryColor}
                buttonLabel="Next"
                onButtonClick={() => { }}
              /> 
        )
    }
}

CompletePrompt.propTypes = {
 
}
export default ((withPopUp(CompletePrompt)));
