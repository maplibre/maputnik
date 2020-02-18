import { IconContext } from "react-icons";
import React from 'react';
import ReactDOM from 'react-dom';

import './favicon.ico'
import './styles/index.scss'
import App from './components/App';

ReactDOM.render(
  <IconContext.Provider value={{className: 'react-icons'}}>
    <App/>
  </IconContext.Provider>,
  document.querySelector("#app")
);

// Hide the loader.
document.querySelector(".loading").style.display = "none";
