import React , {Fragment,Component} from 'react';
import ReactStars from 'react-stars';
import { get, isEmpty } from 'lodash';
import { MuiThemeProvider} from 'material-ui/styles';
import Typography from 'material-ui/Typography';

import styled from 'styled-components';

import CardsReveal from './CardsReveal.jsx';
import SecondaryButton from '../buttons/SecondaryButton.jsx';
import PrimaryButton from '../buttons/PrimaryButton.jsx';
import ClassTimesDialogBox from '../dialogs/ClassTimesDialogBox.jsx';

import * as helpers from '../jss/helpers.js';
import MuiTheme from '../jss/muitheme';

import ClassTypeCardBody from './ClassTypeCardBody.jsx';
import ClassTypeCardDescription from './ClassTypeCardDescription.jsx';

import classTimesData from '../../constants/classTimesData';
import ClassTimes from "/imports/api/classTimes/fields";
import { toastrModal } from '/imports/util';
import { ContainerLoader } from '/imports/ui/loading/container.js';

import { cardImgSrc } from '../../site-settings.js';
import { getUserFullName } from '/imports/util/getUserData';
import { openMailToInNewTab } from '/imports/util/openInNewTabHelpers';
import School from "/imports/api/school/fields";

const CardsRevealWrapper = styled.div`
  width: 100%;
`;

class ClassTypeCard extends Component {
    state = {
        dialogOpen: false,
        isLoading:false
    }
    handleDialogState = (state) => (e) => {
        e.stopPropagation();
        console.log(e,e.stopPropagation(),"clickced");
        this.setState({
            dialogOpen: state,
            classTimesDialogBoxError: null,
        });
    }

    getClassTimes = (classTypeId) => {
        if(classTypeId)
            return ClassTimes.find({classTypeId}).fetch();
    }

    getSchoolData = (schoolId) => {
      let schoolData = School.findOne(schoolId);
      return schoolData;
    }

    handleClassTimeRequest = (schoolId) => {
        // const { schoolData } = this.props;
        console.log("handleClassTimeRequest --->>",schoolId);
        let schoolData  = this.getSchoolData(schoolId);
        if(!isEmpty(schoolData)) {
          let emailBody = "";
          let url = `${Meteor.absoluteUrl()}schools/${schoolData.slug}`
          let subject ="", message =  "";
          let currentUserName = getUserFullName(Meteor.user());
          emailBody = `Hi, %0D%0A%0D%0A I  saw your listing on SkillShape.com ${url} and would like to attend. Can you please update your pricing%3F %0D%0A%0D%0A Thanks`
          const mailTo = `mailto:${schoolData && schoolData.email}?subject=${subject}&body=${emailBody}`;
          const mailToNormalized = /*encodeURI(*/mailTo/*)*/;
          openMailToInNewTab(mailToNormalized);
        }
        // if(Meteor.userId()) {
        //     // this.setState({isLoading:true});
        //     // const { toastr } = this.props;
        //     // Meteor.call("classTimesRequest.notifyToSchool", {schoolId, classTypeId, classTypeName}, (err, res) => {
        //     //     console.log("err -->>",err);
        //     //     console.log("handleClassTimeRequest res -->>",res);
        //     //     let modalObj = {
        //     //         dialogOpen: false
        //     //     }
        //     //     if(res && res.emailSuccess) {
        //     //         // Need to show message to user when email is send successfully.
        //     //       toastr.success("Your email has been sent. We will assist you soon.", "Success");
        //     //     }
        //     //     if(res && res.message) {
        //     //         modalObj.classTimesDialogBoxError = res.message;
        //     //         modalObj.dialogOpen = true
        //     //     }
        //     //     this.setState({isLoading:false});
        //     //     this.setState(modalObj)
        //     // })
        // } else {
        //     alert("Please login !!!!")
        // }
    }

    render() {
        console.log("ClassTypeCard props --->>",this.props);
        let ratings,reviews;
        const cardRevealData = {
          _id:this.props._id,
          schoolId:this.props.schoolId,
          ageMin:this.props.ageMin,
          ageMax:this.props.ageMax,
          gender:this.props.gender,
          experienceLevel:this.props.experienceLevel,
          description:this.props.desc,
          name:this.props.name,
        }
        const classTimesData = this.getClassTimes(get(this.props, "_id", null))
        const {reviewsStats} = this.props;
        if(!isEmpty(reviewsStats)) {
          ratings = reviewsStats.ratings;
          reviews = reviewsStats.reviews;
        }

        return(
            <Fragment>
            {
                this.state.dialogOpen &&
                <ClassTimesDialogBox
                    classesData={classTimesData}
                    open={this.state.dialogOpen}
                    onModalClose={this.handleDialogState(false)}
                    handleClassTimeRequest={this.handleClassTimeRequest.bind(this, this.props.schoolId)}
                    errorText={this.state.classTimesDialogBoxError}
                />
            }
            {
                this.state.isLoading && <ContainerLoader />
            }
            <CardsRevealWrapper>
              <CardsReveal defaultImage={cardImgSrc} originalImage={this.props.classTypeImg} {...this.props}
                  body={
                  <ClassTypeCardBody
                      ratings={ratings}
                      reviews={reviews}
                      onJoinClassButtonClick={this.handleDialogState(true)} />
                  }
                  descriptionContent={
                  <ClassTypeCardDescription
                      schoolData={this.props.schoolData}
                      classTimeCheck={!isEmpty(classTimesData)}
                      ratings={ratings}
                      reviews={reviews}
                      description={this.props.desc}
                      onClassTimeButtonClick={this.handleDialogState(true)}
                      onRequestClassTimeButtonClick={this.handleDialogState(true)}
                      cardRevealInfo={cardRevealData}
                      />
                  } />
                </CardsRevealWrapper>
            </Fragment>
            )
        }
}

export default (toastrModal(ClassTypeCard));
