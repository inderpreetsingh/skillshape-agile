import React from "react";
import { createContainer } from "meteor/react-meteor-data";
import { withPopUp } from "/imports/util";
import SchoolBox from '/imports/ui/componentHelpers/boxes/schoolBox.js'
import get from "lodash/get";
import Purchases from "/imports/api/purchases/fields";
import School from "/imports/api/school/fields";
import isEmpty from 'lodash/isEmpty'
import uniq from 'lodash/uniq';
 class MySubscription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {schoolData,purchaseData} = this.props;
    return (
      <div>
        <SchoolBox 
        schoolData = {schoolData}
        purchaseData = {purchaseData}
          />
      </div>
    );
  }
}
export default createContainer(props => {
  const {currentUser} = props;
  let userId,purchaseData=[],purchaseSubscription,filter,schoolIds=[],schoolSubscription,schoolData = [];
  userId = get(currentUser,'_id',null);
  filter = {userId}
  purchaseSubscription = Meteor.subscribe("purchases.getPurchasesListByMemberId",filter);
  if(purchaseSubscription && purchaseSubscription.ready())
  purchaseData = Purchases.find().fetch();
  if(!isEmpty(purchaseData)){
    purchaseData.map((current)=>{
      schoolIds.push(current.schoolId);
    })
    schoolSubscription = Meteor.subscribe("school.findSchoolByIds",uniq(schoolIds));
  
  }
  if(schoolSubscription && schoolSubscription.ready()){
    schoolData = School.find().fetch();
    console.log('TCL: schoolData', schoolData);
   }
  return {
    schoolData,
    purchaseData
  };
}, (withPopUp(MySubscription)));