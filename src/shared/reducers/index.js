import { combineReducers } from 'redux';

import settings from './settings';
import packets from './packets';
import devices from './devices';


export default function getRootReducer(scope = 'main') {
  if (scope === 'main') {
    return combineReducers({
      settings,
      packets,
      devices
    });
  } else if (scope === 'renderer') {
    return combineReducers({
      settings,
      packets,
      devices
    });
  }
}
