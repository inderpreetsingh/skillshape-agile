import React from 'react';
import { ContainerLoader } from '/imports/ui/loading/container.js';
import OAuthRender from "./oAuthComponentRender";
import {withPopUp,handleLoginGoogle,handleLoginFacebook,redirectToHome} from '/imports/util';
import { createContainer } from 'meteor/react-meteor-data';
import {isEmpty} from "lodash";

class OAuthComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	componentDidMount() {
		this.handleSocialSites(this.props);
	}

	componentWillReceiveProps(nextProps){
		this.handleSocialSites(nextProps);
	}

	handleSocialSites = (props) =>{
		const {params:{serviceName},servicesLoaded,currentUser={}} = props;
		if(servicesLoaded && isEmpty(currentUser)){
			if(serviceName == 'google'){
				handleLoginGoogle.call(this);
			}else if(serviceName == 'facebook'){
				handleLoginFacebook.call(this);
			}
		}else if(!isEmpty(currentUser)){
			redirectToHome();
		}
	}
	render() {
		const {errorText} = this.state;
		return (
			<React.Suspense fallback={<ContainerLoader />}>
					<OAuthRender
					errorText={errorText}
					/>
			</React.Suspense>
		);
	}
}
export default createContainer((props) => {
	return {
		servicesLoaded:Accounts.loginServicesConfigured(),
		...props
	};
}, withPopUp(OAuthComponent));

