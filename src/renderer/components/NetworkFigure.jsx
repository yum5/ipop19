import React, { Component } from 'react';
import { connect } from 'react-redux';
// import Snap from 'snapsvg-cjs';
import Snap from 'snapsvg';
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

export const getActiveLinks = (vlans) => {
  return  _.flatten(vlans.map(vlan => {
    const color = getLinkColor(vlan.vlanId);
    return getActiveLinksFromVlan(vlan.vlanId, vlan.viaSW).map(label => {
      return {
        label,
        color
      }
    })
  }));
}

export const getLinksToAwake = (nextActiveLinks, activeLinks) => {
  return _.differenceBy(nextActiveLinks, activeLinks, 'label');
}

export const getLinksToSleep = (activeLinks, nextActiveLinks) => {
  return _.differenceBy(activeLinks, nextActiveLinks, 'label');
}

export const getLinksToKeepActive = (activeLinks, nextActiveLinks) => {
  return _.intersectionBy(nextActiveLinks, activeLinks, 'label');
}


// actuveLinks = {
//   link-label-name-as-key: [array of color]
// }
export const getLinksToAwakeMap = (nextActiveLinks, activeLinks) => {
  return _.mapValues(nextActiveLinks, (nextActiveLinksColors, link) => _.difference(nextActiveLinksColors, activeLinks[link]))
}

export const getLinksToSleepMap = (activeLinks, nextActiveLinks) => {
  return _.mapValues(activeLinks, (activeLinksColors, link) => _.difference(activeLinksColors, nextActiveLinks[link]))
}

export const getLinksToKeepActiveMap = (activeLinks, nextActiveLinks) => {
  const links = _.mapValues(nextActiveLinks, (nextActiveLinksColors, link) => _.intersection(activeLinks[link], nextActiveLinksColors))
  return _.pickBy(links, (colors, link) => colors.length > 0);
}

export const groupByLabel = (links) => {
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
  const linkColors =  _.mapValues(groupedByLabel, (links, label) => {
    return links.map(link => link.color)
  })

  return linkColors;

  // return _.map(linkColors, (value, key) => {
  //   return {
  //     label: key,
  //     colors: value
  //   }
  // })
}

export const getLinksToDie = (nextActiveLinks) => {
  const nextActiveGrouped = groupByLabel(nextActiveLinks);

  const allLinks = _.values(LINK);
  const linksToAlive = _.keys(nextActiveGrouped);
  return _.difference(allLinks, linksToAlive);
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

    this.state = {
      paper: null
    }
  }

  componentDidMount() {
    const root = Snap(this.snapRoot)
    // console.log(root.gradient(`l(0, 0, 1, 1)${['red', 'blue'].join('-')}`))
    console.log(root.gradient);
    console.log(Snap(window.width, window.height))
    console.log(Snap(window.width, window.height).gradient)

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

    this.setState({
      paper: root
    });
  }

  componentWillReceiveProps(nextProps) {
    // const { vlanId, viaSW } = this.props;
    const { vlans } = this.props;
    // const nextVlanId = nextProps.vlanId;
    // const nextViaSW = nextProps.viaSW;
    const nextVlans = nextProps.vlans;
    // const activeLinks = getActiveLinksFromVlan(vlanId, viaSW);
    // const activeLinks = _.flatten(vlans.map(vlan => {
    //   const color = getLinkColor(vlan.vlanId);
    //   return getActiveLinksFromVlan(vlan.vlanId, vlan.viaSW).map(label => {
    //     return {
    //       label,
    //       color
    //     }
    //   })
    // }));
    const activeLinks = getActiveLinks(vlans);
    // const nextActiveLinks = getActiveLinksFromVlan(nextVlanId, nextViaSW);
    const nextActiveLinks = getActiveLinks(nextVlans);

    // const linksToAwake = _.differenceBy(nextActiveLinks, activeLinks, 'label');
    const linksToAwake = getLinksToAwake(nextActiveLinks, activeLinks);
    const linksToSleep = getLinksToSleep(activeLinks, nextActiveLinks);
    const linksToKeepActive = getLinksToKeepActive(activeLinks, nextActiveLinks);

    // const color = getLinkColor(nextVlanId);

    console.table({
      vlans,
      nextVlans
    })

    // console.table({
    //   // vlanId,
    //   // nextVlanId,
    //   // viaSW,
    //   active: activeLinks,
    //   nextActive: nextActiveLinks,
    //   awake: linksToAwake,
    //   sleep: linksToSleep,
    //   keep: linksToKeepActive
    // });

    // linksToAwake.forEach(link => {
    //   Snap.select(link.label).select('path')
    //     .attr({
    //       'stroke-linecap': 'round'
    //     })
    //     .animate({
    //       'stroke': link.color,
    //       'stroke-width': '3px'
    //   }, 200);
    // })
    //
    // linksToSleep.forEach(link => {
    //   Snap.select(link.label).select('path')
    //     .attr({
    //       'stroke-linecap': 'round'
    //     })
    //     .animate({
    //       'stroke': 'black',
    //       'stroke-width': '1px'
    //   }, 200);
    // })
    //
    // linksToKeepActive.forEach(link => {
    //   Snap.select(link.label).select('path')
    //     .attr({
    //       'stroke-width': '3px',
    //       'stroke-linecap': 'round'
    //     })
    //     .animate({
    //       'stroke': link.color,
    //   }, 200);
    // })


    // const linksToAwakeMap = getLinksToAwakeMap(groupByLabel(nextActiveLinks), groupByLabel(activeLinks));
    // const linksToSleepMap = getLinksToSleepMap(groupByLabel(activeLinks), groupByLabel(nextActiveLinks));
    // const linksToKeepActiveMap = getLinksToKeepActiveMap(groupByLabel(activeLinks), groupByLabel(nextActiveLinks));
    //
    // _.forEach(linksToAwakeMap, (colors, link) => {
    //   Snap.select(link).select('path')
    //     .attr({
    //       'stroke-linecap': 'round'
    //     })
    //     .animate({
    //       'stroke': Snap.gradient(`l(0, 0, 1, 1)${colors.join('-')}`),
    //       'stroke-width': '3px'
    //   }, 200);
    // })
    //
    // _.forEach(linksToSleepMap, (colors, link) => {
    //   Snap.select(link).select('path')
    //     .attr({
    //       'stroke-linecap': 'round'
    //     })
    //     .animate({
    //       'stroke': 'black', // cannot get colors of this link!!!
    //       'stroke-width': '1px'
    //   }, 200);
    // })

    const linksToAlive = groupByLabel(nextActiveLinks);  // label: color
    const linksToDie = getLinksToDie(nextActiveLinks); // [label]

    console.table({
      linksToAlive,
      linksToDie
    })

    const { paper } = this.state;
    const s = Snap(window.width, window.height);
    console.log(paper);

    _.forEach(linksToAlive, (colors, link) => {
      Snap.select(link).select('path')
        .attr({
          'stroke-linecap': 'round'
        })
        .animate({
          'stroke': paper.gradient(`l(0, 0, 1, 1)${colors.join('-')}`),
          'stroke-width': '3px'
      }, 200);
    })

    _.forEach(linksToDie, (link) => {
      Snap.select(link).select('path')
        .attr({
          'stroke-linecap': 'round'
        })
        .animate({
          'stroke': 'black', // cannot get colors of this link!!!
          'stroke-width': '1px'
      }, 200);
    })
  }

  render() {
    // const { classes, vlanId } = this.props;
    const { classes, vlans } = this.props;

    return (
      <div className={classes.root}>
        <div ref={d => this.snapRoot = d} />
        {/*<span>VLAN Tag: {vlanId}</span>*/}
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


const mapStateToProps = (state) => {
  return {
    vlans: state.vlan
    // vlanId: state.vlan.vlanId,
    // viaSW: state.vlan.viaSW
  };
}

export default connect(mapStateToProps)(NetworkFigureStyled);
