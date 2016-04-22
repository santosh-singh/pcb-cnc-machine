import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import PCBCNCMachine from './containers/PCBCNCMachine';




export default (
  <Route path="/" component={App}>
    <IndexRoute component={PCBCNCMachine} />
  </Route>
);
