import {
  APPEND_TIME,
} from '../actions/settings';

const initialState = {
  times: [],
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

    default:
      return state;
  }
}
