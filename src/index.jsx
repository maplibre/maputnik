import React from 'react';
import ReactDOM from 'react-dom';

import { CookiesProvider } from 'react-cookie'

import './favicon.ico'
import './styles/index.scss'
import App from './components/App';

ReactDOM.render(<CookiesProvider><App/></CookiesProvider>, document.querySelector("#app"));
