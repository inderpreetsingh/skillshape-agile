import React from 'react';
import PrimaryButton from './PrimaryButton.jsx';
import { browserHistory } from 'react-router';

const AddSchoolButton = () => <PrimaryButton onClick={ ()=> browserHistory.push('/skillShape-school') } noMarginBottom label="SkillShape for Schools" itemScope itemType="http://schema.org/AddAction"/>

export default AddSchoolButton;
