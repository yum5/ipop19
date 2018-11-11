import {
  ADD_GRAPH_ENTRY,
  UPDATE_SNMP_HOST,
  UPDATE_RYU_HOST,
  UPDATE_IS_DEBUG_MODE
} from '../actions/settings';

const initialState = {
  // times: [],
  graphEntries: [{
    id: 'mf',
    index: 10,
    ip: '192.168.100.11',
    desc: 'mf interface',
    status: 'up'
  },
  {
    id: 'df',
    index: 10,
    ip: '192.168.100.12',
    desc: 'df interface',
    status: 'up'
  },
  {
    id: 'ef',
    index: 11,
    ip: '192.168.100.13',
    desc: 'ef interface',
    status: 'up'
  }],
  snmpHosts: [],
  ryuHost: '',
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
