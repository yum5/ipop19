import {
  APPEND_TIME,
  RECEIVE_PACKET_COUNT
} from '../actions/settings';

const initialState = {
  times: [],
  counts: []
}
export default function settings(state = initialState, action) {
  switch (action.type) {
    case APPEND_TIME: {
      const { payload } = action;

      return {
        ...state,
        times: state.times.concat(payload)
      };
    }

    case RECEIVE_PACKET_COUNT: {
      const { payload } = action;

      return {
        ...state,
        counts: state.counts.concat(payload)
      };
    }

    default:
      return state;
  }
}
