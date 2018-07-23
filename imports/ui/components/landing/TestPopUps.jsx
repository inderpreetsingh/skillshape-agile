import React,{Component} from 'react';
import styled from 'styled-components';
import Button from 'material-ui/Button';

import PrimaryButton from '/imports/ui/components/landing/components/buttons/PrimaryButton.jsx';
import SkillShapeDialogBox from '/imports/ui/components/landing/components/dialogs/SkillShapeDialogBox.jsx';
import {withPopUp} from '/imports/util';

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

class TestPopUps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      standAloneDialogBox: false
    }
  }

  handleWarningButtonClick = () => {
    const {popUp} = this.props;
    popUp.appear("warning", {title: "This is sample", content: "sample again.."});
  }

  handleAlertButtonClick = () => {
    const {popUp} = this.props;
    popUp.appear('alert')
  }

  handleInformButtonClick = () => {
    const {popUp} = this.props;
    popUp.appear("inform");
  }

  handleAffirmation = () => {
    const {popUp} = this.props;
    popUp.appear("inform");
  }

  handleSuccessButtonClick = () => {
    const {popUp} = this.props;
    popUp.appear('success',{onAffirmationButtonClick: this.handleSuccessButtonClick});
  }

  handleCustomRenderButtonClick = () => {
    const {popUp} = this.props;
    popUp.appear('inform',{ RenderActions : <ButtonsWrapper>
        <Button onClick={this.handleSuccessButtonClick}>Custom Render Action</Button></ButtonsWrapper>})
  }

  handleStandAlonePopUpButtonClick = (state) => () => {
    this.setState({
        standAloneDialogBox: state
    });
  }

  render() {
    return (<div>
      {this.state.standAloneDialogBox && <SkillShapeDialogBox open={this.state.standAloneDialogBox} onModalClose={this.handleStandAlonePopUpButtonClick(false)} type="warning" />}
      <PrimaryButton onClick={this.handleWarningButtonClick} label="Warning"/>
      <PrimaryButton onClick={this.handleSuccessButtonClick} label="success" />
      <PrimaryButton onClick={this.handleAlertButtonClick} label="Alert" />
      <PrimaryButton onClick={this.handleInformButtonClick} label="Inform" />
      <PrimaryButton onClick={this.handleCustomRenderButtonClick} label="Custom Render" />
      <PrimaryButton onClick={this.handleStandAlonePopUpButtonClick(true)} label="Standalone PopUp" />
    </div>)
  }
}

export default withPopUp(TestPopUps);
