import { combineReducers } from 'redux';

export default function getRootReducer(scope = 'main') {
  if (scope === 'main') {
    return combineReducers({});
  } else if (scope === 'renderer') {
    return combineReducers({});
  }
}
