import React from 'react';
import { validateImage } from '/imports/util';
import { Loading } from '/imports/ui/loading';

export default function() {
	let { currentUser } = this.props;

	if(!currentUser)
		return <Loading/>

	return (
    <div>My Profile</div>
  )
}