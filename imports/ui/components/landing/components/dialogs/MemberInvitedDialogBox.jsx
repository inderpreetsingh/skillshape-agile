import ClearIcon from 'material-ui-icons/Clear';
import Button from 'material-ui/Button';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import PrimaryButton from '../buttons/PrimaryButton';
import * as helpers from '../jss/helpers';
import muiTheme from '../jss/muitheme';

const styles = {
  dialogPaper: {
    padding: `${helpers.rhythmDiv * 2}px`,
  },
  dialogAction: {
    '@media screen and (max-width : 500px)': {
      justifyContent: 'center',
    },
  },
  dialogActionInnerWrapper: {
    textAlign: 'center',
  },
  dialogContent: {
    '@media screen and (max-width : 500px)': {
      minHeight: '150px',
    },
  },
};

const DialogBoxHeaderText = styled.p`
  font-family: ${helpers.commonFont};
  color: ${helpers.textColor};
`;

const ButtonsWrapper = styled.div`
  display: flex;

  @media screen and (max-width: ${helpers.mobile}px) {
    display: flex;
    flex-direction: column-reverse;
    padding-top: ${helpers.rhythmDiv}px;
  }
`;

const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  width: 100%;
`;

const MemberInvitedDialogBox = props => (
  <Dialog
    open={props.open}
    onClose={props.onModalClose}
    onRequestClose={props.onModalClose}
    aria-labelledby="terms-of-service"
    classes={{ paper: props.classes.dialogPaper }}
    itemScope
    itemType="http://schema.org/Service"
  >
    <MuiThemeProvider theme={muiTheme}>
      <DialogTitle>
        <DialogTitleWrapper>
          <span itemProp="name">Terms Of Service</span>

          <IconButton color="primary" onClick={props.onModalClose}>
            <ClearIcon />
          </IconButton>
        </DialogTitleWrapper>
      </DialogTitle>

      <DialogActions classes={{ action: props.classes.dialogActionInnerWrapper }}>
        <DialogBoxHeaderText>
          You have been added a new member in skillshaoe School. By clicking on
          {' '}
          <b>I agree</b>
          {' '}
you
          will become an active member in skillshape School.
        </DialogBoxHeaderText>
      </DialogActions>

      <DialogContent className={props.classes.dialogContent} itemProp="termsOfService">
        <Typography>
          <p>
            These Website Standard Terms And Conditions (these “Terms” or these “Website Standard
            Terms And Conditions”) contained herein on this webpage, shall govern your use of this
            website, including all pages within this website (collectively referred to herein below
            as this “Website”). These Terms apply in full force and effect to your use of this
            Website and by using this Website, you expressly accept all terms and conditions
            contained herein in full. You must not use this Website, if you have any objection to
            any of these Website Standard Terms And Conditions. This Website is not for use by any
            minors (defined as those who are not at least 18 years of age), and you must not use
            this Website if you a minor.
          </p>
          <p>
            In these Website Standard Terms And Conditions, “Your Content” shall mean any audio,
            video, text, images or other material you choose to display on this Website. With
            respect to Your Content, by displaying it, you grant SkillShape a non-exclusive,
            worldwide, irrevocable, royalty-free, sublicensable license to use, reproduce, adapt,
            publish, translate and distribute it in any and all media. Your Content must be your own
            and must not be infringing on any third party’s rights. SkillShape reserves the right to
            remove any of Your Content from this Website at any time, and for any reason, without
            notice..
          </p>

          <p>
            This Website is provided “as is,” with all faults, and SkillShape makes no express or
            implied representations or warranties, of any kind related to this Website or the
            materials contained on this Website. Additionally, nothing contained on this Website
            shall be construed as providing consult or advice to you.
          </p>
        </Typography>
      </DialogContent>

      <DialogActions classes={{ root: props.classes.dialogAction }}>
        <ButtonsWrapper>
          <Button
            color="primary"
            onClick={props.onModalClose}
            itemScope
            itemType="http://schema.org/AgreeAction"
          >
            {' '}
            Cancel
          </Button>
          <Button color="primary" onClick={props.onTermsOfServiceButtonClick}>
            {' '}
            Terms Of Service
          </Button>
          <PrimaryButton
            label="I agree"
            onClick={props.onAgreeButtonClick}
            itemScope
            itemType="http://schema.org/DisagreeAction"
          />
        </ButtonsWrapper>
      </DialogActions>
    </MuiThemeProvider>
  </Dialog>
);

MemberInvitedDialogBox.propTypes = {
  onModalClose: PropTypes.func,
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  onAgreeButtonClick: PropTypes.func,
  onTermsOfServiceButtonClick: PropTypes.func,
};

export default withStyles(styles)(MemberInvitedDialogBox);
