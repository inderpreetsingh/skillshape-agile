import Grid from 'material-ui/Grid';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ProgressiveImage from 'react-progressive-image';
import { Link } from 'react-router';
import styled from 'styled-components';
import PrimaryButton from '/imports/ui/components/landing/components/buttons/PrimaryButton';
import CallUsDialogBox from '/imports/ui/components/landing/components/dialogs/CallUsDialogBox';
import EmailUsDialogBox from '/imports/ui/components/landing/components/dialogs/EmailUsDialogBox';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import { cardImgSrc } from '/imports/ui/components/landing/site-settings';
import { ContainerLoader } from '/imports/ui/loading/container';
import {
  confirmationDialog, handleOutBoundLink, verifyImageURL, withPopUp,
} from '/imports/util';

const styles = {
  cardWrapper: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    cursor: 'pointer',
    minHeight: 450,
  },
  cardIcon: {
    cursor: 'pointer',
  },
  marginAuto: {
    margin: 'auto',
  },
  actionButton: {
    fontSize: helpers.baseFontSize * 2,
    lineHeight: 1,
    height: helpers.rhythmDiv * 4,
    width: helpers.rhythmDiv * 4,
    color: helpers.darkBgColor,
    marginBottom: helpers.rhythmDiv,
    transition: '0.1s color linear',
    '&:hover': {
      color: helpers.primaryColor,
    },
  },
  actionButtonIcon: {
    fontSize: helpers.baseFontSize * 2,
    height: helpers.rhythmDiv * 4,
    width: helpers.rhythmDiv * 4,
    fontWeight: 100,
  },
};

const MyLink = styled(Link)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const CardImageContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 420px;
`;

const CardImageWrapper = styled.div`
  max-height: 300px;
  flex-grow: 1;
  width: 100%;
  transition: background-image 1s linear !important;
  background-position: 50% 50%;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url('${props => props.bgImage}');
`;

const CardContent = styled.div``;

const CardContentHeader = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-shrink: 0;
`;

const CardContentTitle = styled.h2`
  font-size: ${helpers.baseFontSize * 1.5}px;
  font-weight: 300;
  font-family: ${helpers.specialFont};
  margin: 0;
  text-transform: capitalize;
  text-align: center;
  line-height: 1;
  padding: ${helpers.rhythmDiv * 2}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    font-size: ${helpers.baseFontSize}px;
  }

  @media screen and (max-width: ${helpers.tablet}px) {
    font-size: ${helpers.baseFontSize * 1.2}px;
  }
`;

const CardContentBody = styled.div``;

const ActionButtonsWrapper = styled.div`
  ${helpers.flexCenter} justify-content: space-evenly;
  background: ${helpers.panelColor};
  padding: ${helpers.rhythmDiv * 2}px;
  color: ${helpers.darkBgColor};
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const ActionBtnWrapper = styled.div`
  ${helpers.flexCenter} flex-direction: column;
`;

const ActionBtnText = styled.p`
  font-family: ${helpers.commonFont};
  font-size: ${helpers.baseFontSize}px;
  font-weight: 500;
  margin: 0;
`;

const MyAnchor = ActionBtnText.withComponent('a').extend`
  color: ${helpers.darkBgColor};

  &:visited , &:active {
    color: ${helpers.darkBgColor};
  }
`;

const ActionButton = props => (
  <ActionBtnWrapper onClick={props.onClick}>
    <IconButton className={props.classes.actionButton}>
      <Icon className={props.classes.actionButtonIcon}>{props.iconName}</Icon>
    </IconButton>
    <ActionBtnText>{props.text}</ActionBtnText>
  </ActionBtnWrapper>
);

class SchoolCard extends Component {
  state = {
    imageContainerHeight: '250px',
    revealCard: false,
    isLoading: false,
  };

  componentWillMount() {
    const { schoolCardData } = this.props;
    const pic = schoolCardData && schoolCardData.mainImageMedium
      ? schoolCardData.mainImageMedium
      : schoolCardData && schoolCardData.mainImage
        ? schoolCardData.mainImage
        : cardImgSrc;
    verifyImageURL(pic, (res) => {
      if (res) {
        this.setState({ bgImg: pic });
      } else {
        this.setState({ bgImg: cardImgSrc });
      }
    });
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    // You can also log the error to an error reporting service
    // console.info("The error is this...", error, info);
  }

  getContactNumbers = () => this.props.schoolCardData.phone && this.props.schoolCardData.phone.split(/[\|\,\\]/);

  getOurEmail = () => this.props.schoolCardData.email;

  handleEmailUsButtonClick = () => {
    this.handleDialogState('emailUsDialog', true);
  };

  handleCallUsButtonClick = () => {
    this.handleDialogState('callUsDialog', true);
  };

  handleDialogState = (dialogName, state) => {
    const newState = { ...this.state };
    newState[dialogName] = state;
    this.setState(newState);
  };

  showConfirmationModal = () => {
    const user = Meteor.user();
    const { popUp, handleClaimASchool, schoolCardData } = this.props;
    if (!user) {
      popUp.appear('error', {
        content: 'You must be signed in to claim a school. [Sign In] or [Sign Up]',
      });
    } else {
      const data = {
        popUp,
        title: 'Confirm',
        type: 'inform',
        content: 'Do you really want to claim this school ?',
        buttons: [
          { label: 'No', onClick: () => {}, greyColor: true },
          {
            label: 'Yes',
            onClick: () => {
              handleClaimASchool(schoolCardData);
            },
          },
        ],
      };
      confirmationDialog(data);
    }
  };

  render() {
    const { classes, schoolCardData } = this.props;
    const name = schoolCardData.name.toLowerCase();
    const ourEmail = this.getOurEmail();
    const { bgImg } = this.state;
    return (
      <Paper className={classes.cardWrapper} itemScope itemType="http://schema.org/Service">
        {this.state.isLoading && <ContainerLoader />}
        {this.state.callUsDialog && (
          <CallUsDialogBox
            contactNumbers={this.getContactNumbers()}
            open={this.state.callUsDialog}
            onModalClose={() => this.handleDialogState('callUsDialog', false)}
          />
        )}
        {this.state.emailUsDialog && (
          <EmailUsDialogBox
            schoolData={schoolCardData}
            ourEmail={ourEmail}
            open={this.state.emailUsDialog}
            onModalClose={() => this.handleDialogState('emailUsDialog', false)}
          />
        )}
        <div>
          <CardImageContentWrapper>
            <MyLink to={`/schools/${schoolCardData.slug}`} target="_blank">
              {' '}
              <ProgressiveImage src={bgImg} placeholder={config.blurImage}>
                {src => <CardImageWrapper bgImage={src} />}
              </ProgressiveImage>
              {' '}
            </MyLink>

            <CardContentHeader>
              <CardContentTitle itemProp="name">{name}</CardContentTitle>
              <CardContentBody>
                <ActionButtonsWrapper>
                  <ActionButton
                    classes={classes}
                    iconName="phone"
                    text="Call us"
                    onClick={this.handleCallUsButtonClick}
                  />
                  {ourEmail && (
                    <ActionButton
                      classes={classes}
                      iconName="mail_outline"
                      text="Email us"
                      onClick={this.handleEmailUsButtonClick}
                    />
                  )}
                  <MyAnchor href={schoolCardData.website} target="_blank">
                    <ActionButton
                      classes={classes}
                      iconName="present_to_all"
                      text="Website"
                      onClick={handleOutBoundLink}
                    />
                  </MyAnchor>
                  {/*
                  {schoolCardData.email && (<Typography><b>Email: </b>{schoolCardData.email}</Typography>)}
                  <Typography><b>Phone: </b>{schoolCardData.phone}</Typography> */}
                </ActionButtonsWrapper>
              </CardContentBody>
            </CardContentHeader>
          </CardImageContentWrapper>
          <CardContent>
            <Grid container>
              <Grid item xs={6} sm={6} className={classes.marginAuto}>
                {<PrimaryButton fullWidth label="Claim" onClick={this.showConfirmationModal} />}
              </Grid>
            </Grid>
          </CardContent>
        </div>
      </Paper>
    );
  }
}

SchoolCard.propTypes = {
  schoolCardData: PropTypes.object.isRequired,
  height: PropTypes.number,
};

SchoolCard.defaultProps = {
  classTypeImg: cardImgSrc,
};

export default withStyles(styles)(withPopUp(SchoolCard));
