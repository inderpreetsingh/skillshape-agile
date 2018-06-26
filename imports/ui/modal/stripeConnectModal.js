import React, { Fragment } from "react";
import moment from "moment";
import styled from "styled-components";
import { formStyles } from "/imports/util";
// import { blue500 } from 'material-ui/styles/colors';

import Dialog, { DialogActions, withMobileDialog } from "material-ui/Dialog";

import Icon from "material-ui/Icon";
import Card, { CardActions, CardContent, CardMedia } from "material-ui/Card";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import Grid from "material-ui/Grid";
import { withStyles } from "material-ui/styles";

import { ContainerLoader } from "/imports/ui/loading/container";
import { browserHistory, Link } from "react-router";
import ClassType from "/imports/api/classType/fields";
import ClassTimes from "/imports/api/classTimes/fields";
import SLocation from "/imports/api/sLocation/fields";

import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";
import {
  flexCenter,
  rhythmDiv
} from "/imports/ui/components/landing/components/jss/helpers";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers";

import "/imports/api/classInterest/methods";
import "/imports/api/classTimes/methods";
import { checkForAddToCalender } from "/imports/util";
import ClassTimeButton from "/imports/ui/components/landing/components/buttons/ClassTimeButton.jsx";
import ClassTime from "/imports/ui/components/landing/components/classTimes/ClassTime.jsx";
import Events from "/imports/util/events";
import * as settings from "/imports/ui/components/landing/site-settings.js";
import { toastrModal } from "/imports/util";
const formStyle = formStyles();

const styles = theme => {
  console.log("theme", theme);
  return {
    dialogPaper: {
      overflowX: "hidden",
      padding: helpers.rhythmDiv * 2,
      maxWidth: 400
    }
  };
};

const ButtonWrapper = styled.div`
  width: 100%;
  ${flexCenter}
  padding: ${rhythmDiv}px 0px;
`;
const InnerWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const ClassTimesWrapper = styled.div`
  padding: 16px;
  width: 100%;
  display: flex;
  border: 2px solid #ccc;
`;

const scheduleDetails = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

const ImageContent = styled.p`
  margin: 0;
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  font-weight: 400;
`;

const EventName = ImageContent.extend`
  margin: ${helpers.rhythmDiv}px 0;
  color: ${helpers.primaryColor};
  font-size: ${helpers.baseFontSize * 2}px;
`;

const EventDesc = ImageContent.extend``;

class StripeConnectModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      error: false
    };
  }
  componentDidMount() {
    if (this.props.location.query && this.props.location.query.code) {
      const { toastr } = this.props;
      Meteor.call(
        "getStripeToken",
        this.props.location.query.code,
        (error, result) => {
          if (result) {
            toastr.success(result, "Success");
          }
        }
      );
    }
  }
  render() {
    {
      console.log("this.props in stripeconnectmodal", this.props);
    }
    return (
      <div>
        <h1>Stribe id " "{this.props.location.query.code}</h1>
      </div>
    );
  }
}

export default withMobileDialog()(
  withStyles(styles)(toastrModal(StripeConnectModal))
);
