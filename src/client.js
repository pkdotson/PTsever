import React from "react";
import ReactDOM from "react-dom";
import App from './App';

const jsx = (
  <App />
);

const app = document.getElementById( "app" );
ReactDOM.hydrate( jsx, app );

