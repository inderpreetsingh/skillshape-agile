import React from 'react';
import DocumentTitle from 'react-document-title';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import { FormControl, FormControlLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import { browserHistory } from 'react-router';
import Card, { CardContent } from 'material-ui/Card';

import { toastrModal } from '/imports/util';
import { ContainerLoader } from '/imports/ui/loading/container';

const styles = theme => ({
  boxShadow: {
    maxWidth: '1196px !important',
    margin: 'auto !important',
    width: 'auto !important',
  },
  paddingProp: {
    padding: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 4,
  },
  exactPadding: {
    padding: theme.spacing.unit,
  },
  typo: {
    fontWeight: 400,
    margin: '0 0 20px',
    listStyle: 'disc',
  },
  aboutUsContainer: {
    maxWidth: '1196px !important',
    margin: 'auto !important',
    width: 'auto !important',
  },
  contactUsText: {
    fontWeight: '400',
    fontSize: '1.0rem',
  },
  headingStyle: {
    color: 'green',
    paddingLeft: '22px',
  },
});

class AboutUs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      optionsRadios: '',
      isLoading: false,
    };
  }

  /* Set radio button values into state in order to set `value` attribute for radio button
  Please note that `value` is needed so that user can select radio buttons */
  handleChange = (event) => {
    this.setState({ optionsRadios: event.target.value });
  };

  // Send feedback to admin
  submit = (event) => {
    event.preventDefault();
    const { toastr } = this.props;
    const name = this.name.value;
    const email = this.email.value;
    const message = this.yourMessage.value;
    const selectedOption = this.state.optionsRadios;
    const emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (!email) {
      toastr.error('Please enter your email.', 'Error');
      event.stopPropagation();
    } else if (!emailReg.test(email)) {
      toastr.error('Please enter valid email address', 'Error');
      event.stopPropagation();
    } else if (!message) {
      toastr.error('Please enter a message.', 'Error');
      event.stopPropagation();
    } else {
      // Start loading
      this.setState({ isLoading: true });
      Meteor.call('sendfeedbackToAdmin', name, email, message, selectedOption, (error, result) => {
        if (!error) {
          toastr.success('Thanks for providing your feedback', 'Success');
          setTimeout(() => {
            browserHistory.push('/');
          }, 200);
        }
        this.setState({ isLoading: false });
      });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <DocumentTitle title={this.props.route.name}>
        <div>
          <Grid container className={classes.aboutUsContainer}>
            {this.state.isLoading && <ContainerLoader />}
            <Grid item xs={12} sm={7}>
              <Paper>
                <div className={classes.paddingProp}>
                  <Typography className={classes.typo}>Hi, and welcome to SkillShape!</Typography>
                  <br />
                  <Typography className={classes.typo}>
                    Our goal is to make it easier to join communities and gain skills.
                  </Typography>
                  <Typography className={classes.typo}>
                    Our philosophy and roadmap is based on years of experience as, and discussions
                    with students and teachers like you, about the needs of students and teachers
                    like you. This means we listen to you and adjust course, until the direction
                    fits your needs. Because SkillShape is designed by listening to you, you will
                    find it very easy to use.
                  </Typography>
                  <Typography className={classes.typo}>
                    SkillShape was founded by Dr. Sam Schikowitz, a holistic physician and teacher
                    of movement arts, and it is family owned. We are not a large corporation and
                    have no investors except you, the students and teachers that we work for. This
                    means if you give us ideas about how we could be better, we are small and
                    responsive enough that we can really appreciate your ideas, and might actually
                    listen and implement them!
                  </Typography>
                  <Typography className={classes.typo}>
                    We hope you will get involved and help us make something you will love!
                  </Typography>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={5}>
              <Card style={{ padding: '16px', height: '100%' }}>
                <CardContent style={{ paddingLeft: 0 }}>
                  <Typography className={classes.contactUsText}>
                    Please contact us about any questions, concerns or feedback!
                  </Typography>
                </CardContent>
                <Grid container>
                  <Grid item xs={12} sm={12}>
                    <form id="sendfeedback" onSubmit={this.submit}>
                      <Grid container>
                        <Grid item xs={5} sm={6}>
                          <TextField
                            type="text"
                            id="name"
                            required
                            className=""
                            name="text"
                            inputRef={ref => (this.name = ref)}
                            placeholder="Name"
                            margin="normal"
                            fullWidth
                          />
                          <TextField
                            type="email"
                            id="email"
                            required
                            className=""
                            name="email"
                            inputRef={ref => (this.email = ref)}
                            placeholder="E-mail"
                            margin="normal"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={7} sm={6}>
                          <FormControl component="fieldset" required className="">
                            <RadioGroup
                              aria-label="gender"
                              name="optionsRadios"
                              className=""
                              value={this.state.optionsRadios}
                              onChange={this.handleChange}
                            >
                              <FormControlLabel
                                value="Feature Request"
                                control={<Radio />}
                                label="Feature Request"
                              />
                              <FormControlLabel
                                value="Something is broken"
                                control={<Radio />}
                                label="Something is broken"
                              />
                              <FormControlLabel
                                value="I Love This"
                                control={<Radio />}
                                label="I Love This"
                              />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid item xs={12} sm={8}>
                          <TextField
                            id="message"
                            name="message"
                            rows="4"
                            inputRef={ref => (this.yourMessage = ref)}
                            placeholder="Your message"
                            multiline
                            fullWidth
                            required
                          />
                        </Grid>
                      </Grid>
                      <Grid container className="resbtn" style={{ marginTop: '12px' }}>
                        <Grid item sm={12} xs={12}>
                          <Button
                            type="submit"
                            className="btn"
                            form="sendfeedback"
                            raised
                            color="accent"
                            style={{ boxShadow: 'none' }}
                          >
                            Send
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
          <Grid container sm={12} md={8} className={classes.boxShadow}>
            <Grid item xs={12} sm={4}>
              <Paper>
                <div className={classes.exactPadding}>
                  <h3 className={classes.headingStyle}>Open a Student Account</h3>
                  <ul>
                    <li className={classes.typo}>
                      <Typography> Join Schools</Typography>
                    </li>
                    <li className={classes.typo}>
                      {' '}
                      <Typography>Track your progress</Typography>
                    </li>
                    <li className={classes.typo}>
                      {' '}
                      <Typography>Share milestones and Videos</Typography>
                    </li>
                  </ul>
                </div>
              </Paper>
              <Paper>
                <div style={{ marginTop: '10px' }} className={classes.exactPadding}>
                  <h3 className={classes.headingStyle}>Upload your Local Listing</h3>
                  <ul>
                    <li className={classes.typo}>
                      {' '}
                      <Typography>Update your Listing</Typography>
                    </li>
                    <li className={classes.typo}>
                      {' '}
                      <Typography>Present your expertise</Typography>
                    </li>
                    <li className={classes.typo}>
                      {' '}
                      <Typography>Bring in Students</Typography>
                    </li>
                  </ul>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Paper style={{ height: '100%' }}>
                <div className={classes.exactPadding}>
                  <h3 className={classes.headingStyle}>Manage your school</h3>
                  <ul>
                    <li className={`${classes.typo} ${classes.paddingLeft}`}>
                      <Typography>Manage Your Curriculum</Typography>
                    </li>
                    <li className={classes.typo}>
                      {' '}
                      <Typography>
                        Create clear guidelines and hel students stay excited by seeing where they
                        are going
                      </Typography>
                    </li>
                    <li className={classes.typo}>
                      {' '}
                      <Typography>Monitor Student Exposure,Progress, and Safety</Typography>
                    </li>
                    <li className={classes.typo}>
                      {' '}
                      <Typography>
                        Credit students for attending, evaluate on the fly, track safety issues, and
                        build classes based on what is needed for the students that are present.
                        Stay Connected With Your Students.
                      </Typography>
                    </li>
                    <li className={classes.typo}>
                      {' '}
                      <Typography>Stay connected with Your Students</Typography>
                    </li>
                    <li className={classes.typo}>
                      {' '}
                      <Typography>
                        Provide a way for your student to engage anf connect with your curriculum
                        and community, even when they are not in class.
                      </Typography>
                    </li>
                  </ul>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </DocumentTitle>
    );
  }
}

export default withStyles(styles)(toastrModal(AboutUs));
