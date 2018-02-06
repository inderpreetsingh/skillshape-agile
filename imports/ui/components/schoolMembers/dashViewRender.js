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
import { mailFolderListItems } from './tileData';


export default function DashViewRender() {
  console.log("ahahaaaaaa",this.props)
  const { classes, theme } = this.props;

  const drawer = (
      <div>
        <List>{mailFolderListItems}</List>
        <Divider />
      </div>
    );
  return (
      <div style={{display: "flex"}}>
        <div>
          <Hidden mdUp>
              {drawer}
          </Hidden>
          <Hidden smDown>
              {drawer}
          </Hidden>
        </div>
        <div>
          <main>
            <Typography noWrap>{'You think water moves fast? You should see ice.'}</Typography>
          </main>
        </div>
      </div>
    )
}
