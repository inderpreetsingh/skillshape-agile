import React from 'react';
import Button from 'material-ui/Button';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';

import muiTheme from './components/jss/muitheme.jsx';

const styles = (theme) => {
  console.info('theme....',theme);
  return {
    root: {
      color: theme.palette.primary
    }
  }
}

const TestTheme = (props) => (
  <Button className={props.classes.root}>Hello</Button>
);

export default withStyles(styles)(TestTheme);
