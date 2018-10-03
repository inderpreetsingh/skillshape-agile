import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { browserHistory } from "react-router";
import { get, isEmpty, size } from "lodash";

import Drawer from "material-ui/Drawer";
import Divider from "material-ui/Divider";
import Icon from "material-ui/Icon";
import IconButton from "material-ui/IconButton";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";

import LoginButton from "./buttons/LoginButton.jsx";
import { specialFont } from "./jss/helpers.js";
import { checkSuperAdmin, getUserSchool } from "/imports/util";
import NestedNavItems from "./NestedNavItems";
import SchoolSubMenu from "./schoolSubMenu";
import { getUserFullName } from "/imports/util/getUserData";

const styles = theme => {
  return {
    drawerList: {
      width: "300px"
    },
    menuListItemText: {
      fontFamily: specialFont
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: "0 8px"
    },
    nested: {
      paddingLeft: theme.spacing.unit * 8
    },
    nestedLevel2: {
      paddingLeft: theme.spacing.unit * 5
    }
  };
};

const DrawerHeader = props => (
  <div className={props.drawerHeader}>
    <IconButton onClick={props.handleDrawer}>close</IconButton>
  </div>
);

const SideNavItem = props => {
  return (
    <ListItem
      button={props.button ? props.button : false}
      onClick={props.onClick}
      itemScope
      itemType={props.itemType}
    >
      {props.children ? (
        props.children
      ) : (
        <Fragment>
          <ListItemIcon>
            <Icon>{props.iconName}</Icon>
          </ListItemIcon>
          <ListItemText
            classes={{ text: props.menuListItemText }}
            primary={props.name}
            itemProp={props.itemProp}
          />
        </Fragment>
      )}
    </ListItem>
  );
};

const LogOutUserSideNav = props => (
  <Fragment>
    <SideNavItem
      button
      menuListItemText={props.classes.menuListItemText}
      name="Home"
      iconName="home"
      onClick={() => props.childItemOnClick("/")}
    />
    <SideNavItem
      button
      menuListItemText={props.classes.menuListItemText}
      name="Find a School"
      iconName="find_in_page"
      onClick={() => props.childItemOnClick("/")}
    />
    <SideNavItem
      button
      menuListItemText={props.classes.menuListItemText}
      onClick={() => props.handleSignUpDialogBox(true, "Student")}
      name="Student Sign Up"
      iconName="assignment_ind"
      itemType="http://schema.org/RegisterAction"
    />
    <SideNavItem
      button
      menuListItemText={props.classes.menuListItemText}
      onClick={() => props.handleSignUpDialogBox(true, "School")}
      name="Register a School"
      iconName="school"
      itemType="http://schema.org/RegisterAction"
    />
    <SideNavItem
      button
      menuListItemText={props.classes.menuListItemText}
      name="Claim A School"
      iconName="check_circle"
      onClick={() => props.childItemOnClick("/claimSchool")}
    />
    <SideNavItem
      button
      menuListItemText={props.classes.menuListItemText}
      name="Contact Us"
      iconName="email"
      onClick={() => props.childItemOnClick("/contact-us")}
    />
  </Fragment>
);

const LoginUserSideNav = props => {
  let childData = [
    {
      name: "My Profile",
      link: `/profile/${Meteor.userId()}`,
      iconName: "account_circle"
    },
    {
      name: "My Media",
      link: `/media/${Meteor.userId()}`,
      iconName: "collections"
    },
    {
      name: "Change Password",
      iconName: "lock_open",
      onClick: props.showChangePassword
    }
  ];
  if (Meteor.settings.public.paymentEnabled) {
    childData.push({
      name: "My Subscription",
      link: `/mySubscription/${Meteor.userId()}`,
      iconName: "collections"
    });
  }
  return (
    <Fragment>
      <NestedNavItems
        button
        name={getUserFullName(props.currentUser)}
        classes={props.classes}
        iconName="person"
        childData={childData}
        onClick={props.childItemOnClick}
      />
      <SideNavItem
        button
        menuListItemText={props.classes.menuListItemText}
        name="My Calendar"
        iconName="perm_contact_calendar"
        onClick={() => props.childItemOnClick("/MyCalendar")}
      />
      <SideNavItem
        button
        menuListItemText={props.classes.menuListItemText}
        name="My Classmates"
        iconName="find_in_page"
        onClick={() => props.childItemOnClick("/classmates")}
      />
      {!isEmpty(props.mySchool) && (
        <SchoolSubMenu
          data={props.mySchool}
          classes={props.classes}
          onClick={props.childItemOnClick}
          currentUser={props.currentUser}
        />
      )}

      <NestedNavItems
        button
        name="Classes Attending"
        classes={props.classes}
        iconName="account_balance"
        childData={props.connectedSchool}
        onClick={props.childItemOnClick}
      />
      <SideNavItem
        button
        menuListItemText={props.classes.menuListItemText}
        name="Find a School"
        iconName="find_in_page"
        onClick={() => props.childItemOnClick("/") /*browserHistory.push('/')*/}
      />
      <SideNavItem
        button
        menuListItemText={props.classes.menuListItemText}
        name="Claim a School"
        iconName="assignment"
        onClick={
          () =>
            props.childItemOnClick(
              "/claimSchool"
            ) /*browserHistory.push('/claimSchool')*/
        }
      />
      <SideNavItem
        button
        menuListItemText={props.classes.menuListItemText}
        name="Send us feedback"
        iconName="message"
        onClick={
          () =>
            props.childItemOnClick(
              "/contact-us"
            ) /*browserHistory.push('/contact-us')*/
        }
      />
      <SideNavItem
        button
        menuListItemText={props.classes.menuListItemText}
        name="Add Schools"
        iconName="add_box"
        onClick={
          () =>
            props.childItemOnClick(
              "/claimSchool"
            ) /*browserHistory.push('/claimSchool')*/
        }
      />
      {checkSuperAdmin(props.currentUser) && (
        <Fragment>
          <SideNavItem
            button
            menuListItemText={props.classes.menuListItemText}
            name="User Suggestions"
            iconName="notification_important"
            onClick={() => props.childItemOnClick("/school-suggestions")}
          />
          <SideNavItem
            button
            menuListItemText={props.classes.menuListItemText}
            name="Upload Schools"
            iconName="file_upload"
            onClick={() => props.childItemOnClick("/SchoolUpload")}
          />
          <SideNavItem
            button
            menuListItemText={props.classes.menuListItemText}
            name="Optimization"
            iconName="motorcycle"
            onClick={() => props.childItemOnClick("/optimization")}
          />
          <SideNavItem
            button
            menuListItemText={props.classes.menuListItemText}
            name="Manage Users"
            iconName="supervisor_account"
            onClick={() => props.childItemOnClick("/manage-users")}
          />
        </Fragment>
      )}
    </Fragment>
  );
};

class SideNavItems extends React.Component {
  state = {
    mySchool: [],
    connectedSchool: []
  };

  componentWillMount() {
    if (Meteor.userId()) {
      this.loadConnectedSchool();
      this.loadMySchool();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { currentUser } = this.props;
    if (currentUser !== nextProps.currentUser) {
      this.loadConnectedSchool();
      this.loadMySchool();
    }
  }

  loadConnectedSchool = () => {
    Meteor.call(
      "school.getConnectedSchool",
      Meteor.userId(),
      (error, result) => {
        if (error) {
          // console.log("error", error);
        }
        if (result) {
          const connectedSchool = result.map((school, index) => {
            return {
              name: school.name,
              link: `/schools/${school.slug}`,
              iconName: "school",
              nameLimit: 17,
              schoolEditLink: `/SchoolAdmin/${school._id}/edit`
            };
          });
          this.setState({ connectedSchool: connectedSchool });
        }
      }
    );
  };

  loadMySchool = () => {
    if (Meteor.userId()) {
      Meteor.call("school.getMySchool",null,false, (error, result) => {
        if (error) {
          // console.log("error", error);
        }
        if (result) {
          {
          }
          const mySchool = result.map((school, index) => {
            return {
              name: school.name,
              link: `/schools/${school.slug}`,
              iconName: "school",
              schoolEditLink: `/SchoolAdmin/${school._id}/edit`,
              superAdmin: school && school.superAdmin,
              admins: school.admins
            };
          });
          this.setState({ mySchool: mySchool });
        }
      });
    }
  };

  handleChildItemOnClick = link => {
    // console.log("handleChildItemOnClick")
    browserHistory.push(link);
    this.props.handleDrawer();
  };

  render() {
    return (
      <Drawer
        open={this.props.open}
        anchor="right"
        onClose={this.props.handleDrawer}
        itemScope
        itemType="http://schema.org/WPSideBar"
      >
        <List className={this.props.classes.drawerList}>
          <DrawerHeader
            handleDrawer={this.props.handleDrawer}
            drawerHeader={this.props.classes.drawerHeader}
          />
          <Divider />
          {this.props.currentUser ? (
            <LoginUserSideNav
              mySchool={this.state.mySchool}
              connectedSchool={this.state.connectedSchool}
              childItemOnClick={this.handleChildItemOnClick}
              {...this.props}
            />
          ) : (
            <LogOutUserSideNav
              {...this.props}
              childItemOnClick={this.handleChildItemOnClick}
            />
          )}
          <SideNavItem>
            <LoginButton
              fullWidth={true}
              icon={true}
              iconName="location_on"
              currentUser={this.props.currentUser}
            />
          </SideNavItem>
        </List>
      </Drawer>
    );
  }
}

DrawerHeader.propTypes = {
  drawerHeader: PropTypes.string,
  handleDrawer: PropTypes.func.isRequired
};

SideNavItem.propTypes = {
  name: PropTypes.string,
  iconName: PropTypes.string,
  button: PropTypes.bool,
  children: PropTypes.element,
  menuListItemText: PropTypes.string,
  itemType: PropTypes.string,
  itemProp: PropTypes.string,
  onClick: PropTypes.func
};

SideNavItems.defaultProps = {
  itemType: "Thing",
  itemProp: "name"
};

SideNavItems.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleSignUpDialogBox: PropTypes.func,
  handleChangePasswordDialogBox: PropTypes.func
};

export default withStyles(styles)(SideNavItems);
