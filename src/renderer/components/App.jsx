import React, { Component } from 'react';
import { connect } from 'react-redux';
import Graph from './Graph';

export class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const list = this.props.nic.map(ifs =>
      <li key={ifs}>{ifs}</li>
    )
    return (
      <div>
        <p>Hello</p>
        <ul>
          {list}
        </ul>
        <Graph />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    nic: state.devices.nic,
    graphData: state.packets.graphData
  };
}

export default connect(mapStateToProps)(App)
