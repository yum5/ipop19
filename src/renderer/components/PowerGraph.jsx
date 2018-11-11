import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Chart, Line } from 'react-chartjs-2';
import 'chartjs-plugin-streaming';
import moment from 'moment';

const orange = 'rgb(255, 159, 64)';
const blue = 'rgb(64, 159, 255)';
const POWER_CONSUMPTION_ELECTRICAL = 0.1;
const POWER_CONSUMPTION_OPTICAL = 0.03;

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
        text: 'Power Monitor'
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
    const { graphDataMf, graphDataDf, graphDataEf } = this.props;
    chart.data.datasets.forEach(dataset => {
      if (graphDataMf == null || graphDataDf == null || graphDataEf == null) return;

      if (dataset.key === 'conventional') {
        graphDataMf.rx.forEach((rx, index) => {
          const last = dataset.data.slice(-1)[0];
          if (!last || moment(last.x).isBefore(moment(rx.x))) {
            const mf = graphDataMf.rx[index].y;
            const df = graphDataDf.rx[index].y;
            const ef = graphDataEf.rx[index].y;
            const power = (mf + df + ef) * POWER_CONSUMPTION_ELECTRICAL;

            dataset.data.push({
              x: rx.x,
              y: power
            });
          }
        })
      } else if (dataset.key === 'holst') {
        graphDataDf.rx.forEach((rx, index) => {
          const last = dataset.data.slice(-1)[0];
          if (!last || moment(last.x).isBefore(moment(rx.x))) {
            const mf = graphDataMf.rx[index].y;
            const df = graphDataDf.rx[index].y;
            const ef = graphDataEf.rx[index].y;
            const power = mf * POWER_CONSUMPTION_ELECTRICAL + (df + ef) * POWER_CONSUMPTION_OPTICAL;

            dataset.data.push({
              x: rx.x,
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
    graphDataMf: state.packets.mf && state.packets.mf.graphData,
    graphDataDf: state.packets.df && state.packets.df.graphData,
    graphDataEf: state.packets.ef && state.packets.ef.graphData
  };
}

export default connect(mapStateToProps)(PowerGraph)
