import React from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';;

import DashViewRender from './dashViewRender';
class DashView extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        renderStudentModal: false,
    };

    renderStudentAddModal = () => {
      return (
        <Grid container spacing={24}>
            {/* 1rst Row */}
            <Grid item xs={12} sm={12}>
                <TextField
                  id="firstName"
                  label="First Name"
                  margin="normal"
                  fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={12}>
                <TextField
                  id="lastName"
                  label="Last Name"
                  margin="normal"
                  fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={12}>
                <TextField
                  id="email"
                  label="Email"
                  margin="normal"
                  fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={12}>
                <TextField
                  id="phone"
                  label="Phone"
                  margin="normal"
                  fullWidth
                />
            </Grid>
            <Grid item sm={12} xs={12} md={12} style={{float:'right'}}>
                <Button raised color="primary">
                  Add
                </Button>
          </Grid>
          </Grid>
      )
    }
    handleMemberDialogBoxState = () => {
        this.setState({renderStudentModal:false})
    }
    // Return Dash view from here
    render() {
        console.log("111111111111",this)
        const { classes, theme } = this.props;
        return DashViewRender.call(this);
    }
}


export default withStyles(styles, { withTheme: true })(DashView);

