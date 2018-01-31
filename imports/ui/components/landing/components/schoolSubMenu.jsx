import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isArray, size } from 'lodash';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Collapse from 'material-ui/transitions/Collapse';
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';
import Icon from 'material-ui/Icon';

import NestedNavItems from './NestedNavItems';

class SchoolSubMenu extends React.Component {

	state = { open: false };

  	handleClick = () => {
    	this.setState({ open: !this.state.open });
  	}

	render() {
		const { data, classes } = this.props;
		return (
			<Fragment>
			 	{

	                size(data) < 6 ? (
	                    data.map((school, index)=> {
	                        return  <NestedNavItems
	                            key={`${school.name}-${index}`}
	                            button
	                            name={school.name}
	                            classes={classes}
	                            iconName="school"
	                            childData={[
	                            	{
								        name: "Home Page",
								        link: school.link,
								        iconName: null,
								    }
	                            ]}
	                            onClick={this.props.onClick}
	                        />
	                    })

		            ) : (
                        	<Fragment>
                        		<ListItem onClick={this.handleClick}>
                        			<ListItemIcon>
					                	<Icon>school</Icon>
					           		 </ListItemIcon>
					            	<ListItemText classes={{text: classes.menuListItemText}} primary={"School You Manage"} />
                        			{ this.state.open ? <ExpandLess /> : <ExpandMore /> }
                        		</ListItem>
		                        <Collapse component="li" in={this.state.open} timeout="auto" unmountOnExit>
				            		<List disablePadding>
			                        {
						    			data.map((school, index) => {
							    			return  <NestedNavItems
					                            key={`${school.name}-${index}`}
					                            button
					                            name={school.name}
					                            classes={classes}
					                            childData={[
					                            	{
												        name: "Home Page",
												        link: school.link,
												        iconName: null,
												    }
					                            ]}
					                            onClick={this.props.onClick}
					                        />
							    		})
						    		}
		                        	</List>
				        		</Collapse>
                        	</Fragment>
	                )

		        }

			</Fragment>
		)
	}
}

export default SchoolSubMenu