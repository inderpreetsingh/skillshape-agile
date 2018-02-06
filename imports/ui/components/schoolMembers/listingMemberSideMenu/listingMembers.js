import React,{Fragment} from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Link } from 'react-router';
import { floor } from 'lodash';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Email from 'material-ui-icons/Email';
import Phone from 'material-ui-icons/Phone';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Switch from 'material-ui/Switch';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';

import { Loading } from '/imports/ui/loading';
import { checkSuperAdmin, cutString } from '/imports/util';
import { CustomModal } from '/imports/ui/modal';
import MyCalender from '/imports/ui/components/users/myCalender';
import MediaDetails from '/imports/ui/components/schoolView/editSchool/mediaDetails';
import SchoolViewBanner from '/imports/ui/componentHelpers/schoolViewBanner';
import SkillShapeCard from "/imports/ui/componentHelpers/skillShapeCard"
import { ContainerLoader } from '/imports/ui/loading/container';
import ClassTypeList from '/imports/ui/components/landing/components/classType/classTypeList.jsx';
import ConfirmationModal from '/imports/ui/modal/confirmationModal';

export default function() {
  return (
      <Grid container>
      </Grid>
   )
}
