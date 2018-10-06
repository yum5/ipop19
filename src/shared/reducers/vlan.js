import {
  REQUEST_VLAN_CONFIG,
  RECEIVE_VLAN_CONFIG
} from '../actions/vlan';

const initialState = {
  vlanId: 0,
  viaSW: ''
}
export default function packets(state = initialState, action) {
  switch (action.type) {

    case REQUEST_VLAN_CONFIG: {
      return state;
    }

    case RECEIVE_VLAN_CONFIG: {
      const { payload } = action;
      return {
        ...state,
        ...payload
      };
    }

    default:
      return state;
  }
}
