import React from 'react';
import renderer from 'react-test-renderer';

import {
  LINK,
  SW,
  COLORS,
  getActiveLinks,
  getLinksToAwake,
  getLinksToSleep,
  getLinksToKeepActive,
  getLinksToAwakeMap,
  getLinksToSleepMap,
  getLinksToKeepActiveMap,
  groupByLabel,
  NetworkFigureStyled
} from '../../../../src/renderer/components/NetworkFigure';


describe('NetworkFigure', () => {
  describe('length 1 vlans', () => {
    it('should getActiveLinks' , () => {
      const vlans = [
        {
          vlanId: 15,
          viaSW: 'plzt',
        }
      ]
      const component = renderer.create(
        <NetworkFigureStyled vlans={vlans}/>
      );

      const color = COLORS[15 - 11]; // vlanId: 15
      expect(getActiveLinks(vlans)).toEqual([{
        label: LINK.SERVER1__FLOW_CLASSIFIER,
        color
      },
      {
        label: LINK.FLOW_CLASSIFIER__TOR1,
        color
      },
      {
        label: LINK.SERVER5__TOR4,
        color
      },
      {
        label: "#edge--tor1-plzt",
        color
      },
      {
        label: "#edge--tor4-plzt",
        color
      }]);
    })
    it('should getLinksToAwake', () => {
      const vlans = [
        {
          vlanId: 11,
          viaSW: 'mems',
        }
      ];
      const nextVlans = [
        {
          vlanId: 12,
          viaSW: 'plzt',
        }
      ]
      const linksToAwake = getLinksToAwake(getActiveLinks(nextVlans), getActiveLinks(vlans));
      const color = COLORS[12 - 11]; // vlanId: 12

      expect(linksToAwake).toEqual([{
        label: LINK.SERVER2__FLOW_CLASSIFIER,
        color
      },
      {
        label: "#edge--tor1-plzt",
        color
      },
      {
        label: "#edge--tor2-plzt",
        color
      }]);
    })
    it('should getLinksToSleep', () => {
      const vlans = [
        {
          vlanId: 11,
          viaSW: 'mems',
        }
      ];
      const nextVlans = [
        {
          vlanId: 12,
          viaSW: 'plzt',
        }
      ]
      const linksToSleep = getLinksToSleep(getActiveLinks(vlans), getActiveLinks(nextVlans));
      const color = COLORS[11 - 11]; // vlanId: 11

      expect(linksToSleep).toEqual([{
        label: LINK.SERVER1__FLOW_CLASSIFIER,
        color
      },
      {
        label: "#edge--tor1-mems",
        color
      },
      {
        label: "#edge--tor2-mems",
        color
      }]);
    })
    it('should getLinksToKeepActive', () => {
      const vlans = [
        {
          vlanId: 11,
          viaSW: 'mems',
        }
      ];
      const nextVlans = [
        {
          vlanId: 12,
          viaSW: 'plzt',
        }
      ]
      const linksToKeepActive = getLinksToKeepActive(getActiveLinks(vlans), getActiveLinks(nextVlans));
      const color = COLORS[12 - 11]; // vlanId: 11

      expect(linksToKeepActive).toEqual([{
        label: LINK.FLOW_CLASSIFIER__TOR1,
        color
      },
      {
        label: LINK.SERVER3__TOR2,
        color
      }]);
    })
  })

  describe('length 2 vlans', () => {
    it('should getActiveLinks' , () => {
      const vlans = [
        {
          vlanId: 11,
          viaSW: 'mems',
        },
        {
          vlanId: 12,
          viaSW: 'plzt',
        }
      ]

      const color11 = COLORS[11 - 11];
      const color12 = COLORS[12 - 11];
      const expected = [{
        label: LINK.SERVER1__FLOW_CLASSIFIER,
        color: color11
      },
      {
        label: LINK.FLOW_CLASSIFIER__TOR1,
        color: color11
      },
      {
        label: "#edge--tor1-mems",
        color: color11
      },
      {
        label: "#edge--tor2-mems",
        color: color11
      },
      {
        label: LINK.SERVER3__TOR2,
        color: color11
      },
      {
        label: LINK.SERVER2__FLOW_CLASSIFIER,
        color: color12
      },
      {
        label: LINK.FLOW_CLASSIFIER__TOR1,
        color: color12
      },
      {
        label: "#edge--tor1-plzt",
        color: color12
      },
      {
        label: "#edge--tor2-plzt",
        color: color12
      },
      {
        label: LINK.SERVER3__TOR2,
        color: color12
      }];
      expect(getActiveLinks(vlans)).toEqual(expect.arrayContaining(expected));
      expect(getActiveLinks(vlans).length).toEqual(expected.length);
    })
    it('should groupByLabel' , () => {
      const vlans = [
        {
          vlanId: 11,
          viaSW: 'mems',
        },
        {
          vlanId: 12,
          viaSW: 'plzt',
        }
      ]

      const color11 = COLORS[11 - 11];
      const color12 = COLORS[12 - 11];
      const before = [{
        label: LINK.SERVER1__FLOW_CLASSIFIER,
        color: color11
      },
      {
        label: LINK.FLOW_CLASSIFIER__TOR1,
        color: color11
      },
      {
        label: "#edge--tor1-mems",
        color: color11
      },
      {
        label: "#edge--tor2-mems",
        color: color11
      },
      {
        label: LINK.SERVER3__TOR2,
        color: color11
      },
      {
        label: LINK.SERVER2__FLOW_CLASSIFIER,
        color: color12
      },
      {
        label: LINK.FLOW_CLASSIFIER__TOR1,
        color: color12
      },
      {
        label: "#edge--tor1-plzt",
        color: color12
      },
      {
        label: "#edge--tor2-plzt",
        color: color12
      },
      {
        label: LINK.SERVER3__TOR2,
        color: color12
      }];

      // const after = [{
      //   label: LINK.SERVER1__FLOW_CLASSIFIER,
      //   colors: [color11]
      // },
      // {
      //   label: "#edge--tor1-mems",
      //   colors: [color11]
      // },
      // {
      //   label: "#edge--tor2-mems",
      //   colors: [color11]
      // },
      // {
      //   label: LINK.SERVER2__FLOW_CLASSIFIER,
      //   colors: [color12]
      // },
      // {
      //   label: LINK.FLOW_CLASSIFIER__TOR1,
      //   colors: [color11, color12]
      // },
      // {
      //   label: "#edge--tor1-plzt",
      //   colors: [color12]
      // },
      // {
      //   label: "#edge--tor2-plzt",
      //   colors: [color12]
      // },
      // {
      //   label: LINK.SERVER3__TOR2,
      //   colors: [color11, color12]
      // }];
      const after = {
        [LINK.SERVER1__FLOW_CLASSIFIER]: [color11],
        '#edge--tor1-mems': [color11],
        '#edge--tor2-mems': [color11],
        [LINK.SERVER2__FLOW_CLASSIFIER]: [color12],
        [LINK.FLOW_CLASSIFIER__TOR1]: [color11, color12],
        "#edge--tor1-plzt": [color12],
        "#edge--tor2-plzt": [color12],
        [LINK.SERVER3__TOR2]: [color11, color12]
      };

      // expect(groupByLabel(before)).toEqual(expect.arrayContaining(after));
      // expect(groupByLabel(before).length).toEqual(after.length);
      expect(groupByLabel(before)).toEqual(after);
    })

    it('should getLinksToAwakeMap' , () => {
      const vlans = [
        {
          vlanId: 11,
          viaSW: 'mems',
        },
        {
          vlanId: 12,
          viaSW: 'plzt',
        }
      ];

      const nextVlans = [
        {
          vlanId: 13,
          viaSW: 'spine',
        }
      ]

      const color11 = COLORS[11 - 11];
      const color12 = COLORS[12 - 11];
      const color13 = COLORS[13 - 11];

      const expectedAwake = {
        [LINK.SERVER1__FLOW_CLASSIFIER]: [color13],
        [LINK.FLOW_CLASSIFIER__TOR1]: [color13],
        '#edge--tor1-spine': [color13],
        '#edge--tor3-spine': [color13],
        [LINK.SERVER4__TOR3]: [color13],
      };
      const expectedSleep = {
        [LINK.SERVER1__FLOW_CLASSIFIER]: [color11],
        [LINK.SERVER2__FLOW_CLASSIFIER]: [color12],
        [LINK.FLOW_CLASSIFIER__TOR1]: [color11, color12],
        '#edge--tor1-mems': [color11],
        '#edge--tor2-mems': [color11],
        '#edge--tor1-plzt': [color12],
        '#edge--tor2-plzt': [color12],
        [LINK.SERVER3__TOR2]: [color11, color12],
      };

      const expectedKeepActive = {
      }

      const activeLinks = getActiveLinks(vlans);
      const nextActiveLinks = getActiveLinks(nextVlans);

      expect(getLinksToAwakeMap(groupByLabel(nextActiveLinks), groupByLabel(activeLinks))).toEqual(expectedAwake);
      expect(getLinksToSleepMap(groupByLabel(activeLinks), groupByLabel(nextActiveLinks))).toEqual(expectedSleep);
      expect(getLinksToKeepActiveMap(groupByLabel(nextActiveLinks), groupByLabel(activeLinks))).toEqual(expectedKeepActive);
    })
  })
})
