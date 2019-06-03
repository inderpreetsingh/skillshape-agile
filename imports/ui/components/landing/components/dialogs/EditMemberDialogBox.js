import get from 'lodash/get';
import Dialog, { withMobileDialog } from 'material-ui/Dialog';
import { FormControl } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
// import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Multiselect from 'react-widgets/lib/Multiselect';
import styled from 'styled-components';
import PrimaryButton from '../buttons/PrimaryButton';
import * as helpers from '../jss/helpers';
import muiTheme from '../jss/muitheme';
import ClassType from '/imports/api/classType/fields';
import { ContainerLoader } from '/imports/ui/loading/container';
import { toastrModal } from '/imports/util';

const styles = {
  dialogPaper: {
    padding: `${helpers.rhythmDiv * 2}px`,
  },
};

const FormInnerWrapper = styled.div`
  overflow: hidden;
`;

class EditMemberDialogBox extends Component {
  constructor(props) {
    super(props);
    const { memberInfo } = this.props;
    this.state = {
      firstName: memberInfo.firstName,
      lastName: memberInfo.lastName || '',
      email: memberInfo.email || null,
      phone: memberInfo.phone,
      birthYear: parseInt(memberInfo.birthYear) || '',
      classTypeData: ClassType.find({
        _id: { $in: memberInfo.classTypeIds || [] },
      }).fetch(),
      isLoading: false,
      showErrorMessage: false,
      error: false,
      selectedClassTypes: null,
    };
  }

  collectSelectedClassTypes = (data) => {
    const classTypeIds = data.map(item => item._id);
    this.setState({ selectedClassTypes: classTypeIds });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { memberInfo } = this.props;
    const payload = {};
    payload.firstName = this.state.firstName;
    payload.lastName = this.state.lastName;
    payload.phone = this.state.phone;
    payload.birthYear = this.state.birthYear;
    payload.classTypeIds = this.state.selectedClassTypes;
    payload.email = this.state.email;
    payload.schoolId = this.props.schoolId;
    payload.studentWithoutEmail = get(memberInfo, 'studentWithoutEmail');
    this.setState({ isLoading: true });
    Meteor.call(
      'schoolMemberDetails.editSchoolMemberDetails',
      { doc_id: memberInfo._id, doc: payload },
      (err, res) => {
        const { toastr } = this.props;
        if (res) {
          this.props.onModalClose();
        }
        if (err) {
          toastr.error(`${err.reason || err.message}`, 'Error');
        }
        this.setState({ isLoading: false });
        // Close Modal
        this.props.reRender(memberInfo._id);
      },
    );
  };

  render() {
    const {
      classes, open, fullScreen, onModalClose, memberInfo,
    } = this.props;

    const currentYear = new Date().getFullYear();
    const birthYears = [];
    for (let i = 0; i < 60; i++) {
      birthYears[i] = currentYear - i;
    }

    // This is used to save Tagged media details
    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onModalClose}
        onRequestClose={onModalClose}
        aria-labelledby="sign-up"
        classes={{ paper: classes.dialogPaper }}
      >
        <MuiThemeProvider theme={muiTheme}>
          <form onSubmit={this.onSubmit}>
            <FormInnerWrapper>
              <Grid container spacing={24}>
                {/* 1rst Row */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    margin="normal"
                    fullWidth
                    value={this.state.firstName}
                    required
                    onChange={event => this.setState({ firstName: event.target.value })}
                  />
                </Grid>
                {this.state.isLoading && <ContainerLoader />}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    margin="normal"
                    fullWidth
                    value={this.state.lastName}
                    onChange={event => this.setState({ lastName: event.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="email"
                    label="Email"
                    margin="normal"
                    fullWidth
                    value={this.state.email}
                    required
                    disabled={memberInfo.email}
                    onChange={event => this.setState({ email: event.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    margin="normal"
                    value={this.state.phone}
                    fullWidth
                    onChange={event => this.setState({ phone: event.target.value })}
                  />
                  {this.state.showErrorMessage && (
                    <Typography color="error" type="caption">
                      Not a valid Phone number
                    </Typography>
                  )}
                </Grid>

                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel htmlFor="birthYear">Birth Year</InputLabel>
                    <Select
                      required
                      input={<Input />}
                      value={this.state.birthYear}
                      onChange={event => this.setState({ birthYear: event.target.value })}
                      fullWidth
                    >
                      {birthYears.map((index, year) => (
                        <MenuItem key={birthYears[year]} value={birthYears[year]}>
                          {birthYears[year]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} style={{ marginTop: '26px' }}>
                  <div className="filters-dialog">
                    <Multiselect
                      textField="name"
                      valueField="_id"
                      data={this.props.classTypeData}
                      defaultValue={get(this.state, 'classTypeData', [])}
                      placeholder="Skill category"
                      onChange={this.collectSelectedClassTypes}
                    />
                  </div>
                </Grid>
                <Grid
                  item
                  sm={12}
                  xs={12}
                  md={12}
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  {this.state.error && <ErrorWrapper>{this.state.error}</ErrorWrapper>}
                  <PrimaryButton formId="addUser" type="submit" label="Save" />
                  <PrimaryButton
                    formId="cancelUser"
                    label="Cancel"
                    onClick={() => this.props.onModalClose()}
                  />
                </Grid>
              </Grid>
            </FormInnerWrapper>
          </form>
        </MuiThemeProvider>
      </Dialog>
    );
  }
}

EditMemberDialogBox.propTypes = {
  onModalClose: PropTypes.func,
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
};

export default withMobileDialog()(withStyles(styles)(toastrModal(EditMemberDialogBox)));
