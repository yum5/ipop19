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
})
