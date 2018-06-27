import React,{Fragment} from 'react';
import isEmpty from 'lodash/isEmpty';

import PrimaryButton from '/imports/ui/components/landing/components/buttons/PrimaryButton.jsx';
import { browserHistory } from 'react-router';

const AddSchoolButton = () => <PrimaryButton onClick={ ()=> browserHistory.push('/skillshape-for-school') } noMarginBottom label="SkillShape for Schools" itemScope itemType="http://schema.org/AddAction"/>

export default AddSchoolButton;
