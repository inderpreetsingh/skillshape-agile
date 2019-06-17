import { isEmpty } from 'lodash';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { browserHistory } from 'react-router';
import LoginButton from './buttons/LoginButton';
import { specialFont } from './jss/helpers';
import NestedNavItems from './NestedNavItems';
import SchoolsIAttend from './schoolsIAttend';
import SchoolSubMenu from './schoolSubMenu';
import SecondaryButton from '/imports/ui/components/landing/components/buttons/SecondaryButton';
import { OnBoardingDialogBox } from '/imports/ui/components/landing/components/dialogs';
import ContactUsPage from '/imports/ui/pages/ContactUsPage';
import { checkSuperAdmin, logoutUser } from '/imports/util';
import { getUserFullName } from '/imports/util/getUserData';

const styles = theme => ({
  drawerList: {
    width: '300px',
  },
  menuListItemText: {
    fontFamily: specialFont,
  },
  drawerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 8px',
  },
  nested: {
    paddingLeft: theme.spacing.unit * 8,
  },
  nestedLevel2: {
    paddingLeft: theme.spacing.unit * 5,
  },
});

const DrawerHeader = props => (
  <div className={props.drawerHeader}>
    <IconButton className="ss-icon-button" onClick={props.handleDrawer}>
      close
    </IconButton>
    {props.currentUser && (
      <SecondaryButton icon iconName="exit_to_app" label="Logout" onClick={logoutUser} />
    )}
  </div>
);

const SideNavItem = props => (
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

const LogOutUserSideNav = props => (
  <Fragment>
    <SideNavItem
      button
      menuListItemText={props.classes.menuListItemText}
      name="Home"
      iconName="home"
      onClick={() => props.childItemOnClick('/')}
    />
    <SideNavItem
      button
      menuListItemText={props.classes.menuListItemText}
      name="SkillShape for Schools"
      iconName="school"
      onClick={() => props.childItemOnClick('/skillshape-for-school')}
    />
    <SideNavItem
      button
      menuListItemText={props.classes.menuListItemText}
      name="Find a School"
      iconName="find_in_page"
      onClick={() => props.childItemOnClick('/')}
    />
    <SideNavItem
      button
      menuListItemText={props.classes.menuListItemText}
      onClick={() => props.handleSignUpDialogBox(true, 'Student')}
      name="Student Sign Up"
      iconName="assignment_ind"
      itemType="http://schema.org/RegisterAction"
    />
    <SideNavItem
      button
      menuListItemText={props.classes.menuListItemText}
      onClick={() => props.handleSignUpDialogBox(true, 'School')}
      name="Register a School"
      iconName="school"
      itemType="http://schema.org/RegisterAction"
    />
    <SideNavItem
      button
      menuListItemText={props.classes.menuListItemText}
      name="Contact Us"
      iconName="email"
      onClick={() => props.childItemOnClick('/contact-us')}
    />
  </Fragment>
);

const LoginUserSideNav = (props) => {
  const currentUser = Meteor.user();
  const isSchool = currentUser && currentUser.profile && currentUser.profile.userType === 'School';

  const childData = [
    {
      name: 'My Profile',
      link: `/profile/${Meteor.userId()}`,
      iconName: 'account_circle',
    },
    {
      name: 'My Media',
      link: `/media/${Meteor.userId()}`,
      iconName: 'collections',
    },
  ];
  if (Meteor.settings.public.paymentEnabled) {
    childData.push(
      {
        name: 'My Subscriptions',
        link: `/mySubscription/${Meteor.userId()}`,
        iconName: 'collections',
      },
      {
        name: 'My Transactions',
        link: `/myTransaction/${Meteor.userId()}`,
        iconName: 'collections',
      },
    );
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
      {isSchool && (
        <SideNavItem
          button
          menuListItemText={props.classes.menuListItemText}
          name="My Dashboard"
          iconName="dashboard"
          onClick={() => props.childItemOnClick('/dashboard')}
        />
      )}

      <SideNavItem
        button
        menuListItemText={props.classes.menuListItemText}
        name="My Calendar"
        iconName="perm_contact_calendar"
        onClick={() => props.childItemOnClick('/MyCalendar')}
      />
      <SideNavItem
        button
        menuListItemText={props.classes.menuListItemText}
        name="My Classmates"
        iconName="find_in_page"
        onClick={() => props.childItemOnClick('/classmates')}
      />
      {!isEmpty(props.schoolsIAttend) && (
        <SchoolsIAttend
          data={props.schoolsIAttend}
          classes={props.classes}
          onClick={props.childItemOnClick}
          currentUser={props.currentUser}
        />
      )}
      {!isEmpty(props.mySchool) && (
        <SchoolSubMenu
          data={props.mySchool}
          classes={props.classes}
          onClick={props.childItemOnClick}
          currentUser={props.currentUser}
        />
      )}

      <SideNavItem
        button
        menuListItemText={props.classes.menuListItemText}
        name="SkillShape for Schools"
        iconName="school"
        onClick={() => props.childItemOnClick('/skillshape-for-school')}
      />
      <SideNavItem
        button
        menuListItemText={props.classes.menuListItemText}
        name="Find a School"
        iconName="find_in_page"
        onClick={() => props.childItemOnClick('/') /* browserHistory.push('/') */}
      />
      <SideNavItem
        button
        menuListItemText={props.classes.menuListItemText}
        name="Send us feedback"
        iconName="message"
        onClick={() => props.handleSetState({ contactUsPage: true })}
      />
      <SideNavItem
        button
        menuListItemText={props.classes.menuListItemText}
        name="Add or Claim a School"
        iconName="add_box"
        onClick={() => props.handleSetState({ onBoardingDialogBox: true })}
      />
      {checkSuperAdmin(props.currentUser) && (
        <Fragment>
          <SideNavItem
            button
            menuListItemText={props.classes.menuListItemText}
            name="User Suggestions"
            iconName="notification_important"
            onClick={() => props.childItemOnClick('/school-suggestions')}
          />
          <SideNavItem
            button
            menuListItemText={props.classes.menuListItemText}
            name="Upload Schools"
            iconName="file_upload"
            onClick={() => props.childItemOnClick('/SchoolUpload')}
          />
          <SideNavItem
            button
            menuListItemText={props.classes.menuListItemText}
            name="Optimization"
            iconName="motorcycle"
            onClick={() => props.childItemOnClick('/optimization')}
          />
          <SideNavItem
            button
            menuListItemText={props.classes.menuListItemText}
            name="Manage Users"
            iconName="supervisor_account"
            onClick={() => props.childItemOnClick('/manage-users')}
          />
        </Fragment>
      )}
    </Fragment>
  );
};

class SideNavItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mySchool: [],
      connectedSchool: [],
    };
  }

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
    Meteor.call('school.getConnectedSchool', Meteor.userId(), (error, result) => {
      if (error) {
        // console.log("error", error);
      }
      if (result) {
        const connectedSchool = result.map((school, index) => ({
          name: school.name,
          link: `/schools/${school.slug}`,
          iconName: 'school',
          nameLimit: 17,
          schoolEditLink: `/SchoolAdmin/${school._id}/edit`,
        }));
        this.setState({ connectedSchool });
      }
    });
  };

  loadMySchool = () => {
    const userId = Meteor.userId();
    if (userId) {
      Meteor.call('school.getMySchool', null, false, (error, result) => {
        Meteor.call('classInterest.getSchoolsIAttend', { userId }, (err, res) => {
          if (!err) {
            const mySchool = result
              && result.map((school, index) => ({
                name: school.name,
                link: `/schools/${school.slug}`,
                iconName: 'school',
                schoolEditLink: `/SchoolAdmin/${school._id}/edit`,
                superAdmin: school.superAdmin,
                admins: school.admins,
              }));
            const schoolsIAttend = res
              && res.map((school, index) => ({
                name: school.name,
                link: `/schools/${school.slug}`,
                iconName: 'school',
              }));
            this.setState({ mySchool, schoolsIAttend });
          }
        });
      });
    }
  };

  handleChildItemOnClick = (link) => {
    // console.log("handleChildItemOnClick")
    browserHistory.push(link);
    this.props.handleDrawer();
  };

  handleSetState = (obj) => {
    this.setState(obj);
  };

  render() {
    const { onBoardingDialogBox, contactUsPage } = this.state;
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
            currentUser={this.props.currentUser}
            handleDrawer={this.props.handleDrawer}
            drawerHeader={this.props.classes.drawerHeader}
          />
          <Divider />
          {onBoardingDialogBox && (
            <OnBoardingDialogBox
              open={onBoardingDialogBox}
              onModalClose={() => {
                this.setState({ onBoardingDialogBox: false });
              }}
            />
          )}
          {contactUsPage && (
            <ContactUsPage
              open={contactUsPage}
              onModalClose={() => {
                this.setState({ contactUsPage: false });
              }}
            />
          )}
          {this.props.currentUser ? (
            <LoginUserSideNav
              mySchool={this.state.mySchool}
              schoolsIAttend={this.state.schoolsIAttend}
              connectedSchool={this.state.connectedSchool}
              childItemOnClick={this.handleChildItemOnClick}
              handleSetState={this.handleSetState}
              {...this.props}
            />
          ) : (
            <LogOutUserSideNav {...this.props} childItemOnClick={this.handleChildItemOnClick} />
          )}
          <SideNavItem>
            <LoginButton
              fullWidth
              icon
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
  handleDrawer: PropTypes.func.isRequired,
};

SideNavItem.propTypes = {
  name: PropTypes.string,
  iconName: PropTypes.string,
  button: PropTypes.bool,
  children: PropTypes.element,
  menuListItemText: PropTypes.string,
  itemType: PropTypes.string,
  itemProp: PropTypes.string,
  onClick: PropTypes.func,
};

SideNavItems.defaultProps = {
  itemType: 'Thing',
  itemProp: 'name',
};

SideNavItems.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleSignUpDialogBox: PropTypes.func,
  handleChangePasswordDialogBox: PropTypes.func,
};

export default withStyles(styles)(SideNavItems);
