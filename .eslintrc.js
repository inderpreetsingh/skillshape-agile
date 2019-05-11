module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['airbnb',"plugin:meteor/recommended"],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    Meteor:true,
    Mongo:true,
    SimpleSchema:true,
    SyncedCron:true,
    checkMyAccess:true,
    Package:true,
    _ReactiveJoins:true
  },
  parser: "babel-eslint",
  parserOptions: {
    parser: "babel-eslint",
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    "meteor"
  ],
  rules: {
    "import/no-unresolved":0,
    "import/no-absolute-path":0,
    "no-underscore-dangle":0,
    "camelcase":0,
    'no-plusplus': [2, { allowForLoopAfterthoughts: true }]
  },
  
};
