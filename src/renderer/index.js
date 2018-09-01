import { Chart } from 'chart.js';
import 'chartjs-plugin-streaming';
import moment from 'moment';
import Vue from 'vue';
const electron = require('electron');
const { remote, ipcRenderer } = electron
const _ = require('lodash');

import configureStore from '../shared/store/configureStore';
import App from './components/App';
import { Provider } from 'react-redux';
import React from 'react';
import { render } from 'react-dom';
// const app = new Vue({
//   el: '#vue-root',
//   data: {
//     duration: 20000, // graph duration
//     interval: 1000, // sampling interval
//     interfaces: [],
//     selectedInterface: ''
//   },
//   watch: {
//     duration: _.debounce(function() {
//       config.options.plugins.streaming.duration = this.duration;
//       myBar.update();
//     }, 100),
//     interval: _.debounce(function() {
//       ipcRenderer.send('settings_changed', {
//         interval: this.interval,
//         selectedInterface: this.selectedInterface
//       });
//     }, 100),
//     selectedInterface: _.debounce(function() {
//       ipcRenderer.send('settings_changed', {
//         interval: this.interval,
//         selectedInterface: this.selectedInterface
//       });
//     }, 100)
//   }
// });

const store = configureStore({}, 'renderer');
render(
  <Provider store={store}>
    <div>
      <App />
    </div>
  </Provider>,
  document.getElementById('root')
);
