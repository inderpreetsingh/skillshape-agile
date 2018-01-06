import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import  { withStyles } from 'material-ui/styles';

import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

import LoginButton from './buttons/LoginButton.jsx';
import {specialFont} from './jss/helpers.js';

const styles = {
    drawerList : {
        width : '300px',
    },
    menuListItemText: {
        fontFamily: specialFont
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
    }
}

const DrawerHeader = (props) => (
  <div className={props.drawerHeader}>
    <IconButton onClick={props.handleDrawer}>close</IconButton>
  </div>
);

const SideNavItem = (props) => {
    return(
    <ListItem button={props.button ? props.button : false} onClick={props.onClick}>
      {
       props.children ? props.children : 
       <Fragment>
            <ListItemIcon>
                <Icon>{props.iconName}</Icon>
            </ListItemIcon>
            <ListItemText classes={{text: props.menuListItemText}} primary={props.name} />
        </Fragment>}
    </ListItem>    
    );
}

const SideNavItems = (props) => (
    <Drawer open={props.open} anchor="right" onRequestClose={props.handleDrawer}>
        <List className={props.classes.drawerList}>
            <DrawerHeader handleDrawer={props.handleDrawer} drawerHeader={props.classes.drawerHeader}/>
            <Divider />    
            <SideNavItem button menuListItemText={props.classes.menuListItemText} name="Home" iconName="home" />
            <SideNavItem button menuListItemText={props.classes.menuListItemText} name="Student Sign Up" iconName="assignment_ind" />
            <SideNavItem button menuListItemText={props.classes.menuListItemText} onClick={props.handleSignUpDialogBox} name="Register" iconName="school" />
            <SideNavItem button menuListItemText={props.classes.menuListItemText} name="Claim A School" iconName="check_circle" />
            <SideNavItem button menuListItemText={props.classes.menuListItemText} name="Contact Us" iconName="email" />
            <SideNavItem >
                <LoginButton fullWidth={true} icon={true} iconName="fingerprint" label="Log In" />
            </SideNavItem>
        </List>
    </Drawer>
);

DrawerHeader.propTypes = {
    drawerHeader: PropTypes.string,
    handleDrawer: PropTypes.func.isRequired,
}

SideNavItem.propTypes = {
    name: PropTypes.string,
    iconName: PropTypes.string,
    button: PropTypes.bool,
    children: PropTypes.element,
    menuListItemText: PropTypes.string,
    onClick: PropTypes.func,
}

SideNavItems.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    handleSignUpDialogBox: PropTypes.func
}

export default withStyles(styles)(SideNavItems);