import React from 'react';
import { browserHistory } from 'react-router';
import Paper from 'material-ui/Paper';
import { withStyles } from "material-ui/styles";
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Button from 'material-ui/Button';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';

const insertPadding = {
  paddingRight: '8px',
  paddingLeft: '8px'
};

const styles = theme => ({
  textColor: {
    color: "#fff"
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
  }

  state = {
    value: '',
  };

  handleChange = (event, value) => {
    console.log("value===>",value);
    this.setState({ value });
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
        console.log("this",this);
        const name = this.name.value;
        const email = this.email.value;
        const message = this.yourMessage.value;
        // const selectedOption = $("input[name=optionsRadios]:checked").val();

        // const emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        // if(!email) {
        //     toastr.error('Please enter your email.','Error');
        //     return false;
        // } else if(!emailReg.test(email)) {
        //     toastr.error("Please enter valid email address","Error");
        //     return false;
        // } else if(!message) {
        //     toastr.error("Please enter a message.","Error");
        //     return false;
        // } else {
        //  Meteor.call('sendfeedbackToAdmin', name, email, message, selectedOption, (error, result) => {
        //      if(error) {
        //          console.log("error", error);
        //      } else {
        //          toastr.success("Thanks for provide your feedback","Success");
        //          setTimeout(() => {
        //              browserHistory.push(`/`);
        //          }, 200);
        //      }
        //  })
        // }
    };

    render() {
        const { classes } = this.props;
        console.log("Props====>",this.props);
        return(
            <Grid container style={{paddingLeft: 8}}>
                <Grid item xs={12}>
                    <Paper elevation={1}>
                        <Paper className={classes.header} elevation={4}>
                            <Typography className={classes.textColor} type="headline" component="h3">Send Us Feedback</Typography>
                        </Paper>
                        <Grid container className={classes.container}>
                            <Grid item xs={12} sm={12} md={7}>
                                <form id="sendfeedback" onSubmit={this.submit} >
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <TextField
                                                type="text"
                                                id="name"
                                                required={true}
                                                className={classes.textField}
                                                name="text"
                                                inputRef={(ref)=> this.name = ref}
                                                placeholder="Name"
                                                margin="normal"
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
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            {/*<div className="radio">
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="optionsRadios"
                                                        className="end_option"
                                                        ref="featureRequested"
                                                        defaultValue="Feature Request"
                                                    />
                                                    <span className="circle" /><span className="check" />
                                                    Feature Request
                                                </label>
                                            </div>
                                            <div className="radio">
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="optionsRadios"
                                                        className="end_option"
                                                        ref="somethingIsBroken"
                                                        defaultValue="Something is broken"
                                                    />
                                                    <span className="circle" /><span className="check" />
                                                    Something is broken
                                                </label>
                                            </div>
                                            <div className="radio">
                                                <label>
                                                    <input type="radio"
                                                           name="optionsRadios"
                                                           className="end_option"
                                                           ref="iLoveThis"
                                                           defaultValue="I Love This!"
                                                    />
                                                    <span className="circle" /><span className="check" />
                                                    I Love This!
                                                </label>
                                            </div>*/}
                                            <FormControl component="fieldset" required className={classes.formControl}>
                                                  <RadioGroup
                                                    aria-label="gender"
                                                    name="gender1"
                                                    className=''
                                                    value={this.state.value}
                                                    onChange={this.handleChange}

                                                  >
                                                    <FormControlLabel value="Feature Request" control={<Radio />} label="Feature Request" />
                                                    <FormControlLabel value="Something is broken" control={<Radio />} label="Something is broken" />
                                                    <FormControlLabel value="I Love This" control={<Radio />} label="I Love This" />
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
                                                color="primary">
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
                                        <a style={insertPadding} href="#" className="fa fa-facebook social_icon"></a>
                                        <a style={insertPadding} href="#" className="fa fa-twitter social_icon  "></a>
                                        <a style={insertPadding} href="#" className="fa fa-google-plus social_icon "></a>
                                        <a style={insertPadding} href="#" className="fa fa-dribbble social_icon  "></a>
                                        <a style={insertPadding} href="#" className="fa fa-instagram social_icon "></a>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(ContactUs);