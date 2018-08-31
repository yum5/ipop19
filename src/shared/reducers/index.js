import { combineReducers } from 'redux';

import settings from './settings';
import packets from './packets';


export default function getRootReducer(scope = 'main') {
  if (scope === 'main') {
    return combineReducers({
      settings,
      packets
    });
  } else if (scope === 'renderer') {
    return combineReducers({
      settings,
      packets
    });
  }
}
