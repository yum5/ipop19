import {
  REQUEST_DEVICES,
  RECEIVE_DEVICES
} from '../actions/devices';

const initialState = {
  nic: [],
  interfaces: []
}

export default function interfaces(state = initialState, action) {
  switch (action.type) {
    case REQUEST_DEVICES: {
      return state;
    }
    case RECEIVE_DEVICES: {
      const { payload } = action;

      return {
        ...state,
        nic: [...payload],
        interfaces: payload
      };
    }

    default:
      return state;
  }
}
