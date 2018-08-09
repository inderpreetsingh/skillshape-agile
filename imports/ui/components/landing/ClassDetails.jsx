import React, { Component } from "react";
import ClassDetails from "/imports/ui/components/landing/components/classDetails/index.jsx";
import PurchaseClassesDialogBox from '/imports/ui/components/landing/components/dialogs/'

class ClassDetailsContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return ClassDetails.call(this);
  }
}

export default ClassDetailsContainer;
