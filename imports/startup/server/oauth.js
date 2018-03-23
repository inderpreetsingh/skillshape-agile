Meteor.startup(() => {

	ServiceConfiguration.configurations.upsert({
	    service: 'facebook'
	}, {
	    $set: {
	        appId: '156193171830765',
	        secret: '5be68ab30fb98cbeac73c2199d61118f'
	    }
	});

	ServiceConfiguration.configurations.upsert({
	    service: 'google'
	}, {
	    $set: {
	        clientId: '696642172475-7bvf1h48domaoobbv69qktk9sq66597k.apps.googleusercontent.com',
	        loginStyle: "popup",
	        secret: 'yspUqSye1D0y0IHaDYIl1G4q'
	    }
	});
})