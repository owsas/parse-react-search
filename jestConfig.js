/* eslint-disable */

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Parse from 'parse';

require('dotenv').config();

Enzyme.configure({ adapter: new Adapter() });

Parse.serverURL = process.env.SERVER_URL;
Parse.initialize(process.env.APP_ID, process.env.JS_KEY);

const localCaches = {};
window.localStorage = {};

Object.assign(window.localStorage, {
  setItem: (key, value) => {
    localCaches[key] = value;
  },
  getItem: (key) => {
    return localCaches[key];
  },
});
