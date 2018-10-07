import {
  REQUEST_DEVICES,
  RECEIVE_DEVICES
} from '../actions/devices';

const initialState = {
  nic: [],
  interfaces: [],
  isLoading: false
}

export default function interfaces(state = initialState, action) {
  switch (action.type) {
    case REQUEST_DEVICES: {
      return {
        ...state,
        isLoading: true
      };
    }
    case RECEIVE_DEVICES: {
      const { payload } = action;

      return {
        ...state,
        nic: [...payload],
        interfaces: payload,
        isLoading: false
      };
    }

    default:
      return state;
  }
}
