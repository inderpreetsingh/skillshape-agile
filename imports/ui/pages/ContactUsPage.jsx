import ClearIcon from 'material-ui-icons/Clear';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import React, { Component } from 'react';
import styled from 'styled-components';
import ContactUsForm from '/imports/ui/components/landing/components/contactUs/ContactUsForm';
import SocialAccounts from '/imports/ui/components/landing/components/contactUs/SocialAccounts';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import muiTheme from '/imports/ui/components/landing/components/jss/muitheme';
import { logoSrc } from '/imports/ui/components/landing/site-settings';

const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  font-family: ${helpers.specialFont};
  width: 100%;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
`;
const SkillShapeLogo = styled.div`
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: cover;
  width: 100px;
  height: 231px;
  display: flex;
  flex-shrink: 0;
  @media screen and (min-width: ${helpers.mobile - 50}px) {
    width: 100%;
    margin-bottom: ${helpers.rhythmDiv * 2}px;
    flex-shrink: 1;
    ${props => props.addMember && 'height: 100px;'};
`;
const Title = styled.h1`
  font-size: ${helpers.baseFontSize * 3}px;
  font-family: ${helpers.specialFont};
  font-weight: 300;
  font-style: italic;
  text-align: center;
  line-height: 1;
  padding: 0 ${helpers.rhythmDiv * 2}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    font-size: ${helpers.baseFontSize * 2}px;
  }
`;

const FormMapWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-bottom: ${helpers.rhythmDiv * 8}px;
  padding: 0 ${helpers.rhythmDiv * 2}px;

  @media screen and (max-width: ${helpers.tablet + 50}px) {
    flex-direction: column;
    align-items: center;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    padding: 0;
  }
`;

const MapOuterContainer = styled.div`
  max-width: 600px;
  padding: 0 ${helpers.rhythmDiv * 2}px;
  padding-right: 0;
  width: 100%;
  ${helpers.flexCenter}
  flex-direction: column;

  @media screen and (max-width: ${helpers.tablet + 50}px) {
    padding: 0;
  }

  @media screen and (max-width: ${helpers.mobile + 50}) {
    min-width: 0;
  }
`;

const MapContainer = styled.div`
  max-width: 500px;
  width: 100%;

  @media screen and (max-width: ${helpers.tablet + 50}px) {
    max-width: 100%;
  }
`;

const ContentWrapper = styled.div``;

const MyMap = styled.div`
  width: 100%;
  height: 100%;
`;
const styles = theme => ({
  dialogTitleRoot: {
    padding: `${helpers.rhythmDiv * 3}px ${helpers.rhythmDiv * 3}px 0 ${helpers.rhythmDiv * 3}px`,
    marginBottom: `${helpers.rhythmDiv * 2}px`,
    '@media screen and (max-width : 500px)': {
      padding: `0 ${helpers.rhythmDiv * 3}px`,
    },
  },
  dialogContent: {
    padding: `0 ${helpers.rhythmDiv * 3}px`,
    paddingBottom: helpers.rhythmDiv * 2,
    flexGrow: 0,
    display: 'flex',
    justifyContent: 'center',
    minHeight: 200,
    [`@media screen and (max-width : ${helpers.mobile}px)`]: {
      padding: `0 ${helpers.rhythmDiv * 2}px`,
    },
  },
  dialogRoot: {
    width: '100%',
    maxWidth: 'fit-content',
    [`@media screen and (max-width : ${helpers.mobile}px)`]: {
      margin: helpers.rhythmDiv,
    },
  },
  iconButton: {
    height: 'auto',
    width: 'auto',
  },
});
class ContactUs extends Component {
  state = {};

  componentDidMount = () => {};

  componentDidUpdate = () => {};

  render() {
    const { props } = this;
    return (
      <Dialog
        open={props.open}
        onClose={props.onModalClose}
        onRequestClose={props.onModalClose}
        aria-labelledby="Contact Us"
        classes={{ paper: props.classes.dialogRoot }}
      >
        <MuiThemeProvider theme={muiTheme}>
          <DialogTitle classes={{ root: props.classes.dialogTitleRoot }}>
            <DialogTitleWrapper>
              <Title>We would love to talk with you</Title>
              <IconButton
                color="primary"
                onClick={props.onModalClose}
                classes={{ root: props.classes.iconButton }}
              >
                <ClearIcon />
              </IconButton>
            </DialogTitleWrapper>
          </DialogTitle>
          <DialogContent classes={{ root: props.classes.dialogContent }}>
            <Wrapper>
              {/* Content section including form and map and social accounts */}
              <ContentWrapper>
                <FormMapWrapper>
                  <ContactUsForm onModalClose={props.onModalClose} />
                  <MapOuterContainer>
                    <MapContainer>
                      <SkillShapeLogo src={logoSrc} />
                    </MapContainer>
                    <SocialAccounts />
                  </MapOuterContainer>
                </FormMapWrapper>
              </ContentWrapper>
            </Wrapper>
          </DialogContent>

          <DialogActions classes={{ root: props.classes.dialogActionsRoot }} />
        </MuiThemeProvider>
      </Dialog>
    );
  }
}
export default withStyles(styles)(ContactUs);
