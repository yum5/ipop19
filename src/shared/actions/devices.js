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

export const getDevices = (ips, isDebugMode) =>
  dispatch => {
    dispatch(requestDevices());

    if (isDebugMode) {
      dispatch(receiveDevices([
        {
          id: '192.168.100.11::10',
          index: 10,
          ip: '192.168.100.11',
          desc: 'Example Interface',
          status: 'up'
        },
        {
          id: '192.168.100.12::10',
          index: 10,
          ip: '192.168.100.12',
          desc: 'Example Interface',
          status: 'up'
        },
        {
          id: '192.168.100.13::11',
          index: 11,
          ip: '192.168.100.13',
          desc: 'Example Interface',
          status: 'up'
        },
      ]));
      return;
    }

    (async () => {
      try {
        const results = await map(ips, async ip => {
          const _interfaceIndex = await getInterfaceIndex(ip);
          const interfaceIndex = _interfaceIndex.filter(index => 10 <= index && index < 20);

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
