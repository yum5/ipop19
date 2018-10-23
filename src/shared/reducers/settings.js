import {
  ADD_GRAPH_ENTRY,
  UPDATE_SNMP_HOST,
  UPDATE_RYU_HOST,
  UPDATE_IS_DEBUG_MODE
} from '../actions/settings';

const initialState = {
  // times: [],
  graphEntries: [],
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
