import React, { Component, Fragment } from "react";
import get from "lodash/get";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import Grid from "material-ui/Grid";
import Input from "material-ui/Input";
import isEmpty from "lodash/isEmpty";
import { withStyles } from "material-ui/styles";
import styled from "styled-components";
import {verifyImageURL} from "/imports/util";
import FileUpload from "material-ui-icons/FileUpload";
import MobileDetect from "mobile-detect";
import ProgressiveImage from "react-progressive-image";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import UploadAvatar from "/imports/ui/components/schoolMembers/mediaDetails/UploadAvatar.js";
import CallMemberDialogBox from "/imports/ui/components/landing/components/dialogs/CallMemberDialogBox.js";
import EmailMemberDialogBox from "/imports/ui/components/landing/components/dialogs/EmailMemberDialogBox.jsx";
import EditMemberDialogBox from "/imports/ui/components/landing/components/dialogs/EditMemberDialogBox.js";
import ConfirmationModal from "/imports/ui/modal/confirmationModal";
const styles = theme => ({
  avatarCss: {
    minWidth: "100%",
    height: "163px",
    backgroundSize: "cover",
    backgroundPosition: "top center",
    borderRadius: '27px'

  },
  btnBackGround: {
    background: `${helpers.action}`
  },
  avatarContainer: {
    width: 100,
    textAlign: "center",
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
const ProfilePic =styled.div`
transition: background-image 1s linear !important;
background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(${props=>props.img});
    height: 150px;
    border-radius:15px;
    width: 165px;
    border: 2px solid black;
    border-radius: 15px;
`;
const UploadDiv = styled.div`
  background: #448aff;
  /* display: block; */
  /* overflow: hidden; */
  position: relative;
  /* bottom: 21px; */
  margin: 4px auto 0 auto;
  /* overflow: hidden; */
  width: 137px;
  /* background-image: url((unknown)); */
  /* background-size: cover; */
  /* background-position: center; */
  /* height: 250px; */
  /* width: 250px; */
  border: 1px solid #bbb;
  /* width: 122px; */
  /* height: 100pc; */
  color: #fff;
  font-family: inherit;
  font-weight: 400;
`;

const ActionButtons = props => (
  <ActionButtonsWrapper>
    <ActionButton
      onClick={() => {
        props.handleCall(props.memberInfo);
      }}
    >
      <MemberActionButton icon iconName="phone" label="Call" />
    </ActionButton>

    <ActionButton
      onClick={() => {
        props.handleEmail(props.memberInfo);
      }}
    >
      <MemberActionButton
        secondary
        noMarginBottom
        label="Email"
        icon
        iconName="email"
      />
    </ActionButton>

    <ActionButton>
      <MemberActionButton
        noMarginBottom
        label="Edit"
        icon
        iconName="edit"
        onClick={props.openEditMemberModal}
      />
    </ActionButton>
    {props.adminView &&  <ActionButton>
      <MemberActionButton
        noMarginBottom
        label="Remove Admin"
        icon
        iconName="remove_circle_outline"
        onClick={props.removeButtonClick}
      />
    </ActionButton>}
   
  </ActionButtonsWrapper>
);

class SchoolMemberInfo extends Component {
  constructor(props) {
    super(props);
    this.state = this.initializeState(this.props);
  }

 
  initializeState = ({ memberInfo, view }) => {
    let state = {};
    state.showConfirmation=false;
    if (view === "admin") {
      state.notes = get(memberInfo, "adminNotes", "");
    // } else {
    //   state.notes = get(
    //     memberInfo,
    //     `classmatesNotes[${Meteor.userId()}].notes`,
    //     ""
    //   );
    }
    return state;
  };

  saveMyNotesInMembers = event => {
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
    Meteor.call(
      "schoolMemberDetails.editSchoolMemberDetails",
      { doc_id: memberInfo._id, doc: payload },
      (err, res) => {
        if (res) {
        }
        if (err) {
        }
      }
    );
  };

  // Handle call button for member's view.
  handleCall = memberInfo => {
    // Detect mobile and dial number on phone else show popup that shows phone information.
    let md = new MobileDetect(window.navigator.userAgent);
    if (md.mobile()) {
      let schoolPhone = "tel:+1-303-499-7111";
      if (schoolData.phone) {
        schoolPhone = `tel:${schoolData.phone}`;
        return `${schoolPhone}`;
      }
    } else {
      this.handleCallButtonClick();
    }
  };
  handleEmail = memberInfo => {
    this.handleEmailButtonClick();
  };

  handleEmailButtonClick = () => {
    this.handleDialogState("emailMemberDialog", true);
  };
  // Handle call us button click for school page
  handleCallButtonClick = () => {
    this.handleDialogState("callMemberDialog", true);
  };

  handleDialogState = (dialogName, state) => {
    this.setState({
      [dialogName]: state
    });
  };
  getContactNumber = () => {
    return this.props.memberInfo && this.props.memberInfo.phone;
  };
  componentWillReceiveProps(){

  }
  componentWillMount=()=> {
    const { memberInfo } = this.props;
    
    verifyImageURL(memberInfo.pic,(res)=>{
      if(res){
            this.setState({bgImg:memberInfo.pic});
      }else{
        this.setState({bgImg:config.defaultProfilePic});
      }
    })
  }
  componentWillReceiveProps=(nextProps,nextState)=>{
  const { memberInfo } = nextProps;
  this.setState(this.initializeState(nextProps));
  verifyImageURL(memberInfo.pic,(res)=>{
    if(res){
          this.setState({bgImg:memberInfo.pic});
    }else{
      this.setState({bgImg:config.defaultProfilePic});
    }
  })
  }
  handleRemove = () => {
    let _id, schoolId,to,userName,schoolName;
    const { memberInfo } = this.props;
    _id = memberInfo._id;
    schoolId = memberInfo.schoolId;
    to = memberInfo.email;
    userName = memberInfo.firstName;
    schoolName = memberInfo.schoolName;
   debugger;
    Meteor.call('school.manageAdmin',_id,schoolId,'remove',to,userName,schoolName,(err,res)=>{
      if(res){
        this.setState({showConfirmation:false});
      }
    })
  }
  render() {
    const { memberInfo, view, classes ,adminView} = this.props;
    debugger;
    const {
      showUploadAvatarModal,
      mediaFormData,
      filterStatus,
      limit,
      bgImg,
      showConfirmation
    } = this.state;
    return (
      <Grid container>
      {showConfirmation && (
            <ConfirmationModal
              open={showConfirmation}
              submitBtnLabel="Yes, Remove"
              cancelBtnLabel="Cancel"
              message="You will remove this admin, Are you sure?"
              onSubmit={this.handleRemove}
              onClose={() => this.setState({ showConfirmation: false })}
            />
          )}
        {this.state.callMemberDialog && (
          <CallMemberDialogBox
            contactNumbers={this.getContactNumber()}
            open={this.state.callMemberDialog}
            onModalClose={() =>
              this.handleDialogState("callMemberDialog", false)
            }
          />
        )}
        {this.state.emailMemberDialog && (
          <EmailMemberDialogBox
            open={this.state.emailMemberDialog}
            onModalClose={() =>
              this.handleDialogState("emailMemberDialog", false)
            }
          />
        )}
        {this.state.openEditMemberModal && (
          <EditMemberDialogBox
            open={this.state.openEditMemberModal}
            onModalClose={() => this.setState({ openEditMemberModal: false })}
            openEditTaggedModal={this.openEditMemberModal}
            memberInfo={memberInfo}
            classTypeData={this.props.classTypeData}
            reRender={this.props.handleMemberDetailsToRightPanel}
            schoolId={this.props.memberInfo && this.props.memberInfo.schoolId}
          />
        )}
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
            <Grid className={classes.avatarContainer} item sm={4} xs={4} md={4} key={memberInfo._id}>
            <ProgressiveImage 
                src={bgImg}
                placeholder={config.blurImage}>
                {(src) =>  <ProfilePic img={src}/>}
              </ProgressiveImage>
            
              {view === "admin" ? (
                <UploadDiv
                  onClick={() =>
                    this.setState({
                      showUploadAvatarModal: true,
                      mediaFormData: null,
                      filterStatus: false
                    })
                  }
                >
                  Upload Image <FileUpload />
                </UploadDiv>
              ) : (
                ""
              )}
            </Grid>
            {
              <UploadAvatar
                showUploadAvatarModal={showUploadAvatarModal}
                onClose={() => {
                  this.setState({ showUploadAvatarModal: false });
                }}
                formType={showUploadAvatarModal}
                ref="uploadAvatar"
                onAdd={this.onUploadAvatar}
                onEdit={this.onEditAvatar}
                memberInfo={memberInfo}
              />
            }

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
          <Grid container style={{ backgroundColor: "darkgray",marginTop:'22px' }}>
            <Grid item>
              <ActionButtons
                memberInfo={this.props.memberInfo}
                handleCall={this.handleCall}
                handleEmail={this.handleEmail}
                openEditMemberModal={event => {
                  this.setState({ openEditMemberModal: true });
                }}
                adminView={adminView}
                removeButtonClick={()=>{this.setState({showConfirmation:true})}}
              />
            </Grid>
          </Grid>
        )}
      </Grid>
    );
  }
}

export default withStyles(styles, { withTheme: true })(SchoolMemberInfo);
