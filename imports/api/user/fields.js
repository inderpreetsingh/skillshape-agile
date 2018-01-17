Schema.UserProfile = new SimpleSchema({
    name: {
        type: String,
    },
    firstName: {
        optional: true,
        type: String,
    },
    lastName: {
        optional: true,
        type: String
    },
    nickame: {
        optional: true,
        type: String
    },
    url: {
        optional: true,
        type: String
    },
    phone: {
        optional: true,
        type: Number
    },
    pic: {
        optional: true,
        type: String
    },
    dob: {
        optional: true,
        type: String
    },
    address: {
        optional: true,
        type: String
    },
    gender: {
        optional: true,
        type: String
    },
    desc: {
        optional: true,
        type: String
    },
    expertise: {
        optional: true,
        type: String
    },
    state: {
        optional: true,
        type: String
    },
    user_type: {
        optional: true,
        type: String,
        allowedValues: ['C', 'P', 'S', 'T']
    },
    company_id: {
        optional: true,
        type: String
    },
    role: {
        optional: true,
        type: String
    },
    access_key: {
        type: String,
        optional: true
    },
    is_demo_user: {
        type: Boolean,
        optional: true
    },
    acess_type: {
        type: String,
        optional: true
    },
    classIds: {
        type: [String],
        optional: true
    },
    schoolId: {
        type: String,
        optional: true
    }
});

Schema.User = new SimpleSchema({
    username: {
        type: String,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    emails: {
        type: Array,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    "emails.$": {
        type: Object
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    // Use this registered_emails field if you are using splendido:meteor-accounts-emails-field / splendido:meteor-accounts-meld
    registered_emails: {
        type: Array,
        optional: true
    },
    'registered_emails.$': {
        type: Object,
        blackbox: true
    },
    createdAt: {
        type: Date,
        optional: true
    },
    profile: {
        type: Schema.UserProfile,
        optional: true
    },
    // Make sure this services field is in your schema if you're using any of the accounts packages
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    // Add `roles` to your schema if you use the meteor-roles package.
    // Option 1: Object type
    // If you specify that type as Object, you must also specify the
    // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
    // Example:
    // Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);
    // You can't mix and match adding with and without a group since
    // you will fail validation in some cases.
    roles: {
        type: Object,
        optional: true,
        blackbox: true
    },
    // Option 2: [String] type
    // If you are sure you will never need to use role groups, then
    // you can specify [String] as the type
    roles: {
        type: Array,
        optional: true
    },
    'roles.$': {
        type: String
    },
    // In order to avoid an 'Exception in setInterval callback' from Meteor
    heartbeat: {
        type: Date,
        optional: true
    }
});

Meteor.users.attachSchema(Schema.User);

Meteor.users.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
});