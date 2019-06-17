import { get, isEmpty } from 'lodash';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component, lazy, Suspense } from 'react';
import Classes from '/imports/api/classes/fields';
import ClassTime from '/imports/api/classTimes/fields';
import ClassType from '/imports/api/classType/fields';
import School from '/imports/api/school/fields';
import { classTypeImgSrc } from '/imports/ui/components/landing/site-settings';
import { ContainerLoader } from '/imports/ui/loading/container';
import { withPopUp, redirectToHome } from '/imports/util';
import { Loading } from '/imports/ui/loading';
import ClassInterest from '/imports/api/classInterest/fields';

const ClassDetails = lazy(() => import('/imports/ui/components/landing/components/classDetails/index'));

class ClassDetailsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getBgImage() {
    const { school, classTypeData } = this.props;
    return get(
      classTypeData,
      'classTypeImg',
      get(
        classTypeData,
        'medium',
        get(school, 'mainImage', get(school, 'mainImageMedium', classTypeImgSrc)),
      ),
    );
  }

  getLogoImage() {
    const { school } = this.props;
    return get(school, 'logoImg', get(school, 'logoImgMedium', ''));
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.classTypeData) && Meteor.userId()) {
      const { _id: classTypeId } = nextProps.classTypeData;
      const filter = { classTypeId, userId: Meteor.userId() };
      Meteor.call('classPricing.signInHandler', filter, (err, res) => {
        if (!isEmpty(res)) {
          const { epStatus, purchased, noPackageRequired } = res;
          if ((epStatus && !isEmpty(purchased)) || noPackageRequired) {
            this.setState({ notification: false, loginUserPurchases: res });
          } else if (!epStatus) {
            this.setState({ packagesRequired: 'enrollment', notification: true });
          } else {
            this.setState({ packagesRequired: 'perClassAndMonthly', notification: true });
          }
        }
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.error) {
      return true;
    }
    return !nextProps.isBusy;
  }

  render() {
    const {
      error,
      currentUser,
      classTimeData,
      isUserSubsReady,
      classData,
      instructorsData,
      popUp,
      instructorsIds,
      classTypeData,
      isBusy,
      schoolData,
      classInterestData,
    } = this.props;
    if (error) {
      redirectToHome();
    }
    if (isBusy || isEmpty(schoolData)) {
      return <ContainerLoader />;
    }
    let currentView;
    let params;
    if (!isEmpty(schoolData)) {
      params = { slug: schoolData.slug };
      currentView = checkIsAdmin({ user: currentUser, schoolData })
        ? 'instructorsView'
        : 'studentsView';
    }
    return (
      <Suspense fallback={<Loading />}>
        <ClassDetails
          classTypeData={classTypeData}
          topSearchBarProps={{
            currentUser,
            isUserSubsReady,
          }}
          headerProps={{
            bgImg: this.getBgImage(),
            logoImg: this.getLogoImage(),
          }}
          classTimeInformationProps={{ ...classTimeData }}
          classData={classData}
          instructorsData={instructorsData}
          popUp={popUp}
          instructorsIds={instructorsIds}
          schoolData={schoolData}
          currentView={currentView}
          params={params}
          classInterestData={classInterestData}
          {...this.state}
        />
      </Suspense>
    );
  }
}

export default createContainer((props) => {
  const { classId } = props.params || {};
  let classesSubscription;
  let classData;
  let classTypeSub;
  let classTimeSubscription;
  let classTimeData;
  let schoolData;
  let classInterestData;
  let instructorsIds = [];
  let instructorsData = [];
  const filter = { _id: classId };
  let classTypeData = {};
  let isBusy = true;
  let error = false;

  if (!classId) {
    error = true;
  }
  classesSubscription = Meteor.subscribe('classes.getClassesData', filter);
  if (classesSubscription && classesSubscription.ready()) {
    classData = Classes.findOne();
    if (isEmpty(classData)) {
      error = true;
    } else {
      const {
        classTypeId, classTimeId, schoolId, instructors: classInstructors,
      } = classData;
      instructorsIds = classInstructors;
      if (schoolId) {
        const schoolSub = Meteor.subscribe('school.findSchoolByIds', [schoolId]);
        if (schoolSub && schoolSub.ready()) {
          schoolData = School.findOne();
        }
        const classInterestSub = Meteor.subscribe(
          'classInterest.getClassInterest',
          classTimeId,
          schoolId,
          classTypeId,
        );
        if (classInterestSub && classInterestSub.ready()) {
          classInterestData = ClassInterest.findOne();
        }
      }
      if (classTypeId) {
        classTypeSub = Meteor.subscribe('classType.getClassTypeWithIds', {
          classTypeIds: [classTypeId],
        });
        if (classTypeSub && classTypeSub.ready()) {
          classTypeData = ClassType.findOne({});
        }
      }
      if (classTimeId) {
        classTimeSubscription = Meteor.subscribe('classTime.getClassTimeById', classTimeId);
        if (classTimeSubscription && classTimeSubscription.ready()) {
          classTimeData = ClassTime.findOne();
          const { instructors: classTimeInstructors } = classTimeData;
          instructorsIds = isEmpty(classInstructors) ? classTimeInstructors : classInstructors;
        }
      }
      if (!isEmpty(instructorsIds)) {
        const userSubscription = Meteor.subscribe('user.getUsersFromIds', instructorsIds);
        if (userSubscription && userSubscription.ready()) {
          isBusy = false;
          instructorsData = Meteor.users.find({ _id: { $in: instructorsIds } }).fetch();
        }
      } else {
        isBusy = false;
      }
    }
  }

  return {
    isBusy,
    classData,
    instructorsData,
    instructorsIds,
    classTypeData,
    classTimeData,
    schoolData,
    error,
    classInterestData,
  };
}, withPopUp(ClassDetailsContainer));
