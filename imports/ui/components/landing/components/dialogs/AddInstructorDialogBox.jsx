import React, { Component } from "react";
import { browserHistory } from "react-router";
import PropTypes from "prop-types";
import styled from "styled-components";
import IconButton from "material-ui/IconButton";
import ClearIcon from "material-ui-icons/Clear";
import { withStyles } from "material-ui/styles";
import { withPopUp } from "/imports/util";

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
      marginBottom: `${helpers.rhythmDiv * 2}px`,
      "@media screen and (max-width : 500px)": {
        padding: `0 ${helpers.rhythmDiv * 3}px`
      }
    },
    dialogContent: {
      padding: `0 ${helpers.rhythmDiv * 3}px`,
      paddingBottom: helpers.rhythmDiv * 2,
      flexGrow: 0,
      display: "flex",
      justifyContent: "center",
      "@media screen and (max-width : 500px)": {
        // minHeight: "150px"
      }
    },
    dialogActionsRoot: {
      padding: `0 ${helpers.rhythmDiv}px`,
      paddingBottom: helpers.rhythmDiv * 2,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
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
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px;
  height: 200px;
  cursor: pointer;
  box-shadow: ${helpers.heavyBoxShadow};
  margin-right: ${helpers.rhythmDiv * 2}px;
`;

const IconWrapper = styled.div`
  width: 100%;
  height: 160px;
`;

const CardFooter = styled.div`
  ${helpers.flexCenter} background: white;
  flex-direction: column;
  flex-grow: 1;
  font-family: ${helpers.specialFont};
`;

const OptionCard = props => (
  <CardWrapper onClick={props.onClick}>
    <IconWrapper>{React.cloneElement(props.icon)}</IconWrapper>
    <CardFooter>
      <Text>{props.message}</Text>
    </CardFooter>
  </CardWrapper>
);

class AddInstructorDialogBox extends Component {
  constructor(props) {
    super(props);
  }

  onSubmit = () => {};

  render() {
    const { props } = this;
    return (
      <Dialog
        open={props.open}
        onClose={props.onModalClose}
        onRequestClose={props.onModalClose}
        aria-labelledby="add instructor"
        classes={{ paper: props.classes.dialogRoot }}
      >
        <MuiThemeProvider theme={muiTheme}>
          <DialogTitle classes={{ root: props.classes.dialogTitleRoot }}>
            <DialogTitleWrapper>
              <Title>Add Instructor</Title>
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
            <Text>Add the instructor to your </Text>
          </DialogContent>

          <DialogActions classes={{ root: props.classes.dialogActionsRoot }}>
            <CardsWrapper>
              <OptionCard
                onClick={this.handleStudentButtonClick}
                message={"I am here to learn"}
                icon={<Student />}
              />

              <OptionCard
                onClick={this.handleSchoolButtonClick}
                message={"I am here to teach"}
                icon={<School />}
              />
            </CardsWrapper>
          </DialogActions>
        </MuiThemeProvider>
      </Dialog>
    );
  }
}

AddInstructorDialogBox.propTypes = {
  onSchoolButtonClick: PropTypes.func,
  onStudentButtonClick: PropTypes.func,
  onModalClose: PropTypes.func,
  loading: PropTypes.bool
};

export default withStyles(styles)(withPopUp(AddInstructorDialogBox));
