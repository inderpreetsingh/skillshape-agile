Meteor.startup(() => {
  ServiceConfiguration.configurations.upsert(
    {
      service: 'facebook',
    },
    {
      $set: {
        appId: Meteor.settings.facebook.auth.appId,
        secret: Meteor.settings.facebook.auth.secret,
      },
    },
  );

  ServiceConfiguration.configurations.upsert(
    {
      service: 'google',
    },
    {
      $set: {
        clientId: Meteor.settings.google.auth.appId,
        loginStyle: Meteor.settings.google.auth.loginStyle,
        secret: Meteor.settings.google.auth.secret,
      },
    },
  );
  // There is no product id in env then grab one and set it in env to use this id for plan
  if (Meteor.settings.productId) {
    Meteor.call(
      'stripe.createStripeProduct',
      Meteor.settings.productId,
    );
  }

  // Start crone job for sending the email.
  SyncedCron.start();
});
