import {
  REQUEST_VLAN_CONFIG,
  RECEIVE_VLAN_CONFIG
} from '../actions/vlan';

const initialState = [
  // {
  //   vlanId: 13,
  //   viaSW: 'mems',
  // },
  {
    vlanId: 15,
    viaSW: 'plzt',
  }
];

export default function packets(state = initialState, action) {
  switch (action.type) {

    case REQUEST_VLAN_CONFIG: {
      return state;
    }

    case RECEIVE_VLAN_CONFIG: {
      const { payload } = action;
      // return {
      //   ...state,
      //   ...payload
      // };
      return payload
    }

    default:
      return state;
  }
}
