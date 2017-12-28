import React from 'react';
import { browserHistory } from 'react-router';
import Paper from 'material-ui/Paper';
import { withStyles } from "material-ui/styles";
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';

const insertPadding = {
  paddingRight: '8px',
  paddingLeft: '8px'
};

const styles = theme => ({
  backColor: {
    height:400
  },
  textColor: {
    color: '#ffffff'
  },
  gridProps: {
    padding: 16,
    color: theme.palette.text.secondary
  },
  card: {
    display: 'inline-block',
    position: 'relative',
    width: '100%',
    margin: '25px 0',
    'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.14)',
    'border-radius': 6,
    background: '#fff',
    height: 400
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
    'background-color': '#68B3C8',
    color: '#ffffff'
  }),
});

class ContactUs extends React.Component {

  constructor(props){
    super(props);
  }

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
        const name = this.refs.name.value;
        const email = this.refs.email.value;
        const message = this.refs.yourMessage.value;
        const selectedOption = $("input[name=optionsRadios]:checked").val();

        const emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        if(!email) {
            toastr.error('Please enter your email.','Error');
            return false;
        } else if(!emailReg.test(email)) {
            toastr.error("Please enter valid email address","Error");
            return false;
        } else if(!message) {
            toastr.error("Please enter a message.","Error");
            return false;
        } else {
         Meteor.call('sendfeedbackToAdmin', name, email, message, selectedOption, (error, result) => {
             if(error) {
                 console.log("error", error);
             } else {
                 toastr.success("Thanks for provide your feedback","Success");
                 setTimeout(() => {
                     browserHistory.push(`/`);
                 }, 200);
             }
         })
        }
    };

    render() {
        const { classes } = this.props;
        console.log("Props====>",this.props);
        return(
            <div>
                 <div className="content">
                    <div className={classes.card}>
                        <div className="row">
                            <Grid container spacing={24}>
                                <Grid item xs={12}>
                                    <Paper className={classes.root} elevation={4}>
                                        <Typography className={classes.textColor} type="headline" component="h3">Send Us Feedback</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <div className= {classes.gridProps}>
                                        <form method="post" onSubmit={this.submit} name="contact" noValidate="novalidate">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <TextField
                                                        type="text"
                                                        id="name"
                                                        className="form-control"
                                                        name="text"
                                                        ref="name"
                                                        placeholder="Name"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <TextField
                                                        type="email"
                                                        id="email"
                                                        className="form-control"
                                                        name="email"
                                                        ref="email"
                                                        placeholder="E-mail"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="radio">
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
                                                </div>
                                            </div>
                                            <div className="col-md-12 resbtn">
                                                <div className="form-group">
                                                    <TextField
                                                        className="form-control"
                                                        id="message"
                                                        name="message"
                                                        rows="4"
                                                        ref="yourMessage"
                                                        placeholder="Your message"
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="btn"
                                                    id="sendfeedback">
                                                    Send Message
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <ul className="address-info">
                                        <img src="/images/new-logo.png" className="" alt="logo" width="48" style={{width: 'auto', height: '250px'}} />
                                        <div  className="sl-bar">
                                            <a style={insertPadding} href="#" className="fa fa-facebook social_icon"></a>
                                            <a style={insertPadding} href="#" className="fa fa-twitter social_icon  "></a>
                                            <a style={insertPadding} href="#" className="fa fa-google-plus social_icon "></a>
                                            <a style={insertPadding} href="#" className="fa fa-dribbble social_icon  "></a>
                                            <a style={insertPadding} href="#" className="fa fa-instagram social_icon "></a>
                                        </div>
                                    </ul>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(ContactUs);