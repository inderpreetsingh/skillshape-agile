import get from 'lodash/get';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Card, { CardContent } from 'material-ui/Card';
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel';
import { FormControl, FormControlLabel } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import DocumentTitle from 'react-document-title';
import MediaContent from './MediaContent';
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton';
import Preloader from '/imports/ui/components/landing/components/Preloader';
import { ContainerLoader } from '/imports/ui/loading/container';
import { toastrModal, withStyles } from '/imports/util';

const style = theme => ({
  card: {
    margin: 5,
  },
});

class MyMedia extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initializeState();
  }

  componentWillReceiveProps(nextProps) {
    const mediaAccessType = get(nextProps, 'currentUser.media_access_permission');
    if (mediaAccessType) {
      this.setState({
        mediaDefaultValue: mediaAccessType,
      });
    }
  }

  initializeState = () => {
    const state = {
      mediaExpanded: true,
      isBusy: false,
      mediaDefaultValue: get(this.props, 'currentUser.media_access_permission') || '',
    };
    return state;
  };

  handleExpandClick = (field) => {
    this.setState({ [field]: !this.state[field] });
  };

  validateUser = () => {
    const { currentUser } = this.props;
    const paramId = get(this.props, 'params.id', null);
    if (currentUser && currentUser._id === paramId) {
      return true;
    }
    return false;
  };

  handleMediaSettingChange = (event, type) => {
    this.setState({ mediaDefaultValue: type });
  };

  submitMediaDetails = (event) => {
    event.preventDefault();
    const { currentUser, toastr } = this.props;
    if (currentUser) {
      if (this.state.mediaDefaultValue) {
        this.setState({ isBusy: true });
        const userObj = {
          media_access_permission: this.state.mediaDefaultValue,
        };
        Meteor.call('user.editUser', { doc: userObj, docId: currentUser._id }, (error, result) => {
          const state = { isBusy: false };
          if (error) {
            state.errorText = error.reason || error.message;
            toastr.error(state.errorText, 'Error');
          }
          if (result) {
            toastr.success('Successfully edit your media settings.', 'Success');
          }
          this.setState(state);
        });
      }
    } else {
      toastr.error('Access Denied!!!', 'Error');
    }
  };

  render() {
    const { currentUser, classes, isUserSubsReady } = this.props;

    if (!isUserSubsReady) {
      return <Preloader />;
    }

    if (!currentUser) {
      return (
        <Typography type="display2" gutterBottom align="center">
          User not found!!!
        </Typography>
      );
    }

    if (this.validateUser()) {
      return (
        <DocumentTitle title={this.props.route.name}>
          <Grid container>
            {this.state.isBusy && <ContainerLoader />}
            <Grid item xs={12} sm={12}>
              <ExpansionPanel defaultExpanded style={{ margin: '3px' }}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <div>
                    <Typography type="headline">Media Settings</Typography>
                  </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <div>
                    <Typography type="headline">Media Display Setting Defaults</Typography>
                    <Typography type="subheading">
                      These defaults can be set differently for specific media of you.
                    </Typography>
                    <Typography type="subheading">
                      Unless progress or a video is public, it cannot be shared to Social Media.
                    </Typography>
                    <br />
                    <Typography type="subheading">
                      As a default setting for videos and pictures for you:
                    </Typography>
                    <br />
                    <form onSubmit={this.submitMediaDetails}>
                      <FormControl component="fieldset" required>
                        <RadioGroup
                          aria-label="mediaSetting"
                          value={this.state.mediaDefaultValue}
                          name="mediaSetting"
                          onChange={this.handleMediaSettingChange}
                          defaultSelected="both"
                        >
                          <FormControlLabel
                            value="public"
                            control={<Radio />}
                            label="Make media public so you can share them on social media."
                          />
                          <FormControlLabel
                            value="member"
                            control={<Radio />}
                            label="Make media from a school only available to members of the school that posted it."
                          />
                        </RadioGroup>
                      </FormControl>
                      <br />
                      {/* <Button type="submit" color="accent" raised dense>
                                        Save
									</Button> */}
                      <FormGhostButton type="submit" label="Save" />
                    </form>
                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <Card className={classes.card}>
                <CardContent>
                  <MediaContent currentUser={currentUser} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DocumentTitle>
      );
    }
    return (
      <Typography type="display2" gutterBottom align="center">
        Access Denied!!!
      </Typography>
    );
  }
}

MyMedia.propTypes = {
  currentUser: PropTypes.object,
  classes: PropTypes.object,
  isUserSubsReady: PropTypes.bool,
};

export default withStyles(style)(toastrModal(MyMedia));
