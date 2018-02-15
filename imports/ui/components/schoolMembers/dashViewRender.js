import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import List from 'material-ui/List';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Hidden from 'material-ui/Hidden';
import Divider from 'material-ui/Divider';
import MenuIcon from 'material-ui-icons/Menu';
import {Fragment} from 'react';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';

import SchoolMemberListItems from './tileData';
import  SchoolMemberFilter  from "./filter";
import MemberDialogBox from "/imports/ui/components/landing/components/dialogs/MemberDetails.jsx";


export default function DashViewRender() {
  console.log("ahahaaaaaa",this.props)
  const { classes, theme, schoolMemberDetails,membersByName, schoolData} = this.props;
  const { renderStudentModal } = this.state;
  console.log("membersByName111111111111",membersByName)
  const drawer = (
      <div style={{width:'100%'}}>
        <List><SchoolMemberListItems membersByName={membersByName} filters={schoolData && {schoolId:schoolData._id}}/></List>
        <Divider />
      </div>
    );
  return (
      <Grid container className="containerDiv" style={{position:'relative',backgroundColor: '#fff'}}>
        <Grid item sm={4} xs={12} md={4} className="leftSideMenu" style={{border: 'solid 1px #ddd'}}>
          <SchoolMemberFilter
              stickyPosition={this.state.sticky}
              ref="ClaimSchoolFilter"
              {...this.props}
              handleSkillCategoryChange={this.handleSkillCategoryChange}
              onLocationChange={this.onLocationChange}
              handleSchoolNameChange={this.handleSchoolNameChange}
              locationInputChanged={this.locationInputChanged}
          />
          <form noValidate autoComplete="off">
            {
              renderStudentModal &&
              <MemberDialogBox
                open={renderStudentModal}
                onModalClose={() => this.handleMemberDialogBoxState(false)}
                renderStudentAddModal = {this.renderStudentAddModal}
              />
            }
          </form>
          <Grid item sm={12} xs={12} md={12} style={{display:'flex',flexDirection: 'row-reverse'}}>
            <Button raised color="primary" onClick={()=>this.setState({renderStudentModal:true})}>
              Add New Student
            </Button>
          </Grid>
              <div>
                <Grid container style={{minWidth: '230px',fontSize: '12px',overflowY: 'scroll',height: '300px'}}>
                  Students
                  <Hidden mdUp>
                      {drawer}
                  </Hidden>
                  <Hidden smDown>
                      {drawer}
                  </Hidden>
                </Grid>
              </div>
        </Grid>
        <Grid item sm={8} xs={12} md={8} className="rightPanel">
          <Grid container className="userInfoPanel" style={{display: 'flex',background: '#9cd1ff'}}>
            <Grid item sm={4} xs={12} md={4} >
              <div className="avtar">
                <img src="/images/avatar.jpg"/>
              </div>
            </Grid>
            <Grid item sm={8} xs={12} md={8} >
              <div className="notes">
                Notes:
              </div>
            </Grid>
          </Grid>
          <Grid container style={{backgroundColor: 'rebeccapurple'}}>
            <Grid item>
              <Fragment>
                <Button raised color="primary">
                  Call
                </Button>
                <Button raised color="accent">
                  Email
                </Button>
                <Button raised color="primary">
                  Edit
                </Button>
              </Fragment>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
}
