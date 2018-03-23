import React from 'react';
import DocumentTitle from 'react-document-title';
import Typography from 'material-ui/Typography';
import { checkSuperAdmin } from '/imports/util';

import Preloader from '/imports/ui/components/landing/components/Preloader.jsx';
import UsersList from './UsersList';

class ManageUsers extends React.Component {

	render() {
		const { currentUser, isUserSubsReady } = this.props;

		if(!isUserSubsReady)
			return <Preloader/>

	    if(checkSuperAdmin(currentUser)) {
			return (
				<DocumentTitle title={this.props.route.name}>
					<div style={{minHeight: '100vh'}}>
						<UsersList/>
					</div>
				</DocumentTitle>
			)
	    } else {
	        return  <Typography type="display2" gutterBottom align="center">
	            Access Denied!!!
	        </Typography>
	    }

	}
}

export default ManageUsers