import ClearIcon from 'material-ui-icons/Clear';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import PrimaryButton from '../buttons/PrimaryButton';
import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';
import { ContainerLoader } from '/imports/ui/loading/container';
import {withPopUp} from '/imports/util';
import TextField from "material-ui/TextField";
import {gotoClaimSchool} from '/imports/util';
import { browserHistory } from "react-router";
const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  width: 100%;
`;
const CenterAll = styled.div`
  display: flex;
  justify-content: center;
`;
const styles = {
    dialogAction: {
        width: '100%'
    },
    textField: {
        marginBottom: helpers.rhythmDiv
      }
}

class OnBoardingDialogBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading:false
        };
    }
    handleSearch = () => {
        const {popUp} = this.props;
        const schoolName = this.schoolName.value;
        if(!schoolName){
            popUp.appear('alert',{content:'Please enter school name!'});
            return;
        }
        else if(schoolName.length < 3)
        {
            popUp.appear('alert',{content:'School name length is less then 3!'});
            return;
        }
        else{
            this.checkSchoolNameExists(schoolName);
        }
    }

    checkSchoolNameExists = (schoolName) =>{
        this.setState({isLoading:true});
        const {popUp} = this.props;
        Meteor.call("school.findSchoolNameExistsOrNot",schoolName,(err,res)=>{
            this.setState({isLoading:false});
            if(!res){
                this.handleListingOfNewSchool(schoolName);
            }
            else if(res){
                gotoClaimSchool(schoolName);
            }
            else if(err){
              popUp.appear('alert',{content:'Something Went Wrong!'});
            }
        })
    }
    handleListingOfNewSchool = (schoolName) => {
        let currentUser = Meteor.user();
        if (currentUser) {
          this.setState({ isLoading: true });
          Meteor.call("school.addNewSchool", currentUser,schoolName, (err, res) => {
            let state = {
              isLoading: false
            };
            if (res) {
              browserHistory.push(res);
            }
            this.setState(state);
          });
        } else {
          // Show Login popup
          Events.trigger("loginAsUser");
        }
      };
    render() {
        const {classes} = this.props;
        const {isLoading} = this.state;
        return (
            <MuiThemeProvider theme={muiTheme}>
                <Dialog
                  title="Onboarding School"
                  open={this.props.open}
                  onClose={this.props.onModalClose}
                  onRequestClose={this.props.onModalClose}
                  aria-labelledby="Onboarding School"
                >
                    { isLoading && <ContainerLoader/>}
                   <DialogTitle>
                        <DialogTitleWrapper>
                            Enter Your School Name
                            <IconButton color="primary" onClick={this.props.onModalClose}>
                                <ClearIcon/>
                            </IconButton >
                        </DialogTitleWrapper>
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            inputRef={ref => (this.schoolName = ref)}
                            label="School Name!"
                            type="text"
                            fullWidth
                            multiline
                            className={classes.textField}
                            inputProps={{ maxLength: 200 }}
                        />
                        Please Enter Your School Name to find in existing records.
                    </DialogContent>
                        <DialogActions classes={{action: this.props.classes.dialogAction}}>
                           <CenterAll>
                            <PrimaryButton  
                            onClick={this.handleSearch}
                            label="Search"/>
                            </CenterAll>
                        </DialogActions>
                </Dialog>
            </MuiThemeProvider>
        )
    }
}

OnBoardingDialogBox.propTypes = {
  userId: PropTypes.string,
  open: PropTypes.bool,
  onModalClose: PropTypes.func
}
export default (withStyles(styles)(withPopUp(OnBoardingDialogBox)));
