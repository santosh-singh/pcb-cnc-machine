import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import notifications from './notifications';

const rootReducer = combineReducers({
  notifications
});

export default rootReducer;
