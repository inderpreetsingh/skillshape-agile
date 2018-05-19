import React , {Fragment,Component} from 'react';
import ReactStars from 'react-stars';
import { get, isEmpty } from 'lodash';
import styled from 'styled-components';

import { MuiThemeProvider} from 'material-ui/styles';
import Typography from 'material-ui/Typography';

import CardsReveal from '/imports/ui/components/landing/components/cards/CardsReveal.jsx';
import SecondaryButton from '/imports/ui/components/landing/components/buttons/SecondaryButton.jsx';
import PrimaryButton from '/imports/ui/components/landing/components/buttons/PrimaryButton.jsx';
import ClassTimesDialogBox from '/imports/ui/components/landing/components/dialogs/ClassTimesDialogBox.jsx';
import ManageRequestsDialogBox from '/imports/ui/components/landing/components/dialogs/ManageRequestsDialogBox.jsx';

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
        manageRequestsDialog: false,
        isLoading:false
    }
    handleDialogState = (state) => (e) => {
        e.stopPropagation();
        // console.log(e,e.stopPropagation(),"clickced");
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

    handleManageRequestsDialogState = (dialogState) => {
      this.setState({
        manageRequestsDialog : dialogState,
      })
    }

    handleClassTimesRequest = () => {
      const {_id, schoolId, toastr} = this.props;
      if(!Meteor.userId()) {
        const newState = {...this.state, dialogOpen: false, manageRequestsDialog: true};
        this.setState(newState);
      }else {
        const data = {
          classTypeId: _id,
          schoolId: schoolId
        };

        Meteor.call('classTimesRequest.addRequest', data, (err,res) => {
          this.setState({isBusy: false} , () => {
            if(err) {
              toastr.error(err.reason || err.message,"Error", {}, false);
            }else {
              toastr.success('Your request has been processed','success');
              this.handleRequest(schoolId);
            }
          });
        });
      }

    }

    handleRequest = (schoolId) => {
        let schoolData  = this.getSchoolData(schoolId);
        if(!isEmpty(schoolData)) {
          let emailBody = "";
          let url = `${Meteor.absoluteUrl()}schools/${schoolData.slug}`
          let subject ="", message =  "";
          let currentUserName = getUserFullName(Meteor.user());
          emailBody = `Hi %0D%0A%0D%0A I saw your listing on SkillShape.com ${url} and would like to attend. Can you please update your class times%3F %0D%0A%0D%0A Thanks`
          const mailTo = `mailto:${schoolData && schoolData.email}?subject=${subject}&body=${emailBody}`;
          const mailToNormalized = /*encodeURI(*/mailTo/*)*/;
          openMailToInNewTab(mailToNormalized);
        }
    }

    render() {
       {/*handleClassTimeRequest={this.handleClassTimeRequest.bind(this, this.props.schoolId)} */}
        let ratings,reviews;
        const {schoolId, _id, ageMin, ageMax, gender, experienceLevel, desc, name, reviewsStats, classInterestData} = this.props;
        const cardRevealData = {
          _id: _id,
          schoolId: schoolId,
          ageMin: ageMin,
          ageMax: ageMax,
          gender: gender,
          experienceLevel: experienceLevel,
          description: desc,
          name: name,
        }
        const classTimesData = this.getClassTimes(get(this.props, "_id", null));
        const schoolData  = this.getSchoolData(schoolId);

        if(!isEmpty(reviewsStats)) {
          ratings = reviewsStats.ratings;
          reviews = reviewsStats.reviews;
        }

        return(<Fragment>
            {this.state.dialogOpen && <ClassTimesDialogBox
                  classInterestData={classInterestData}
                  classTimesData={classTimesData}
                  open={this.state.dialogOpen}
                  onModalClose={this.handleDialogState(false)}
                  handleClassTimeRequest={this.handleClassTimesRequest}
                  errorText={this.state.classTimesDialogBoxError} />}
            {this.state.manageRequestsDialog && <ManageRequestsDialogBox
              title={"Schedule Info"}
              open={this.state.manageRequestsDialog}
              onModalClose={() => this.handleManageRequestsDialogState(false)}
              requestFor={'class times'}
              submitBtnLabel={'Requests class times'}
              schoolData={schoolData}
              classTypeId={_id}
              onToastrClose={() => this.handleManageRequestsDialogState(false)} />}
            {this.state.isLoading && <ContainerLoader />}

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
                      hideClassTypeOptions={this.props.hideClassTypeOptions}
                      />
                  } />
                </CardsRevealWrapper>
            </Fragment>
            )
        }
}

export default (toastrModal(ClassTypeCard));
