import React, { Component, Fragment } from "react";
import get from "lodash/get";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import Grid from "material-ui/Grid";
import Input from "material-ui/Input";
import isEmpty from "lodash/isEmpty";
import { withStyles } from "material-ui/styles";
import styled from "styled-components";
import FileUpload from 'material-ui-icons/FileUpload';
import MobileDetect from 'mobile-detect';


import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import CreateMedia from "/imports/ui/components/schoolView/editSchool/mediaDetails/createMedia.js";
import CallMemberDialogBox from '/imports/ui/components/landing/components/dialogs/CallMemberDialogBox.js';
import EmailMemberDialogBox from '/imports/ui/components/landing/components/dialogs/EmailMemberDialogBox.jsx';
import EditMemberDialogBox from "/imports/ui/components/landing/components/dialogs/EditMemberDialogBox.js";

const styles = theme => ({
  avatarCss: {
    width: "175px",
    height: "150px",
    backgroundSize: "cover",
    backgroundPosition: "top center",
    borderRadius: "50%"
  },
  btnBackGround: {
    background: `${helpers.action}`
  },
  avatarContainer: {
    border: '2px solid black',
    backgroundColor: '#FFFFFF',
    borderRadius: '50%',
    width: 100,
  }
});

import MemberActionButton from "/imports/ui/components/landing/components/buttons/MemberActionButton.jsx";

const ActionButtonsWrapper = styled.div`
  left: ${helpers.rhythmDiv * 2}px;
  bottom: ${helpers.rhythmDiv * 2}px;
  right: auto;
  padding: 5px;
  ${helpers.flexCenter}

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    justify-content: flex-start;
    align-items: flex-start;
    bottom: 0;
  }

  @media screen and (max-width: ${helpers.tablet}px) {
    position: initial;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const ActionButton = styled.div`
  margin-right: ${helpers.rhythmDiv}px;

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    margin-right: 0;
    margin-bottom: ${helpers.rhythmDiv * 2}px;
  }

  @media screen and (max-width: ${helpers.tablet}px) {
    margin-right: ${helpers.rhythmDiv}px;
  }
`;

const ActionButtons = props => (
  <ActionButtonsWrapper>
    <ActionButton onClick={()=> {props.handleCall(props.memberInfo)}}>
      <MemberActionButton icon iconName="phone" label="Call" />
    </ActionButton>

    <ActionButton onClick={()=> {props.handleEmail(props.memberInfo)}}>
      <MemberActionButton
        secondary
        noMarginBottom
        label="Email"
        icon
        iconName="email"
      />
    </ActionButton>

    <ActionButton>
      <MemberActionButton noMarginBottom label="Edit" icon iconName="edit" onClick={props.openEditMemberModal} />
    </ActionButton>
  </ActionButtonsWrapper>
);

class SchoolMemberInfo extends Component {
  constructor(props) {
    super(props);
    this.state = this.initializeState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.memberInfo) {
      this.setState(this.initializeState(nextProps));
    }
  }

  initializeState = ({ memberInfo, view }) => {
    let state = {};
    if (view === "admin") {
      state.notes = get(memberInfo, "adminNotes", "");
    } else {
      state.notes = get(
        memberInfo,
        `classmatesNotes[${Meteor.userId()}].notes`,
        ""
      );
    }
    return state;
  };

  saveMyNotesInMembers = event => {
    console.log("saveMyNotesInMembers memberInfo -->>", memberInfo);
    const { memberInfo, view } = this.props;
    let payload = {};

    if (view === "admin" && Meteor.userId()) {
      payload.adminNotes = this.state.notes;
    } else if (view === "classmates" && Meteor.userId()) {
      payload.classmatesNotes = {
        [Meteor.userId()]: {
          notes: this.state.notes
        }
      };
    }
    console.log("Final payload -->>", payload);
    Meteor.call(
      "schoolMemberDetails.editSchoolMemberDetails",
      { doc_id: memberInfo._id, doc: payload },
      (err, res) => {
        if (res) {
          console.log("Upadted School Notes", res);
        }
        if (err) {
          console.error("err", err);
        }
      }
    );
  };

  // Handle call button for member's view.
  handleCall = (memberInfo) => {
    console.log("memberInfo=>",memberInfo);
    // Detect mobile and dial number on phone else show popup that shows phone information.
    let md = new MobileDetect(window.navigator.userAgent);
      if(md.mobile()) {
        let schoolPhone = "tel:+1-303-499-7111";
        if(schoolData.phone) {
        schoolPhone = `tel:${schoolData.phone}`;
        return `${schoolPhone}`;
      }
    } else {
      this.handleCallButtonClick();
    }
  }
  handleEmail = (memberInfo) => {
    this.handleEmailButtonClick();
  }

  handleEmailButtonClick = () => {
    this.handleDialogState('emailMemberDialog',true);
  }
      // Handle call us button click for school page
  handleCallButtonClick = () => {
    this.handleDialogState('callMemberDialog',true);
  }

  handleDialogState = (dialogName,state) => {
    this.setState({
      [dialogName]: state
    })
  }
  getContactNumber = () => {
    return this.props.memberInfo && this.props.memberInfo.phone;
  }

  render() {
    const { memberInfo, view, classes } = this.props;
    console.log("SchoolMemberInfo state -->>", this.state);
    console.log("SchoolMemberInfo props -->>", this.props);
    const { showCreateMediaModal, mediaFormData, filterStatus, limit } = this.state;
    return (
      <Grid container>
        {this.state.callMemberDialog && <CallMemberDialogBox contactNumbers={this.getContactNumber()} open={this.state.callMemberDialog} onModalClose={() => this.handleDialogState('callMemberDialog',false)}/>}
        {this.state.emailMemberDialog && <EmailMemberDialogBox  open={this.state.emailMemberDialog} onModalClose={() => this.handleDialogState('emailMemberDialog',false)}/>}
        {
          this.state.openEditMemberModal &&
          <EditMemberDialogBox
              open={this.state.openEditMemberModal}
              onModalClose={() => this.setState({openEditMemberModal:false})}
              openEditTaggedModal= {this.openEditMemberModal}
              memberInfo={ memberInfo }
              classTypeData={ this.props.classTypeData }
              reRender={this.props.handleMemberDetailsToRightPanel}
          />
        }
        <Grid
          container
          className="userInfoPanel"
          style={{ borderTop: "solid 3px #ddd", display: "flex" }}
        >
          <Grid
            item
            sm={8}
            xs={12}
            md={8}
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              padding: "24px"
            }}
          >
            <Grid className={classes.avatarContainer} item sm={4} xs={4} md={4}>
              <img className={classes.avatarCss} src="/images/Avatar-Unisex.png" />
              {<CreateMedia
                  showCreateMediaModal={showCreateMediaModal}
                  onClose = {this.closeMediaUpload}
                  formType={showCreateMediaModal}
                  schoolId={this.props.schoolData && this.props.schoolData._id}
                  ref="createMedia"
                  onAdd={this.onAddMedia}
                  onEdit={this.onEditMedia}
                  mediaFormData={mediaFormData}
                  filterStatus={filterStatus}
                  showLoading = {this.showLoading}
                  tagMember={true}
                  taggedMemberInfo={memberInfo}
              />}
            </Grid>
            <Grid item md={4} sm={4} xs={4} style={{padding: '8px',float: 'right'}}>
              {
                <Button raised color="accent" onClick={()=> this.setState({showCreateMediaModal:true, mediaFormData: null, filterStatus: false})}>
                    Upload Image <FileUpload />
                </Button>
              }
              </Grid>
            <Grid item sm={4} xs={4} md={4}>
              <Typography>{memberInfo.name}</Typography>
              {view === "admin" && (
                <React.Fragment>
                  <Typography>{memberInfo.phone}</Typography>
                  <Typography>{memberInfo.email}</Typography>
                </React.Fragment>
              )}
            </Grid>
          </Grid>
          <Grid item sm={3} xs={12} md={3} style={{ padding: "28px" }}>
            <div className="notes">
              {view === "admin" ? "Admin Notes" : "My Private Notes"}
            </div>
            <Input
              onBlur={this.saveMyNotesInMembers}
              value={this.state.notes}
              onChange={e => this.setState({ notes: e.target.value })}
              style={{ border: "1px solid", backgroundColor: "#fff" }}
              multiline
              rows={4}
              fullWidth
            />
          </Grid>
        </Grid>
        {view === "admin" && (
          <Grid container style={{ backgroundColor: "darkgray" }}>
            <Grid item>
              <ActionButtons
                memberInfo={this.props.memberInfo}
                handleCall={this.handleCall}
                handleEmail={this.handleEmail}
                openEditMemberModal={(event)=> {this.setState({openEditMemberModal:true})}}
              />
            </Grid>
          </Grid>
        )}
      </Grid>
    );
  }
}

export default withStyles(styles, { withTheme: true })(SchoolMemberInfo);
