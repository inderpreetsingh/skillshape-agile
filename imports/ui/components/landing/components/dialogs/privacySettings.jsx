import ClearIcon from 'material-ui-icons/Clear';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';
import { FormControl, FormControlLabel } from "material-ui/Form";
import { ContainerLoader } from '/imports/ui/loading/container';
import { withPopUp, confirmationDialog } from '/imports/util';
import Radio, { RadioGroup } from "material-ui/Radio";

const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  width: 100%;
`;
const Divider = styled.div`
  height: 1.5px;
  background: black;
`;
const Heading = styled.div`
  font-size: 15px;
  font-weight: normal;
  padding: 15px 0px 16px 5px;
`;
const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
const ButtonWrapper = styled.div`
  width:'auto'
`;
const styles = {
    dialogAction: {
        width: '100%'
    },
    textField: {
        marginBottom: helpers.rhythmDiv
    }
}

class PrivacySettingsDialogBox extends React.Component {
    constructor(props) {
        super(props);
        this.initializeState(this.props)
    }
    initializeState = (props) =>{
        const {phoneAccess='public',emailAccess='public',memberId} = props;
        this.setState({phoneAccess,emailAccess,memberId});
    }
    componentWillReceiveProps(nextProps){
        this.initializeState(nextProps);
    }
    handleSave = () =>  {
        console.log(this.props)
    }
    handleRadioButtons = (e, stateName) => {
        this.setState({ [stateName]: e.target.value });
    }
    render() {
        const { schoolName = 'School', onModalClose, open } = this.props;
        const { isLoading, emailAccess, phoneAccess } = this.state;
        const itemsForPhone = [{ label: `Do not share you phone number with anyone at ${schoolName}`, value: 'private' }, { label: `Share your phone number with ${schoolName}.`, value: 'school' }, { label: `Share your phone with school and students at ${schoolName}.`, value: 'public' }]
        const itemsForEmail = [{ label: `Do not share your email with anyone at ${schoolName}.`, value: 'private' }, { label: `Share your email with ${schoolName}.`, value: 'school' }, { label: `Share your email with school and allow students at ${schoolName} to message you through SkillShape.`, value: 'public' }]
        return (
            <MuiThemeProvider theme={muiTheme}>
                <Dialog
                    title="Privacy Settings"
                    open={open}
                    onClose={onModalClose}
                    onRequestClose={onModalClose}
                    aria-labelledby="Privacy Settings"
                >
                    {isLoading && <ContainerLoader />}
                    <DialogTitle>
                        <DialogTitleWrapper>
                            Privacy Settings For {schoolName}
                            <IconButton color="primary" onClick={onModalClose}>
                                <ClearIcon />
                            </IconButton >
                        </DialogTitleWrapper>
                    </DialogTitle>
                    <DialogContent>
                        <Heading>
                            EMail Settings:
                            <FormControl component="fieldset" required>
                                <RadioGroup
                                    aria-label="privacySettings"
                                    value={emailAccess}
                                    name="privacySettings"
                                    onChange={(e) => { this.handleRadioButtons(e, "emailAccess") }}
                                    defaultSelected={'public'}
                                >
                                    {itemsForEmail.map((obj) =>
                                        <FormControlLabel
                                            control={<Radio />}
                                            {...obj}
                                        />
                                    )}
                                </RadioGroup>
                            </FormControl>
                        </Heading>
                        <Divider/>
                        <Heading>
                            Phone Settings:
                        <FormControl component="fieldset" required>
                                <RadioGroup
                                    aria-label="privacySettings"
                                    value={phoneAccess}
                                    name="privacySettings"
                                    onChange={(e) => { this.handleRadioButtons(e, "phoneAccess") }}
                                    defaultSelected={'public'}
                                >
                                    {itemsForPhone.map((obj) =>
                                        <FormControlLabel
                                            control={<Radio />}
                                            {...obj}
                                        />
                                    )}
                                </RadioGroup>
                            </FormControl>
                        </Heading>

                    </DialogContent>
                    <DialogActions classes={{ action: this.props.classes.dialogAction }}>
                        <ButtonsWrapper>
                            <ButtonWrapper>
                                <FormGhostButton
                                    alertColor
                                    fullWidth
                                    onClick={onModalClose}
                                    label={"Close"}
                                />
                            </ButtonWrapper>
                            <ButtonWrapper>
                                <FormGhostButton
                                    fullWidth
                                    onClick={() => { }}
                                    label={"Save"}
                                />
                            </ButtonWrapper>
                        </ButtonsWrapper>
                    </DialogActions>
                </Dialog>
            </MuiThemeProvider>
        )
    }
}

PrivacySettingsDialogBox.propTypes = {
    memberId: PropTypes.string,
    schoolName: PropTypes.string,
    open: PropTypes.bool,
    onModalClose: PropTypes.func
}
export default (withStyles(styles)(withPopUp(PrivacySettingsDialogBox)));
