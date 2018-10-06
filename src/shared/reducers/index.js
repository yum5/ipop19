import { combineReducers } from 'redux';

import errors from './errors';
import settings from './settings';
import packets from './packets';
import devices from './devices';
import vlan from './vlan';


export default function getRootReducer(scope = 'main') {
  if (scope === 'main') {
    return combineReducers({
      errors,
      settings,
      packets,
      devices,
      vlan
    });
  } else if (scope === 'renderer') {
    return combineReducers({
      errors,
      settings,
      packets,
      devices,
      vlan
    });
  }
}
