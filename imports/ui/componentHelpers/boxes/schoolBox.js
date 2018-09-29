import React from "react";
import Paper from 'material-ui/Paper'
import { withStyles } from "material-ui/styles";
import styled from "styled-components";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import groupBy from 'lodash/groupBy';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { cardImgSrc } from "/imports/ui/components/landing/site-settings.js";
import ProgressiveImage from "react-progressive-image";
import CallUsDialogBox from '/imports/ui/components/landing/components/dialogs/CallUsDialogBox.jsx';
import EmailUsDialogBox from '/imports/ui/components/landing/components/dialogs/EmailUsDialogBox.jsx';
import MemberActionButton from "/imports/ui/components/landing/components/buttons/MemberActionButton.jsx";
import SubscriptionBox from './subscriptionBox';
const styles = theme => ({
    root: {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        margin: "70px",
        backgroundColor: "blueviolet",
        borderRadius: "20px"
    },
    schoolArea: {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        margin: "10px",
        borderRadius: "20px",
        backgroundColor: "dimgrey"
    }
  });
  const ImageContainer = styled.div`
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  ${helpers.coverBg};
  border-radius: 16px;
  border: 1px solid black;
  margin-right: ${helpers.rhythmDiv * 2}px;
  margin-bottom: ${helpers.rhythmDiv}px;
  background-position: 50% 50%;
  background-image: url('${props => props.src}');
  transition: background-image 1s linear !important;
`;
const SchoolArea = styled.div`
  ${helpers.flexHorizontalSpaceBetween};
  justify-content: space-around;
  width: 100%;

  @media screen and (max-width: 400px) {
    flex-direction: column;
  }
`;
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
const SchoolName = styled.div`
  font-size: x-large;
  font-weight: 500;
`;
const ActionButtons = props => (
    <ActionButtonsWrapper>
      <ActionButton
        onClick={() => { props.handleCall(props.memberInfo); }}
      >
        <MemberActionButton icon iconName="phone" label="Call" />
      </ActionButton>
  
      <ActionButton
         onClick={() => { props.handleEmail(props.memberInfo); }}
      >
        <MemberActionButton
          secondary
          noMarginBottom
          label="Email"
          icon
          iconName="email"
        />
      </ActionButton>
  
     
     
    </ActionButtonsWrapper>
  );
class SchoolBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        callUsDialog:false,
        emailUsDialog:false
    };
  }
 
  render() {
    const { classes,purchaseData,schoolData } = this.props;
    let {callUsDialog, emailUsDialog,phone,email} = this.state;
    let purchaseBySchoolId = groupBy(purchaseData,'schoolId')

    return (
        <div>
            {callUsDialog && <CallUsDialogBox contactNumbers={[phone]} open={callUsDialog} onModalClose={() => this.setState({callUsDialog:false})} />}
            {emailUsDialog && <EmailUsDialogBox ourEmail={email} schoolData={schoolData} open={emailUsDialog} onModalClose={() => this.setState({emailUsDialog:false})} />}
            {!isEmpty(schoolData) && schoolData.map((current)=>{
            let src = get(current,'mainImageMedium',get(current,'mainImage',cardImgSrc))
            let subscriptionList = purchaseBySchoolId[current._id];
            return   <div><Paper className={classes.root}>
                <Paper className={classes.schoolArea}>
                <SchoolArea>
                <ProgressiveImage 
                src={src}
                placeholder={config.blurImage}>
                {(src) => <ImageContainer src={src}/>}
              </ProgressiveImage>
                <SchoolName> {current.name.toUpperCase()} </SchoolName>
                 <ActionButtons 
                 handleCall = {()=>{this.setState({callUsDialog:true,phone:get(current,'phone',99999999)})}}
                 handleEmail = {()=>{this.setState({emailUsDialog:true,email:get(current,"email",'fake@email.com')})}}
                 />
                </SchoolArea>
                {}
                <SubscriptionBox 
                subscriptionList = {subscriptionList}
                />
                </Paper>
            </Paper></div>
          
            })}
            
        </div>
    );
  }
}
export default withStyles(styles)(SchoolBox);
