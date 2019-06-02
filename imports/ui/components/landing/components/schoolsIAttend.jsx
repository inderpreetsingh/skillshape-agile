import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';
import Icon from 'material-ui/Icon';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Collapse from 'material-ui/transitions/Collapse';
import React, { Fragment } from 'react';
import NestedNavItems from './NestedNavItems';

class SchoolsIAttend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    const { data, classes } = this.props;
    return (
      <Fragment>
        <ListItem onClick={this.handleClick}>
          <ListItemIcon>
            <Icon>dashboard</Icon>
          </ListItemIcon>
          <ListItemText classes={{ text: classes.menuListItemText }} primary="Schools I Attend" />
          {this.state.open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse component="li" in={this.state.open} timeout="auto" unmountOnExit>
          <List className={classes.nestedLevel2} disablePadding>
            {data.map((school, index) => (
              <NestedNavItems
                key={`${school.name}-${index}`}
                button
                name={school.name}
                nameLimit={13}
                link={school.link}
                iconName="school"
                classes={classes}
                onClick={this.props.onClick}
              />
            ))}
          </List>
        </Collapse>
      </Fragment>
    );
  }
}

export default SchoolsIAttend;
