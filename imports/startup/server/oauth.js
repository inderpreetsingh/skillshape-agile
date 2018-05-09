Meteor.startup(() => {

	ServiceConfiguration.configurations.upsert({
	    service: 'facebook'
	}, {
	    $set: {
	        appId: Meteor.settings.facebook.auth.appId,
	        secret: Meteor.settings.facebook.auth.secret
	    }
	});

	ServiceConfiguration.configurations.upsert({
	    service: 'google'
	}, {
	    $set: {
	        clientId: Meteor.settings.google.auth.appId,
	        loginStyle: Meteor.settings.google.auth.loginStyle,
	        secret: Meteor.settings.google.auth.secret
	    }
	});
	// Start crone job for sending the email.
	SyncedCron.start();
})
