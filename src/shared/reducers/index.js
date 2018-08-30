import { combineReducers } from 'redux';

import settings from './settings';


export default function getRootReducer(scope = 'main') {
  if (scope === 'main') {
    return combineReducers({
      settings
    });
  } else if (scope === 'renderer') {
    return combineReducers({
      settings
    });
  }
}
