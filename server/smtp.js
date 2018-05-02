Meteor.startup(function () {
    smtp = {
        username: Meteor.settings.SMTPUsername,   // eg: server@gentlenode.com
        password: Meteor.settings.SMTPPassword,   // eg: 3eeP1gtizk5eziohfervU
        server:   'smtp.gmail.com',  // eg: mail.gandi.net
        port: 587
    }
    process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;


});


// Meteor.startup(function () {
//     smtp = {
//         username: 'jayeshdalwadi2007@gmail.com',   // eg: server@gentlenode.com
//         password: '1234567bond',   // eg: 3eeP1gtizk5eziohfervU
//         server:   'smtp.gmail.com',  // eg: mail.gandi.net
//         port: 465
//     }
//     process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
// });
