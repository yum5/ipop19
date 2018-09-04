import {
  ADD_GRAPH_ENTRY,
  REMOVE_GRAPH_ENTRY
} from '../actions/settings';

const initialState = {
  // times: [],
  graphEntries: []
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

    default:
      return state;
  }
}
