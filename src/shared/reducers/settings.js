import {
  ADD_GRAPH_ENTRY,
  REMOVE_GRAPH_ENTRY,
  UPDATE_SNMP_HOST,
  UPDATE_RYU_HOST
} from '../actions/settings';

const initialState = {
  // times: [],
  graphEntries: [],
  snmpHosts: [],
  ryuHost: ''
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

    default:
      return state;
  }
}
