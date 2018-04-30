import { Chart } from 'chart.js';
import 'chartjs-plugin-streaming';
import moment from 'moment';

function onRefresh() {
  config.data.datasets.forEach(function(dataset) {
    dataset.data.push({
      x: moment(),
      y: Math.random() * 100
    });
  });
}

const orange = 'rgb(255, 159, 64)';
const config = {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label: 'Dataset',
      backgroundColor: Chart.helpers.color(orange).alpha(0.5).rgbString(),
      borderColor: orange,
      borderWidth: 1,
      data: []
    }]
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: 'Bar chart (hotizontal scroll) sample'
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
          labelString: 'value'
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
