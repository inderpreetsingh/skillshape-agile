import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from "lodash/isEmpty";
import PrimaryButton from '../buttons/PrimaryButton';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MonthlyPricing from "/imports/api/monthlyPricing/fields.js";
import ClearIcon from 'material-ui-icons/Clear';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import styled from 'styled-components';
import { createContainer } from "meteor/react-meteor-data";
import { MuiThemeProvider } from 'material-ui/styles';
import IconInput from '../form/IconInput.jsx';
import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';
import { ContainerLoader } from '/imports/ui/loading/container';
import ClassTimeButton from "/imports/ui/components/landing/components/buttons/ClassTimeButton.jsx";

import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  width: 100%;
`;


const InputWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const styles = {
    dialogAction: {
        width: '100%'
    }
}

const ErrorWrapper = styled.span`
    color: red;
    float: right;
`;

class PackageListingAttachment extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.initializeFields();
      }
    initializeFields = () => {
        let state={
            
        }
        return {...state}
    }
    packageListing=(monthlyPackageData)=>{
        console.log(monthlyPackageData)
        if(!isEmpty(monthlyPackageData)){
            return monthlyPackageData.map((current,index)=>{
                return current.packageName
            })
        }
    }
    render() {
        const {monthlyPackageData} = this.props;
        return (
            <MuiThemeProvider theme={muiTheme}>
                <Dialog
                    title="Package Listing"
                    open={this.props.open}
                    onClose={this.props.onModalClose}
                    onRequestClose={this.props.onModalClose}
                    aria-labelledby="Package Listing"
                >
                    {this.props.isLoading && <ContainerLoader />}
                    <DialogTitle>
                        <DialogTitleWrapper>
                            Connect To Packages
                            <IconButton color="primary" onClick={() => { this.props.onClose() }}>
                                <ClearIcon />
                            </IconButton >
                        </DialogTitleWrapper>
                    </DialogTitle>
                    <DialogContent>
                        {this.packageListing(monthlyPackageData)}
                    </DialogContent>
                    <DialogActions classes={{ action: this.props.classes.dialogAction }}>

                        <ClassTimeButton
                            fullWidth
                            noMarginBottom
                            label="Connect"
                            onClick={() => { this.props.onClose() }}
                        />
                    </DialogActions>

                </Dialog>
            </MuiThemeProvider>
        )
    }
}

export default createContainer(props => {
    const { schoolId } = props;
    let monthlyPackageData=[],monthlySubscription;
     monthlySubscription = Meteor.subscribe("monthlyPricing.getMonthlyPricing", { schoolId });
    if(monthlySubscription && monthlySubscription.ready()){
        monthlyPackageData= MonthlyPricing.find().fetch()
    }
    return {
      ...props,
      monthlyPackageData
    };
  }, withStyles(styles)(PackageListingAttachment));