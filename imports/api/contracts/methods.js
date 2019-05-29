import { check } from 'meteor/check';
import Contracts from './fields';
import { sendContractCancelledEmail } from '/imports/api/email';
import School from '/imports/api/school/fields';
import Purchases from '/imports/api/purchases/fields';

const stripe = require('stripe')(Meteor.settings.stripe.PRIVATE_KEY);

Meteor.methods({
  'Contracts.handleRecords': function (doc = {}) {
    check(doc, Object);
    const {
      action, _id, purchaseId, schoolId, userName, packageName, payAsYouGo,
    } = doc;
    doc.createdAt = new Date();
    if (action == 'add') {
      const schoolData = School.findOne({ _id: schoolId });
      const { name, email } = schoolData;
      sendContractCancelledEmail({
        userName, packageName, to: email, schoolName: name,
      });
      return Contracts.insert(doc);
    } if (action == 'update') {
      if (doc.status == 'allowed') {
        Meteor.call('purchases.addTransactionEntry', purchaseId, 'contractCancelled');
        if (!payAsYouGo) {
          cancelSubscription(purchaseId);
        }
      }
      return Contracts.update({ _id }, { $set: doc });
    }
    if (action == 'find') {
      const { userId, purchaseId } = doc;
      return Contracts.findOne({ userId, purchaseId });
    }
  },
});
const cancelSubscription = (_id) => {
  const { subscriptionId } = Purchases.findOne({ _id });
  if (subscriptionId) {
    stripe.subscriptions.del(
      subscriptionId,
      Meteor.bindEnvironment((err, confirmation) => {
        if (confirmation) {
          Purchases.update({ subscriptionId }, { $set: { subscriptionCancelResponse: confirmation } });
        }
      }),
    );
  }
};
