import React, { Component } from "react";
import { browserHistory } from "react-router";
import PropTypes from "prop-types";
import styled from "styled-components";
import IconButton from "material-ui/IconButton";
import ClearIcon from "material-ui-icons/Clear";
import { withStyles } from "material-ui/styles";
// import { withPopUp } from "/imports/util";

import { MuiThemeProvider } from "material-ui/styles";
import { Text } from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";
import Student from "/imports/ui/components/landing/components/icons/Student.jsx";
import School from "/imports/ui/components/landing/components/icons/School.jsx";

import Dialog, {
  DialogContent,
  DialogActions,
  DialogTitle,
  withMobileDialog
} from "material-ui/Dialog";

import muiTheme from "/imports/ui/components/landing/components/jss/muitheme.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

const styles = theme => {
  return {
    dialogTitleRoot: {
      padding: `${helpers.rhythmDiv * 3}px ${helpers.rhythmDiv *
        3}px 0 ${helpers.rhythmDiv * 3}px`,
      marginBottom: `${helpers.rhythmDiv * 2}px`
    },
    dialogContent: {
      padding: `0 ${helpers.rhythmDiv * 3}px`,
      paddingBottom: helpers.rhythmDiv,
      display: "block",
      overflowY: "visible"
    },
    dialogActionsRoot: {
      padding: `0 ${helpers.rhythmDiv}px`,
      paddingBottom: helpers.rhythmDiv * 3,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: 0,
      [`@media screen and (max-width: ${helpers.mobile + 100}px)`]: {
        paddingBottom: helpers.rhythmDiv
      }
    },
    dialogActions: {
      width: "100%",
      paddingLeft: `${helpers.rhythmDiv * 2}px`
    },
    dialogRoot: {
      width: "100%"
    },
    iconButton: {
      height: "auto",
      width: "auto"
    }
  };
};

const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  font-family: ${helpers.specialFont};
  width: 100%;
`;

const ContentWrapper = styled.div``;

const ButtonsWrapper = styled.div`
  ${helpers.flexCenter}

  @media screen and (max-width: ${helpers.mobile}px) {
    flex-direction: column;
  }
`;

const ButtonWrapper = styled.div`
  /* prettier-ignore */
  ${helpers.flexCenter}
`;

const Title = styled.span`
  display: inline-block;
  width: 100%;
  text-align: center;
`;

const CardsWrapper = styled.div`
  width: 100%;
  ${helpers.flexHorizontalSpaceBetween};

  @media screen and (max-width: ${helpers.mobile + 100}px) {
    flex-direction: column;
    justify-content: center;
  }
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 250px;
  width: 100%;
  height: 200px;
  cursor: pointer;
  box-shadow: ${helpers.heavyBoxShadow};
  margin-right: ${helpers.rhythmDiv * 2}px;

  :last-of-type {
    margin-right: 0;
  }

  @media screen and (max-width: ${helpers.mobile + 100}px) {
    margin-right: 0;
    margin-bottom: ${helpers.rhythmDiv * 2}px;

    :first-of-type {
      margin-top: ${helpers.rhythmDiv}px;
    }
  }
`;

const IconWrapper = styled.div`
  width: 80%;
  height: 120px;
`;

const CardFooter = styled.div`
  ${helpers.flexCenter} background: white;
  flex-direction: column;
  flex-grow: 1;
  font-family: ${helpers.specialFont};
`;
const CardBody = styled.div`
  padding-top: ${helpers.rhythmDiv}px;
`;

const CardContent = Text.extend`
  font-size: 18px;
  margin-bottom: 0;
`;

const OptionCard = props => (
  <CardWrapper onClick={props.onClick}>
    <CardBody>
      <IconWrapper>{React.cloneElement(props.icon)}</IconWrapper>
    </CardBody>
    <CardFooter>
      <CardContent>{props.message}</CardContent>
    </CardFooter>
  </CardWrapper>
);

class FirstTimeVisitDialogBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true
    };
  }
  _redirectTo = path => {
    browserHistory.push(path);
  };

  _closeModal = () => {
    this.setState({
      open: false
    });
  };

  handleModalClose = () => {
    this._closeModal();
    // const { popUp } = this.props;
    // if (!localStorage.getItem("userRoleValue")) {
    //   console.log("not item in the user Role Value");
    //   popUp.appear("alert", {
    //     title: "Need Input",
    //     content: "kindly give us your feedback, for future preferences"
    //   });
    // } else {
    //   this._closeModal();
    // }
  };

  handleIamStudentClick = () => {
    localStorage.setItem("visitorRedirected", false);
    localStorage.setItem("visitorType", "student");
    this._closeModal();
    setTimeout(() => {
      this._redirectTo("/");
    }, 100);
  };

  handleIamSchoolClick = () => {
    localStorage.setItem("visitorRedirected", false);
    localStorage.setItem("visitorType", "school");
    this._closeModal();
    setTimeout(() => {
      this._redirectTo("/claimSchool");
    }, 100);
  };

  render() {
    const { props } = this;
    const { open } = this.state;
    // console.log(props,"...");
    return (
      <Dialog
        open={open}
        onClose={this.handleModalClose}
        onRequestClose={this.handleModalClose}
        aria-labelledby="user role"
        classes={{ paper: props.classes.dialogRoot }}
      >
        <MuiThemeProvider theme={muiTheme}>
          <DialogTitle classes={{ root: props.classes.dialogTitleRoot }}>
            <DialogTitleWrapper>
              <Title>Let us know!</Title>
              <IconButton
                color="primary"
                onClick={this.handleModalClose}
                classes={{ root: props.classes.iconButton }}
              >
                <ClearIcon />
              </IconButton>
            </DialogTitleWrapper>
          </DialogTitle>

          <DialogContent classes={{ root: props.classes.dialogContent }}>
            <Text>
              You need to select any one option from below, will allow to serve
              you in a better way.
            </Text>
          </DialogContent>

          <DialogActions classes={{ root: props.classes.dialogActionsRoot }}>
            <CardsWrapper>
              <OptionCard
                onClick={this.handleIamStudentClick}
                message="I am here to learn"
                icon={<Student />}
              />

              <OptionCard
                onClick={this.handleIamSchoolClick}
                message="I am here to teach"
                icon={<School />}
              />
            </CardsWrapper>
          </DialogActions>
        </MuiThemeProvider>
      </Dialog>
    );
  }
}

export default withStyles(styles)(FirstTimeVisitDialogBox);
