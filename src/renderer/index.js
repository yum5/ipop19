import configureStore from '../shared/store/configureStore';
import App from './components/App';
import { Provider } from 'react-redux';
import React from 'react';
import { render } from 'react-dom';

const store = configureStore({}, 'renderer');
render(
  <Provider store={store}>
    <div>
      <App />
    </div>
  </Provider>,
  document.getElementById('root')
);
