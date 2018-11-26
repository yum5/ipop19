import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Chart, Line } from 'react-chartjs-2';
import 'chartjs-plugin-streaming';
import moment from 'moment';

const orange = 'rgb(255, 159, 64)';
const blue = 'rgb(64, 159, 255)';
const POWER_CONSUMPTION_ELECTRICAL = 0.1;
const POWER_CONSUMPTION_OPTICAL = 0.0000000000001;
const OPTICAL_BANDWIDTH = 10 * 1000 * 1000 * 1000; // 10Gbps

export class PowerGraph extends Component {
  constructor(props) {
    super(props);
    const data = {
      type: 'line',
      // labels: ['rx', 'tx'],
      datasets: [{
        key: 'conventional',
        label: 'Power consumed by conventional DC',
        backgroundColor: Chart.helpers.color(orange).alpha(0.5).rgbString(),
        borderColor: orange,
        borderWidth: 1,
        // data: this.props.graphData.rx,
        data: []
      },{
        key: 'holst',
        label: 'Power consumed by HOLST',
        backgroundColor: Chart.helpers.color(blue).alpha(0.5).rgbString(),
        borderColor: blue,
        borderWidth: 1,
        // data: this.props.graphData.tx,
        data: []
      }]
    }

    const options = {
      responsive: true,
      title: {
        display: true,
        text: 'Power Consumption Comparison'
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
            labelString: 'Power (W)'
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
          duration: 90000,
          refresh: 1000,
          frameRate: 20,
          delay: 1000,
          onRefresh: this.onRefresh.bind(this)
        }
      }
    }
    this.data = data;
    this.options = options;

    this.onRefresh = this.onRefresh.bind(this)
  }

  onRefresh(chart) {
    const { spine, mems, plzt } = this.props;
    chart.data.datasets.forEach(dataset => {
      if (spine == null || mems == null || plzt == null) return;

      if (dataset.key === 'conventional') {
        spine.forEach((row, index) => {
          const last = dataset.data.slice(-1)[0];
          if (!last || moment(last.x).isBefore(moment(row.timestamp))) {
            const mf = spine[index].txDeltaPerSec;
            const df = plzt[index].txDeltaPerSec;
            const ef = mems[index].txDeltaPerSec;
            const power = (mf + df + ef) * POWER_CONSUMPTION_ELECTRICAL;

            dataset.data.push({
              x: row.timestamp,
              y: power
            });
          }
        })
      } else if (dataset.key === 'holst') {
        spine.forEach((row, index) => {
          const last = dataset.data.slice(-1)[0];
          if (!last || moment(last.x).isBefore(moment(row.timestamp))) {
            const mf = spine[index].txDeltaPerSec;
            const df = plzt[index].txDeltaPerSec;
            const ef = mems[index].txDeltaPerSec;
            const power = mf * POWER_CONSUMPTION_ELECTRICAL + OPTICAL_BANDWIDTH * POWER_CONSUMPTION_OPTICAL;

            dataset.data.push({
              x: row.timestamp,
              y: power
            })
          }
        })
      }
    })
  }

  render() {
    const { data, options } = this;
    return (
      <div>
        <Line data={data} options={options} width={600} height={400}/>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    spine: state.packets['tx--to-spine'] && state.packets['tx--to-spine'].rawData,
    mems: state.packets['tx--to-mems'] && state.packets['tx--to-mems'].rawData,
    plzt: state.packets['tx--to-plzt'] && state.packets['tx--to-plzt'].rawData
  };
}

export default connect(mapStateToProps)(PowerGraph)
