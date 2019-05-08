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
    SimpleSchema:true
  },
  "parser": "babel-eslint",
  parserOptions: {
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
    "no-underscore-dangle":0
  },
  
};
