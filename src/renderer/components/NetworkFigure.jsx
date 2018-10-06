import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';

export const LINK = {
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

export const SW = {
  TOR1: 'tor1',
  TOR2: 'tor2',
  TOR3: 'tor3',
  TOR4: 'tor4',
  SPINE: 'spine',
  MEMS: 'mems',
  PLZT: 'plzt'
}

const getLinksVia = (fromToR, toToR, viaSW) => {
  return [
    `#edge--${fromToR}-${viaSW}`,
    `#edge--${toToR}-${viaSW}`,
  ]
}

const getActiveLinksFromVlan = (vlanId, viaSW) => {
  switch(vlanId) {
    case 11: {
      return [
        LINK.SERVER1__FLOW_CLASSIFIER,
        LINK.FLOW_CLASSIFIER__TOR1,
        LINK.SERVER3__TOR2
      ].concat(getLinksVia(SW.TOR1, SW.TOR2, viaSW))
    }
    case 12: {
      return [
        LINK.SERVER2__FLOW_CLASSIFIER,
        LINK.FLOW_CLASSIFIER__TOR1,
        LINK.SERVER3__TOR2
      ].concat(getLinksVia(SW.TOR1, SW.TOR2, viaSW))
    }
    case 13: {
      return [
        LINK.SERVER1__FLOW_CLASSIFIER,
        LINK.FLOW_CLASSIFIER__TOR1,
        LINK.SERVER4__TOR3
      ].concat(getLinksVia(SW.TOR1, SW.TOR3, viaSW))
    }
    case 14: {
      return [
        LINK.SERVER2__FLOW_CLASSIFIER,
        LINK.FLOW_CLASSIFIER__TOR1,
        LINK.SERVER4__TOR3
      ].concat(getLinksVia(SW.TOR1, SW.TOR3, viaSW))
    }
    case 15: {
      return [
        LINK.SERVER1__FLOW_CLASSIFIER,
        LINK.FLOW_CLASSIFIER__TOR1,
        LINK.SERVER5__TOR4
      ].concat(getLinksVia(SW.TOR1, SW.TOR4, viaSW))
    }
    case 16: {
      return [
        LINK.SERVER2__FLOW_CLASSIFIER,
        LINK.FLOW_CLASSIFIER__TOR1,
        LINK.SERVER5__TOR4
      ].concat(getLinksVia(SW.TOR1, SW.TOR4, viaSW))
    }
    default: {
      return []
    }
  }
}

export const COLORS = [
  '#FF91E4',
  '#6A65E8',
  '#7CFFFB',
  '#81E865',
  '#FFD71C',
  '#FF611C'
]

export const getLinkColor = (vlanId) => {
  if (11 <= vlanId && vlanId <= 16) {
    return COLORS[vlanId - 11];
  } else {
    return 'black';
  }
}

const inactiveLinks = () =>  _.values(LINK)

const styles = theme => ({
  root: {
  },
  '@global': {
    'div svg': {
      width: '100%'
    },
  },
})

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
    const { vlanId, viaSW } = this.props;
    const nextVlanId = nextProps.vlanId;
    const nextViaSW = nextProps.viaSW;
    const activeLinks = getActiveLinksFromVlan(vlanId, viaSW);
    const nextActiveLinks = getActiveLinksFromVlan(nextVlanId, nextViaSW);

    const linksToAwake = _.difference(nextActiveLinks, activeLinks);
    const linksToSleep = _.difference(activeLinks, nextActiveLinks);
    const linksToKeepActive = _.intersection(activeLinks, nextActiveLinks);

    const color = getLinkColor(nextVlanId);

    // console.table({
    //   vlanId,
    //   nextVlanId,
    //   viaSW,
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
          'stroke': color,
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
          'stroke-width': '3px',
          'stroke-linecap': 'round'
        })
        .animate({
          'stroke': color,
      }, 200);
    })
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div ref={d => this.snapRoot = d} />
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    vlanId: state.packets.vlan.vlanId,
    viaSW: state.packets.vlan.viaSW
  };
}

export default connect(mapStateToProps)(withStyles(styles)(NetworkFigure));
