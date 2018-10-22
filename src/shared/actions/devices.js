import "babel-polyfill";
const { map } = require('p-iteration');
const _ = require('lodash');
import {
  getInterfaceIndex,
  getIfDesc,
  getAdminStatus
} from '../utils';
import {
  appendError
} from './errors';

export const REQUEST_DEVICES = 'REQUEST_DEVICES';
export const RECEIVE_DEVICES = 'RECEIVE_DEVICES';

export const requestDevices = () => ({
  type: REQUEST_DEVICES
})

export const receiveDevices = payload => ({
  type: RECEIVE_DEVICES,
  payload
})

export const getDevices = ips =>
  dispatch => {
    dispatch(requestDevices());

    (async () => {
      try {
        const results = await map(ips, async ip => {
          const interfaceIndex = await getInterfaceIndex(ip);
          const devices = await map(interfaceIndex, async index => {
            const desc = await getIfDesc(ip, index);
            const status = await getAdminStatus(ip, index);

            return {
              id: `${ip}::${index}`,
              index,
              ip,
              desc,
              status
            }
          })
          return devices
        })
        dispatch(receiveDevices(_.flatten(results)));
      } catch (e) {
        dispatch(appendError(e.message));
      }
    })()
  }
