import React, { Component } from 'react';
import { connect } from 'react-redux';
import Snap from 'snapsvg-cjs';
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

const getLinksVia = (fromToR, toToR, viaSW) => [
  `#edge--${fromToR}-${viaSW}`,
  `#edge--${toToR}-${viaSW}`,
]

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

export const getActiveLinks = vlans => _.flatten(vlans.map(vlan => {
  const color = getLinkColor(vlan.vlanId);
  return getActiveLinksFromVlan(vlan.vlanId, vlan.viaSW).map(label => ({
    label,
    color
  }))
}))

const groupByLabel = links => {
  // key: link label
  // values: [link]
  // e.g.
  // [ link-a: [ { label: 'link-a', color: 1 }, { label: 'link-a', color: 2 } ] ]
  const groupedByLabel = links.reduce((accum, current) => {
    if (accum[current.label] == null) {
      accum[current.label] = [current]
      return accum
    }
    accum[current.label].push(current)
    return accum
  }, {});

  // e.g.
  // { a: [ 1, 2 ] }
  const linkColors =  _.mapValues(groupedByLabel, links => links.map(link => link.color))
  return linkColors;
}

export const getActiveLinksMap = vlans => groupByLabel(getActiveLinks(vlans))

export const COLORS = [
  '#FF91E4',
  '#6A65E8',
  '#7CFFFB',
  '#81E865',
  '#FFD71C',
  '#FF611C'
]

export const getLinkColor = vlanId => {
  if (11 <= vlanId && vlanId <= 16) {
    return COLORS[vlanId - 11];
  } else {
    return 'black';
  }
}

const styles = {
  root: {
  },
  '@global': {
    'div svg': {
      width: '100%'
    },
  },
)

export class NetworkFigure extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeLinksDom: []
    }
  }

  componentDidMount() {
    const root = Snap(this.snapRoot)

    Snap.load("network.svg", data => {
      if (root) {
        root.append(data);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const nextVlans = nextProps.vlans;
    const activeLinks = getActiveLinksMap(nextVlans)  // {label: color}


    // remove old colored edge element
    this.state.activeLinksDom.forEach(dom => {
      dom.remove();
    })
    const activeLinksDom = [];


    _.forEach(activeLinks, (colors, link) => {
      const path = Snap.select(link).select('path');
      _.forEach(colors, (color, index) => {
          const cloned = path.clone();
          cloned.transform(Snap.matrix().translate(0, 3 * index));
          cloned.attr({
            'stroke-linecap': 'round',
            'stroke-width': '3px',
            'stroke': color,
          });
          activeLinksDom.push(cloned);
      })
    })
    this.setState({
      activeLinksDom
    })
  }

  render() {
    // const { classes, vlanId } = this.props;
    const { classes, vlans } = this.props;

    return (
      <div className={classes.root}>
        <div ref={d => this.snapRoot = d} />
        {vlans.map(vlan =>
          <li key={vlan.vlanId}>
            VLAN Tag {vlan.vlanId}: <span style={{background: getLinkColor(vlan.vlanId)}}>{getLinkColor(vlan.vlanId)}</span>
          </li>
        )}
      </div>
    )
  }
}

export const NetworkFigureStyled = withStyles(styles)(NetworkFigure);


const mapStateToProps = state => ({
  vlans: state.vlan
})

export default connect(mapStateToProps)(NetworkFigureStyled);
