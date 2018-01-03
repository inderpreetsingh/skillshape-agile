import config from "/imports/config";

export const sendPackagePurchaseEmail = function({to, buyer, packageName }) {
    Email.send({
        to: to,
        from: config.fromEmailForPurchasePackage,
        subject: 'Package Purchase Request Recieved',
        html: `<b>${buyer}</b> has requested this package : <b>${packageName}</b>`
    });
}