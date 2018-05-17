import React from 'react';
import { render } from 'react-dom';
import 'babel-polyfill'; // eslint-disable-line
import Parse from 'parse';

// import SearchInput from '../src/SearchInput';
import ParseReactSearch from '../src/ParseReactSearch';

Parse.serverURL = process.env.SERVER_URL;
Parse.initialize(process.env.APP_ID, process.env.JS_KEY);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    ParseReactSearch.configure({
      _User: {
        search: 'name',
      },
    });
  }

  render() {
    return (
      <div>Hola </div>
    );
  }
}

render(<App />, document.getElementById('root'));
