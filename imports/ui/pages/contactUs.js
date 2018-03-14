import React from 'react';
import DocumentTitle from 'react-document-title';
import { browserHistory } from 'react-router';
import Paper from 'material-ui/Paper';
import { withStyles } from "material-ui/styles";
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Button from 'material-ui/Button';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';

import { toastrModal } from '/imports/util';
import { ContainerLoader } from '/imports/ui/loading/container.js';



const styles = theme => ({
  textColor: {
    color: "#fff"
  },
  socialIcon: {
    fontSize: '3em',
    padding: '5px',
    textDecoration: 'none',
    color: theme.palette.primary[500]
  },
  container: {
    padding: 10
  },
  header : {
    padding: "16px 0 16px 10px",
    marginTop: theme.spacing.unit * 3,
    backgroundColor: theme.palette.primary[500]
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
});

class ContactUs extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      optionsRadios:'',
      isLoading:false
    }
  }

  /*Set radio button values into state in order to set `value` attribute for radio button
  Please note that `value` is needed so that user can select radio buttons*/
  handleChange = (event) => {
    this.setState({ optionsRadios: event.target.value });
  };

  componentDidMount() {
    $(".social_icon").hover(function (e) {
      $(this).addClass('animated tada');
    });

    $(".social_icon").bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
      $(this).removeClass('animated tada');
    });
  }

  submit = (event) => {
      event.preventDefault();
      const { toastr } = this.props;
      console.log("this", this);
      const name = this.name.value;
      const email = this.email.value;
      const message = this.yourMessage.value;
      const selectedOption = this.state.optionsRadios;
      const emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
      if (!email) {
          toastr.error('Please enter your email.', 'Error');
          return false;
      } else if (!emailReg.test(email)) {
          toastr.error("Please enter valid email address", "Error");
          return false;
      } else if (!message) {
          toastr.error("Please enter a message.", "Error");
          return false;
      } else {
          // Start loading
          this.setState({ isLoading: true });
          Meteor.call('sendfeedbackToAdmin', name, email, message, selectedOption, (error, result) => {
              if (error) {
                  console.log("error", error);
              } else {
                  toastr.success("Thanks for providing your feedback", "Success");
                  setTimeout(() => {
                      browserHistory.push(`/`);
                  }, 200);
              }
              this.setState({ isLoading: false });
          });
      }
  };

    render() {
        const { classes } = this.props;
        console.log("Props====>",this.props);
        return(
            <DocumentTitle title={this.props.route.name}>
            <Grid container style={{paddingLeft: 8}}>
              {
              this.state.isLoading && <ContainerLoader />
              }
                <Grid item xs={12}>
                    <Paper elevation={1}>
                        <Paper className={classes.header} elevation={4}>
                            <Typography className={classes.textColor} type="headline" component="h3">Send Us Feedback</Typography>
                        </Paper>
                        <Grid container className={classes.container}>
                            <Grid item xs={12} sm={12} md={7}>
                                <form id="sendfeedback" onSubmit={this.submit} >
                                    <Grid container>
                                        <Grid item xs={5}>
                                            <TextField
                                                type="text"
                                                id="name"
                                                required={true}
                                                className={classes.textField}
                                                name="text"
                                                inputRef={(ref)=> this.name = ref}
                                                placeholder="Name"
                                                margin="normal"
                                                fullWidth
                                            />
                                            <TextField
                                                type="email"
                                                id="email"
                                                required={true}
                                                className={classes.textField}
                                                name="email"
                                                inputRef={(ref)=> this.email = ref}
                                                placeholder="E-mail"
                                                margin="normal"
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={7}>
                                            <FormControl component="fieldset" required className={classes.formControl}>
                                                  <RadioGroup
                                                    aria-label="gender"
                                                    name="optionsRadios"
                                                    className=''
                                                    value={this.state.optionsRadios}
                                                    onChange={this.handleChange}
                                                   >
                                                    <FormControlLabel value="Feature Request" control={<Radio />} label="Feature Request" />
                                                    <FormControlLabel value="Something is broken" control={<Radio />} label="Something is broken" />
                                                    <FormControlLabel value="I Love This" control={<Radio />} label="I Love This!" />
                                                  </RadioGroup>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid container className="resbtn">
                                        <Grid item xs={12} className={classes.fullWidth}>
                                                <TextField
                                                    className={classes.textField}
                                                    id="message"
                                                    name="message"
                                                    rows="4"
                                                    inputRef={(ref)=> this.yourMessage = ref}
                                                    placeholder="Your message"
                                                    multiline
                                                    fullWidth={true}
                                                    required={true}
                                                />
                                        </Grid>
                                    </Grid>
                                    <Grid container className="resbtn">
                                        <Grid item xs={12}>
                                            <Button
                                                type="submit"
                                                className="btn"
                                                form = "sendfeedback"
                                                raised
                                                color="accent">
                                                Send Message
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Grid>
                            <Grid item xs={12} sm={12} md={5}>
                                <div className={classes.imageContainer}>
                                    <img src="/images/new-logo.png" className="" alt="logo" width="48" style={{width: 'auto', height: '250px'}} />
                                    <div  className="sl-bar">
                                        <a href="#" className={[`${classes.socialIcon} fa fa-facebook social_icon`]}></a>
                                        <a href="#" className={[`${classes.socialIcon} fa fa-twitter social_icon`]}></a>
                                        <a href="#" className={[`${classes.socialIcon} fa fa-google-plus social_icon`]}></a>
                                        <a href="#" className={[`${classes.socialIcon} fa fa-dribbble social_icon`]}></a>
                                        <a href="#" className={[`${classes.socialIcon} fa fa-instagram social_icon`]}></a>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
          </DocumentTitle>
        )
    }
}

export default withStyles(styles)(toastrModal(ContactUs));