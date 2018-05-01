import { Chart } from 'chart.js';
import 'chartjs-plugin-streaming';
import moment from 'moment';
import Vue from 'vue';

const electron = require('electron');
const { remote, ipcRenderer } = electron
const _ = require('lodash');

function onRefresh() {
  config.data.datasets.forEach(function(dataset) {
    // dataset.data.push({
    //   x: moment(),
    //   y: Math.random() * 100
    // });
  });
  // config.options.plugins.streaming.duration -= 1000;
}

const orange = 'rgb(255, 159, 64)';
const blue = 'rgb(64, 159, 255)';

const config = {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      key: 'rx',
      label: 'Rx Packets',
      backgroundColor: Chart.helpers.color(orange).alpha(0.5).rgbString(),
      borderColor: orange,
      borderWidth: 1,
      data: []
    },{
      key: 'tx',
      label: 'Tx Packets',
      backgroundColor: Chart.helpers.color(blue).alpha(0.5).rgbString(),
      borderColor: blue,
      borderWidth: 1,
      data: []
    }]
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: 'Packet Monitor'
    },
    scales: {
      xAxes: [{
        type: 'realtime',
        display: true
      }],
      yAxes: [{
        type: 'linear',
        display: true,
        scaleLabel: {
          display: true,
          labelString: '# of packets sent / received per milliseconds'
        }
      }]
    },
    tooltips: {
      mode: 'nearest',
      intersect: false
    },
    hover: {
      mode: 'nearest',
      intersect: false
    },
    plugins: {
      streaming: {
        duration: 20000,
        refresh: 1000,
        delay: 1000,
        onRefresh: onRefresh
      }
    }
  }
};

const ctx = document.getElementById('canvas').getContext('2d');
const myBar = new Chart(ctx, config);

const store = [];

ipcRenderer.on('packet_received', function(event, data) {
  const lastEntry = store.slice(-1)[0];
  let nextEntry;

  if (lastEntry) {
    const timeInterval = moment(data.timestamp) - moment(lastEntry.timestamp);
    const rxDelta = data.rx - lastEntry.rx;
    const txDelta = data.tx - lastEntry.tx;

    nextEntry = {
      timestamp: data.timestamp,
      rx: data.rx,
      tx: data.tx,
      rxDelta: rxDelta,
      txDelta: txDelta,
      timeInterval: timeInterval,
      rxDeltaPerSec: rxDelta / timeInterval,
      txDeltaPerSec: txDelta / timeInterval
    };
  } else {
    nextEntry = {
      timestamp: data.timestamp,
      rx: data.rx,
      tx: data.tx,
      rxDelta: 0,
      txDelta: 0,
      timeInterval: 0,
      rxDeltaPerSec: 0,
      txDeltaPerSec: 0
    };
  }
  store.push(nextEntry);

  config.data.datasets.forEach(function(dataset) {
    if (dataset.key === 'rx') {
      dataset.data.push({
        x: nextEntry.timestamp,
        y: nextEntry.rxDeltaPerSec
      });
    } else if (dataset.key === 'tx') {
      dataset.data.push({
        x: nextEntry.timestamp,
        y: nextEntry.txDeltaPerSec
      });
    }
  });
});



const app = new Vue({
  el: '#vue-root',
  data: {
    duration: 20000, // graph duration
    interval: 1000 // sampling interval
  },
  watch: {
    duration: _.throttle(function(){
      config.options.plugins.streaming.duration = this.duration;
      myBar.update();
    }, 1000),
    interval: _.throttle(function(){
      ipcRenderer.send('settings_changed', this.interval);
    }, 1000)
  }
});
