// https://github.com/hardchor/timesheets/blob/4991fd472dbb12b0c6e6806c6a01ea3385ab5979/app/shared/store/configureStore.js
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import getRootReducer from '../reducers';
import {
  forwardToMain,
  forwardToRenderer,
  triggerAlias,
  replayActionMain,
  replayActionRenderer,
} from 'electron-redux';

const isDevelopment = process.env.NODE_ENV !== 'production'

/**
 * @param  {Object} initialState
 * @param  {String} [scope='main|renderer']
 * @return {Object} store
 */
export default function configureStore(initialState, scope = 'main') {
  let middleware = [
    thunk
  ];

  if (isDevelopment) {
    middleware = [
      logger,
      ...middleware
    ]
  }

  if (scope === 'renderer') {
    middleware = [
      forwardToMain,
      ...middleware,
    ];
  }

  if (scope === 'main') {
    middleware = [
      triggerAlias,
      ...middleware,
      forwardToRenderer,
    ];
  }

  const enhanced = [
    applyMiddleware(...middleware),
  ];

  const rootReducer = getRootReducer(scope);
  const enhancer = compose(...enhanced);
  const store = createStore(rootReducer, initialState, enhancer);

  if (scope === 'main') {
    replayActionMain(store);
  } else {
    replayActionRenderer(store);
  }

  return store;
}
