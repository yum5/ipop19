import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

const LINK = {
  SERVER1__FLOW_CLASSIFIER: '#edge--server1-flow_classifier',
  SERVER2__FLOW_CLASSIFIER: '#edge--server2-flow_classifier',
  FLOW_CLASSIFIER__TOR1: '#edge--flow_classifier-tor1',
  TOR1__SPINE: '#edge--tor1-spine',
  TOR1__MEMS: '#edge--tor1-mems',
  TOR1__PLZT: '#edge--tor1-plzt',
  SERVER3__TOR2: '#edge--server3-tor2',
  SERVER4__TOR3: '#edge--server4-tor3',
  SERVER5__TOR4: '#edge--server5-tor4',
  TOR2__SPINE: '#edge--tor2-spine',
  TOR2__MEMS: '#edge--tor2-mems',
  TOR2__PLZT: '#edge--tor2-plzt',
  TOR3__SPINE: '#edge--tor3-spine',
  TOR3__MEMS: '#edge--tor3-mems',
  TOR3__PLZT: '#edge--tor3-plzt',
  TOR4__SPINE: '#edge--tor4-spine',
  TOR4__MEMS: '#edge--tor4-mems',
  TOR4__PLZT: '#edge--tor4-plzt',
}

const getActiveLinksFromVlan = vlanId => {
  switch(vlanId) {
    case 11: {
      return [
        LINK.SERVER1__FLOW_CLASSIFIER,
        LINK.FLOW_CLASSIFIER__TOR1,
        LINK.SERVER3__TOR2
      ]
    }
    case 12: {
      return [
        LINK.SERVER2__FLOW_CLASSIFIER,
        LINK.FLOW_CLASSIFIER__TOR1,
        LINK.SERVER3__TOR2
      ]
    }
    case 13: {
      return [
        LINK.SERVER1__FLOW_CLASSIFIER,
        LINK.FLOW_CLASSIFIER__TOR1,
        LINK.SERVER4__TOR3
      ]
    }
    case 14: {
      return [
        LINK.SERVER2__FLOW_CLASSIFIER,
        LINK.FLOW_CLASSIFIER__TOR1,
        LINK.SERVER4__TOR3
      ]
    }
    case 15: {
      return [
        LINK.SERVER1__FLOW_CLASSIFIER,
        LINK.FLOW_CLASSIFIER__TOR1,
        LINK.SERVER5__TOR4
      ]
    }
    case 16: {
      return [
        LINK.SERVER2__FLOW_CLASSIFIER,
        LINK.FLOW_CLASSIFIER__TOR1,
        LINK.SERVER5__TOR4
      ]
    }
    default: {
      return []
    }
  }
}

const inactiveLinks = () =>  _.values(LINK)

export class NetworkFigure extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const root = Snap(this.snapRoot)
    Snap.load("network.svg", (data) => {
      if (root) {
        root.append(data);
        //
        // let color = 'red';
        // setInterval(() => {
        // console.log(Snap.select("#edge--server3-tor2"));
        //   Snap.select("#edge--server3-tor2").select('path')
        //     .animate({
        //       'stroke': color,
        //   }, 1000);
        //   color = color === 'red' ? 'black': 'red';
        // }, 3000)
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { vlanId } = this.props;
    const nextVlanId = nextProps.vlanId;
    const activeLinks = getActiveLinksFromVlan(vlanId);
    const nextActiveLinks = getActiveLinksFromVlan(nextVlanId);

    const linksToAwake = _.difference(nextActiveLinks, activeLinks);
    const linksToSleep = _.difference(activeLinks, nextActiveLinks);
    const linksToKeepActive = _.intersection(activeLinks, nextActiveLinks);

    // console.table({
    //   active: activeLinks,
    //   nextActive: nextActiveLinks,
    //   awake: linksToAwake,
    //   sleep: linksToSleep,
    //   keep: linksToKeepActive
    // });

    linksToAwake.forEach(link => {
      Snap.select(link).select('path')
        .attr({
          'stroke-linecap': 'round'
        })
        .animate({
          'stroke': 'red',
          'stroke-width': '3px'
      }, 200);
    })

    linksToSleep.forEach(link => {
      Snap.select(link).select('path')
        .attr({
          'stroke-linecap': 'round'
        })
        .animate({
          'stroke': 'black',
          'stroke-width': '1px'
      }, 200);
    })

    linksToKeepActive.forEach(link => {
      Snap.select(link).select('path')
        .attr({
          'stroke': 'red',
          'stroke-width': '3px',
          'stroke-linecap': 'round'
      });
    })
  }

  render() {
    return (
      <div>
        <div ref={d => this.snapRoot = d} />
      </div>
    )
  }
}

export default NetworkFigure
