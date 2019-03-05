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

const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  width: 100%;
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
        this.state = {};
    }
    handleSearch = () => {
        console.log('this.schoolName',this.schoolName.value);
    }
    render() {
        const {classes} = this.props;
        return (
            <MuiThemeProvider theme={muiTheme}>
                <Dialog
                  title="Onboarding School"
                  open={this.props.open}
                  onClose={this.props.onModalClose}
                  onRequestClose={this.props.onModalClose}
                  aria-labelledby="Onboarding School"
                >
                    { this.props.isLoading && <ContainerLoader/>}
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
                            label="Enter School Name"
                            type="text"
                            fullWidth
                            multiline
                            className={classes.textField}
                            inputProps={{ maxLength: 200 }}
                        />
                    </DialogContent>
                        <DialogActions classes={{action: this.props.classes.dialogAction}}>
                            <PrimaryButton  
                            onClick={this.handleSearch}
                            fullWidth 
                            label="Search"/>
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
