import React, { Fragment, Component} from 'react';
import PropTypes from 'prop-types';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Collapse from 'material-ui/transitions/Collapse';
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';
import Icon from 'material-ui/Icon';
import { isEmpty } from 'lodash';

class NestedNavItems extends Component {
	state = { open: false };

  	handleClick = () => {
    	this.setState({ open: !this.state.open });
  	}

  	render() {
  		const { classes, childData } = this.props;
  		return (
  			<Fragment>
  				<ListItem onClick={this.handleClick}>
			        {
				       this.props.children ? this.props.children :
				       <Fragment>
				            <ListItemIcon>
				                <Icon>{this.props.iconName}</Icon>
				            </ListItemIcon>
				            <ListItemText classes={{text: classes.menuListItemText}} primary={this.props.name} />
				        </Fragment>
			        }
			        { this.state.open ? <ExpandLess /> : <ExpandMore /> }
			    </ListItem>
			    {
			    	!isEmpty(childData) && (
				        <Collapse component="li" in={this.state.open} timeout="auto" unmountOnExit>
				            <List disablePadding>
					    		{
					    			childData.map((data, index) => {
						    			return (
								            <ListItem button={this.props.button ? this.props.button : false} onClick={() => this.props.onClick(data.link)}>
								                <ListItemIcon>
								                	<Icon>{data.iconName}</Icon>
								              	</ListItemIcon>
								                <ListItemText classes={{text: classes.menuListItemText}} primary={data.name} />
								            </ListItem>
									    )
						    		})
					    		}
				            </List>
				        </Collapse>
			    	)
			    }
  			</Fragment>
  		)
  	}
}

const nestedItemStructure = PropTypes.shape({
    name: PropTypes.string,
    iconName: PropTypes.string,
    link: PropTypes.string,
});

NestedNavItems.propTypes = {
    button: PropTypes.bool,
    name: PropTypes.string,
    iconName: PropTypes.string,
    childData: PropTypes.arrayOf(nestedItemStructure),
    onClick: PropTypes.func,
    classes: PropTypes.object,
}

export default NestedNavItems