import React, {Fragment,Component} from 'react';
import PropTypes from 'prop-types';
import ReactStars from 'react-stars';

import { toastrModal } from '/imports/util';
import { ContainerLoader } from '/imports/ui/loading/container.js';

import PrimaryButton from '../buttons/PrimaryButton';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui-icons/Clear';
import TextField from 'material-ui/TextField';
import styled from 'styled-components';

import IconInput from '../form/IconInput.jsx';

import { MuiThemeProvider} from 'material-ui/styles';
import {withStyles} from 'material-ui/styles';

import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';

import Dialog , {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';

const styles = theme => {
  return {
    dialogTitleRoot: {
      padding: `${helpers.rhythmDiv * 3}px ${helpers.rhythmDiv * 3}px 0 ${helpers.rhythmDiv * 3}px`,
      marginBottom: `${helpers.rhythmDiv * 2}px`,
      '@media screen and (max-width : 500px)': {
        padding: `0 ${helpers.rhythmDiv * 3}px`
      }
    },
    dialogContent: {
      padding: `0 ${helpers.rhythmDiv * 3}px`,
      flexShrink: 0,
      '@media screen and (max-width : 500px)': {
        minHeight: '150px'
      }
    },
    dialogActionsRoot: {
      padding: '0 8px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'flex-start'
    },
    dialogActions: {
      width: '100%',
      paddingLeft: `${helpers.rhythmDiv * 2}px`
    },
    dialogRoot: {
      width: '100%'
    },
    iconButton: {
      height: 'auto',
      width: 'auto'
    }
  }
}

const Link = styled.a`
  color:${helpers.textColor};
  &:hover {
    color:${helpers.focalColor};
  }
`;

const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  font-family: ${helpers.specialFont};
  width: 100%;
`;


const ButtonWrapper = styled.div`
  ${helpers.flexCenter}
  margin: ${helpers.rhythmDiv * 4}px 0;
`;

const DialogActionText = styled.p`
  margin: 0;
  margin-right: ${helpers.rhythmDiv}px;
  flex-shrink: 0;
`;

const ActionWrapper = styled.div`
  width: 100%;
  ${helpers.flexCenter}
  justify-content: flex-end;
`;

const InputWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
  display: flex;
  justify-content: ${props => props.stars ? 'center' : 'flex-start'}
`;

const Title = styled.span`
  display: inline-block;
  width: 100%;
  text-align: center;
`;

class GiveReviewDialogBox extends Component {
  state = {
    isBusy: false,
    ratings: 5,
    comment: '',
  }

  handleRatingsChange = (newRating) => {
    this.setState({
      ratings: newRating
    });

    if(this.props.onRatingsChange) {
      this.props.onRatingsChange();
    }
  }

  handleReviewChange = (e) => {
    this.setState({
      comment: e.target.value
    });

    if(this.props.onReviewChange) {
      this.props.onReviewChange();
    }
  }

  handleFormSubmit = (e) => {
    const {toastr} = this.props;
    e.preventDefault();

    const data = {
      reviewForId: this.props.reviewForId,
      reviewFor: this.props.reviewFor,
      ratings: this.state.ratings,
      comment: this.state.comment
    }

    if(Meteor.userId()) {
      this.setState({isBusy: true});

      Meteor.call('reviews.addReview',data,(err,res) => {
        this.setState({isBusy: false}, () => {
            if(err) {
                toastr.error(err.reason || err.message,"Error");
            }
            else if(res) {
              toastr.success('Your review has been added','success');
            }

            if(this.props.onFormSubmit) {
              this.props.onFormSubmit();
            }
        });
      });
    }

    this.props.modalClose();
  }

  componentDidMount = () => {
    Meteor.call('reviews.getMyReview',this.props.reviewForId,(err,data) => {
      console.log(data,"we get back this data..")
      if(data) {
        this.setState({

        })
      }
    })
  }

  render() {
    const {props} = this;
    console.log(props,"...");
    return (
      <Fragment>
        {this.state.isBusy && <ContainerLoader />}
        <Dialog
          fullScreen={props.fullScreen}
          open={props.open}
          onClose={props.onModalClose}
          onRequestClose={props.onModalClose}
          aria-labelledby="contact us"
          classes={{paper: props.classes.dialogRoot}}
        >
        <MuiThemeProvider theme={muiTheme}>
          <DialogTitle classes={{root: props.classes.dialogTitleRoot}}>
            <DialogTitleWrapper>
              <Title>{props.title}</Title>
              <IconButton color="primary" onClick={props.onModalClose} classes={{root: props.classes.iconButton}}>
                <ClearIcon/>
              </IconButton>
            </DialogTitleWrapper>
          </DialogTitle>

          <DialogContent classes={{root : props.classes.dialogContent}}>
            <form onSubmit={this.handleFormSubmit}>
              <InputWrapper stars>
                <ReactStars size={24} count={5} edit half value={this.state.ratings} onChange={this.handleRatingsChange}/>
              </InputWrapper>

              <InputWrapper>
                <IconInput inputId="comment" labelText="Give your review here" multiline={true} value={this.state.comment} onChange={this.handleReviewChange} />
              </InputWrapper>

              <ButtonWrapper>
                <PrimaryButton
                  type="submit"
                  label="Post review"
                  noMarginBottom
                  onClick={this.handleFormSubmit}
                />
              </ButtonWrapper>
            </form>
          </DialogContent>
          </MuiThemeProvider>
        </Dialog>
      </Fragment>
    );
  }
}

GiveReviewDialogBox.propTypes = {
  onFormSubmit: PropTypes.func,
  onRatingsChange: PropTypes.func,
  onReviewChange: PropTypes.func,
  onModalClose: PropTypes.func,
  title: PropTypes.string,
  reviewFor: PropTypes.string,
  reviewForId: PropTypes.string,
}

GiveReviewDialogBox.defaultProps = {
  title: 'Give Review'
}

export default toastrModal(withMobileDialog()(withStyles(styles)(GiveReviewDialogBox)));
