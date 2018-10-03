import {
  APPEND_ERROR,
} from '../actions/errors';

const initialState = [{
  timestamp: '17:33:17.838',
  message: '[Example Error] Command failed: snmpwalk -v 2c -c public 192.168.100.2 1.3.6.1.2.1.2.2.1.1 Timeout: No Response from 192.168.100.2'
}]

export default function interfaces(state = initialState, action) {
  switch (action.type) {
    case APPEND_ERROR: {
      const { payload } = action;

      return state.concat(payload);
    }

    default:
      return state;
  }
}
