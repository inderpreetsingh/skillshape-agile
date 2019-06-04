import React from 'react';
import DocumentTitle from 'react-document-title';
import styled from 'styled-components';
import { browserHistory } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Card, { CardHeader, CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import IconInput from '/imports/ui/components/landing/components/form/IconInput';

import { ContainerLoader } from '/imports/ui/loading/container';
import { withPopUp } from '/imports/util';

const InputWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const ErrorWrapper = styled.span`
  color: red;
  float: right;
`;

const styles = theme => ({
  card: {
    minWidth: 275,
    maxWidth: 600,
    margin: 'auto',
  },
  actions: {
    justifyContent: 'space-between',
    display: 'flex',
    margin: 15,
  },
});

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorText: '',
      isBusy: false,
    };
  }

  handleTextChange = (inputName, event) => {
    this.setState({ [inputName]: event.target.value, errorText: '' });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { popUp } = this.props;
    const { token } = this.props.routeParams;
    const { password, confirmPassword } = this.state;
    if (password && confirmPassword) {
      if (password === confirmPassword) {
        const stateObj = { ...this.state };
        this.setState({ isBusy: true });
        Accounts.resetPassword(token, password, (err, res) => {
          stateObj.isBusy = false;
          if (err) {
            stateObj.errorText = err.reason || err.message;
          } else {
            popUp.appear('success', { content: 'Your password has been updated!' });
            setTimeout(() => {
              browserHistory.push('/');
            }, 2000);
          }
          this.setState(stateObj);
        });
      } else {
        this.setState({ errorText: 'Password not match!!' });
      }
    } else {
      this.setState({ errorText: 'Enter password' });
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <DocumentTitle title={this.props.route.name}>
        <div>
          <Card className={classes.card}>
            {this.state.isBusy && <ContainerLoader />}
            <form onSubmit={this.onSubmit}>
              <CardHeader title="Change Password" />
              <CardContent>
                <InputWrapper>
                  <IconInput
                    labelText="Password"
                    type="password"
                    iconName="lock_open"
                    value={this.state.password}
                    onChange={this.handleTextChange.bind(this, 'password')}
                  />
                  <IconInput
                    labelText="Repeat Password"
                    type="password"
                    iconName="lock_open"
                    value={this.state.confirmPassword}
                    onChange={this.handleTextChange.bind(this, 'confirmPassword')}
                  />
                </InputWrapper>
              </CardContent>
              <CardActions className={classes.actions}>
                <ErrorWrapper>{this.state.errorText}</ErrorWrapper>
                <Button type="submit" style={{ color: helpers.action }} size="small">
                  Reset Password
                </Button>
              </CardActions>
            </form>
          </Card>
        </div>
      </DocumentTitle>
    );
  }
}

export default withStyles(styles)(withPopUp(ResetPassword));
