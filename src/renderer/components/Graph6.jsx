import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Chart, Line } from 'react-chartjs-2';
import 'chartjs-plugin-streaming';
import moment from 'moment';

const orange = 'rgb(255, 159, 64)';
const blue = 'rgb(64, 159, 255)';

export class Graph extends Component {
  constructor(props) {
    super(props);
    const data = {
      type: 'line',
      // labels: ['rx', 'tx'],
      datasets: [{
        key: 'rx',
        label: 'Rx Packets',
        backgroundColor: Chart.helpers.color(orange).alpha(0.5).rgbString(),
        borderColor: orange,
        borderWidth: 1,
        // data: this.props.graphData.rx,
        data: []
      }]
      // },{
      //   key: 'tx',
      //   label: 'Tx Packets',
      //   backgroundColor: Chart.helpers.color(blue).alpha(0.5).rgbString(),
      //   borderColor: blue,
      //   borderWidth: 1,
      //   // data: this.props.graphData.tx,
      //   data: []
      // }]
    }

    const options = {
      responsive: true,
      title: {
        display: true,
        text: 'ADV Migration Flow'
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
            labelString: 'packets / s'
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
    const { graphData } = this.props;
    chart.data.datasets.forEach(dataset => {
      if (graphData == null) return;
        graphData.tx.forEach(rx => {
          const last = dataset.data.slice(-1)[0];
          if (!last || moment(last.x).isBefore(moment(rx.x))) {
            // if(rx.y==0){
            // }else{
            //   rx.y = rx.y/1150;
            // }
            dataset.data.push(rx)
            // dataset.data[0].y+=100;
          }
        })
    })
  }

  render() {
    const { data, options } = this;
    return (
      <div>
        <Line data={data} options={options} width={600} height={340}/>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const device = props.device;
  return {
    graphData: state.packets[device] && state.packets[device].graphData
  };
}

export default connect(mapStateToProps)(Graph)
