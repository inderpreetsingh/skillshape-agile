import React from 'react';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Button from 'material-ui/Button';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import { withStyles } from "material-ui/styles";

const styles = theme => ({
  boxShadow: {
    backgroundColor: '#fff',
    boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    marginTop:'20px'
  },
  paddingProp: {
    padding: theme.spacing.unit * 3
  },
  exactPadding: {
    padding: theme.spacing.unit
  },
  typo: {
    fontSize: 'larger',
    fontWeight: 400,
    margin: '0 0 20px',
    paddingLeft: theme.spacing.unit * 3
  }
});

class AboutUs extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    const { classes } = this.props;
    return(
      <div>
        <Grid container>
          <Grid item xs={12} sm={8}>
            <Paper>
              <div className={classes.paddingProp}>
                <Typography className={classes.typo}>Hi, and welcome to SkillShape!</Typography>
                <br/>
                <Typography className={classes.typo}>Our goal is to make it easier to join communities and gain skills.</Typography>
                <Typography className={classes.typo}>Our philosophy and roadmap is based on years of experience as, and discussions with students and teachers like you, about the needs of students and teachers like you. This means we listen to you and adjust course, until the direction fits your needs. Because SkillShape is designed by listening to you, you will find it very easy to use.</Typography>
                <Typography className={classes.typo}>SkillShape was founded by Dr. Sam Schikowitz, a holistic physician and teacher of movement arts, and it is family owned. We are not a large corporation and have no investors except you, the students and teachers that we work for. This means if you give us ideas about how we could be better, we are small and responsive enough that we can really appreciate your ideas, and might actually listen and implement them!</Typography>
                <Typography className={classes.typo}>We hope you will get involved and help us make something you will love!</Typography>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{padding: '12px'}}>
              <Grid container>
                <Grid item xs={12} sm={12}>
                    <form id="sendfeedback">
                        <Grid container>
                            <Grid item xs={5} sm={6}>
                                <TextField
                                    type="text"
                                    id="name"
                                    required={true}
                                    className=''
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
                                    className=''
                                    name="email"
                                    inputRef={(ref)=> this.email = ref}
                                    placeholder="E-mail"
                                    margin="normal"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={7} sm={6}>
                                <FormControl component="fieldset" required className=''>
                                      <RadioGroup
                                        aria-label="gender"
                                        name="optionsRadios"
                                        className=''
                                        value=''
                                        onChange=''
                                       >
                                        <FormControlLabel value="Feature Request" control={<Radio />} label="Feature Request" />
                                        <FormControlLabel value="Something is broken" control={<Radio />} label="Something is broken" />
                                        <FormControlLabel value="I Love This" control={<Radio />} label="I Love This" />
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
                                  inputRef={(ref)=> this.yourMessage = ref}
                                  placeholder="Your message"
                                  multiline
                                  fullWidth={true}
                                  required={true}
                              />
                            </Grid>
                        </Grid>
                        <Grid container className="resbtn">
                          <Grid item sm={12} xs={12}>
                                <Button
                                    type="submit"
                                    className="btn"
                                    form = "sendfeedback"
                                    raised
                                    color="accent">
                                    Send
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        <Grid container sm={12} md={8} className={classes.boxShadow}>
          <Grid item xs={12} sm={4}>
              <Paper>
                <div className={classes.exactPadding}>
                  <h3 style={{color:'green'}}>Open a Student Account</h3>
                  <Typography className={classes.typo}>Join Schools</Typography>
                  <Typography className={classes.typo}>Track your progress</Typography>
                  <Typography className={classes.typo}>Share milestones and Videos</Typography>
                </div>
              </Paper>
              <Paper>
                <div style={{marginTop:'10px'}} className={classes.exactPadding}>
                  <h3 style={{color:'green'}}>Upload your Local Listing</h3>
                  <Typography className={classes.typo}>Update your Listing</Typography>
                  <Typography className={classes.typo}>Present your expertise</Typography>
                  <Typography className={classes.typo}>Bring in Students</Typography>
                </div>
              </Paper>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Paper>
              <div className={classes.exactPadding}>
                <h3 className="card-title cttb" style={{color:'green'}}>Manage your school</h3>
                <Typography className={`${classes.typo} ${classes.paddingLeft}`}>Manage Your Curriculum</Typography>
                  <Typography className={classes.typo}>* Create clear guidelines and hel students stay excited by seeing where they are going</Typography>
                  <Typography className={classes.typo}>* Monitor Student Exposure,Progress, and Safety</Typography>
                  <Typography className={classes.typo}>* Credit students for attending, evaluate on the fly, track safety issues, and build classes based on what is needed for the students that are present.
                  Stay Connected With Your Students.</Typography>
                  <Typography className={classes.typo}>* Stay connected with Your Students</Typography>
                  <Typography className={classes.typo}>* Provide a way for your student to engage anf connect with your curriculum and community, even when yhey are not in className.</Typography>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(AboutUs);