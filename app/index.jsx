import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';

import './assets/styles/App.less';
import 'jquery';
import 'semantic';

// Filterable CheatSheet Component
ReactDOM.render(<App />, document.getElementById('content'));