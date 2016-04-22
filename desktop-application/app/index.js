import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './store/configureStore';
import './app.global.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


const store = configureStore();
// const history = syncHistoryWithStore(hashHistory, store);

render(
  <Provider store={store}>
  <Router history={hashHistory} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
