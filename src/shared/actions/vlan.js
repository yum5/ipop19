import "babel-polyfill";
import { getVlanConfig } from '../utils';
import {
  appendError
} from './errors';

export const REQUEST_VLAN_CONFIG = 'REQUEST_VLAN_CONFIG';
export const RECEIVE_VLAN_CONFIG = 'RECEIVE_VLAN_CONFIG';

export const requestVlanConfig = () => {
  return {
    type: REQUEST_VLAN_CONFIG
  }
}

export const receiveVlanConfig = (payload) => {
  return {
    type: RECEIVE_VLAN_CONFIG,
    payload
  }
}


export const vlanConfig = ip =>
  dispatch => {
    dispatch(requestVlanConfig());

    (async () => {
      try {
        const config = await getVlanConfig(ip);

        dispatch(receiveVlanConfig(config));
      } catch (e) {
        dispatch(appendError(e.message));
      }
    })()

  }
