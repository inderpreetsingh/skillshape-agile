import React from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';
import IconInput from '/imports/ui/components/landing/components/form/IconInput.jsx';
import IconSelect from '/imports/ui/components/landing/components/form/IconSelect.jsx';
import SliderControl from '/imports/ui/components/landing/components/form/SliderControl.jsx';
import IconButton from 'material-ui/IconButton';
import {FormHelperText } from 'material-ui/Form';
import Multiselect from 'react-widgets/lib/Multiselect'
import Menu, { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const MaterialInputWrapper = styled.div`
  transform: translateY(-${props => props.select ? (helpers.rhythmDiv + 2) : helpers.rhythmDiv}px);
`;

const FilterPanelAction = styled.div`
    padding:${helpers.rhythmDiv*2}px 0px;
`;

const drawerWidth = 240;

const styles = theme => ({
  root: {
    width: '100%',
    height: 430,
    marginTop: theme.spacing.unit * 3,
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  appBar: {
    position: 'absolute',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  drawerHeader: theme.mixins.toolbar,
  drawerPaper: {
    width: 250,
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      position: 'relative',
      height: '100%',
    },
  },
  content: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    padding: theme.spacing.unit * 3,
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
    },
  },
});
class AddSchoolMember extends React.Component {

    constructor(props) {
        super(props);
    }
    // Return Dash view from here
    render() {
      console.log("renderStudentModal===>",this.props)
        const { renderStudentModal } = this.props;
        return (
          <form id="addUser" onSubmit={this.props.addNewMember}>
            {renderStudentModal && this.props.renderStudentAddModal()}
          </form>
        )
    }
}


export default withStyles(styles, { withTheme: true })(AddSchoolMember);

