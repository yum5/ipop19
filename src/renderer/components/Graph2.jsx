import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Chart, Line } from 'react-chartjs-2';
import 'chartjs-plugin-streaming';
import moment from 'moment';

const orange = 'rgb(255, 159, 64)';

export class Graph2 extends Component {
  constructor(props) {
    super(props);
    const data = {
      type: 'line',
      datasets: [{
        key: 'rx',
        label: 'Rx Packets',
        backgroundColor: Chart.helpers.color(orange).alpha(0.5).rgbString(),
        borderColor: orange,
        borderWidth: 1,
        data: []
      }]
    }
    const options = {
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
    const { graphData0 } = this.props;
    chart.data.datasets.forEach(datasetall => {
      if (graphData0 == null) return;
      graphData0.rx.forEach(rx0 => {
        const last = datasetall.data.slice(-1)[0];
        if (!last || moment(last.x).isBefore(moment(rx0.x))) {
          graphData0.tx.forEach(rx1 => {
            if (!last || moment(last.x).isBefore(moment(rx1.x))){
                              const packet0= rx0.y;
                              const packet1= rx1.y;
                              let allpacket = packet0+packet1;
                              // allpacket=allpacket/2;
                              datasetall.data.push({
                                x:rx0.x,
                                y:allpacket
                              })

            }})
        }})
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
  const device = props.device;
  return {
    graphData0:state.packets[device[0]] && state.packets[device[0]].graphData
  };
}

export default connect(mapStateToProps)(Graph2)
