import {
  ADD_GRAPH_ENTRY,
  UPDATE_SNMP_HOST,
  UPDATE_RYU_HOST,
  UPDATE_IS_DEBUG_MODE
} from '../actions/settings';

const initialState = {
  // times: [],
  graphEntries: [
    // {
    //   id: 'slotA',
    //   index: 21,
    //   ip: '192.168.100.14',
    //   desc: 'slotA interface',
    //   status: 'up'
    // },
    // {
    //   id: 'slotB',
    //   index: 21,
    //   ip: '192.168.100.15',
    //   desc: 'slotB interface',
    //   status: 'up'
    // },
    // {
    //   id: 'slotC',
    //   index: 21,
    //   ip: '192.168.100.16',
    //   desc: 'slotC interface',
    //   status: 'up'
    // },
    {
      id: 'slotA0',
      index: 2,
      ip: '192.168.30.5',
      desc: 'slotA0 interface',
      status: 'up'
    },
    {
      id: 'slotA1',
      index: 25,
      ip: '192.168.30.5',
      desc: 'slotA1 interface',
      status: 'up'
    },
    {
      id: 'slotA2',
      index: 26,
      ip: '192.168.30.5',
      desc: 'slotA2 interface',
      status: 'up'
    },
    {
      id: 'slotB0',
      index: 2,
      ip: '192.168.30.21',
      desc: 'slotB0 interface',
      status: 'up'
    },
    {
      id: 'slotB1',
      index: 3,
      ip: '192.168.30.21',
      desc: 'slotB1 interface',
      status: 'up'
    },
    {
      id: 'slotB2',
      index: 10,
      ip: '192.168.30.41',
      desc: 'slotB2 interface',
      status: 'up'
    },
    {
      id: 'slotB3',
      index: 11,
      ip: '192.168.30.41',
      desc: 'slotB3 interface',
      status: 'up'
    },
    {
      id: 'slotC0',
      index: 4,
      ip: '192.168.30.21',
      desc: 'slotC0 interface',
      status: 'up'
    },
    {
      id: 'slotC1',
      index: 5,
      ip: '192.168.30.21',
      desc: 'slotC1 interface',
      status: 'up'
    },
    {
      id: 'slotC2',
      index: 10405,
      ip: '192.168.30.6',
      desc: 'slotC2 interface',
      status: 'up'
    },
    {
      id: 'slotC3',
      index: 10406,
      ip: '192.168.30.6',
      desc: 'slotC3 interface',
      status: 'up'
    },
    {
      id: 'slotC4',
      index: 12,
      ip: '192.168.30.41',
      desc: 'slotC4 interface',
      status: 'up'
    },
    {
      id: 'slotC5',
      index: 13,
      ip: '192.168.30.41',
      desc: 'slotC5 interface',
      status: 'up'
    },
    {
      id: 'slotD0',
      index: 23,
      ip: '192.168.30.41',
      desc: 'slotD0 interface',
      status: 'up'
    }
    ,
    {
      id: 'slotD1',
      index: 28,
      ip: '192.168.30.21',
      desc: 'slotD1 interface',
      status: 'up'
    }
    ,
    {
      id: 'slotD2',
      index: 9,
      ip: '192.168.30.41',
      desc: 'slotD2 interface',
      status: 'up'
    }
    //,
    // {
    //   id: 'slotD',
    //   index: 1,
    //   ip: '192.168.30.127',
    //   desc: 'slotD interface',
    //   status: 'up'
    // },
    // {
    //   id: 'slotE',
    //   index: 1,
    //   ip: '192.168.30.146',
    //   desc: 'slotE interface',
    //   status: 'up'
    // }
],
  snmpHosts: [],
  ryuHost: '',
  plztController: '192.168.30.250', // server that tells optical slot size configuration
  isDebugMode: false
}
export default function settings(state = initialState, action) {
  switch (action.type) {
    case ADD_GRAPH_ENTRY: {
      const { payload } = action;

      return {
        ...state,
        graphEntries: [
          ...state.graphEntries,
          payload
        ]
      };
    }

    case UPDATE_SNMP_HOST: {
      const { payload } = action;

      return {
        ...state,
        snmpHosts: payload
      };
    }

    case UPDATE_RYU_HOST: {
      const { payload } = action;

      return {
        ...state,
        ryuHost: payload
      };
    }

    case UPDATE_IS_DEBUG_MODE: {
      const { payload } = action;

      return {
        ...state,
        isDebugMode: payload
      };
    }

    default:
      return state;
  }
}
