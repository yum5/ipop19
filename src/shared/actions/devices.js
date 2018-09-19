import "babel-polyfill";
import cmd from 'node-cmd';
const { map } = require('p-iteration');
const _ = require('lodash');
import {
  getInterfacesCmd,
  getInterfaceIndex,
  getIfDesc,
  getAdminStatus
} from '../utils';

export const REQUEST_DEVICES = 'REQUEST_DEVICES';
export const RECEIVE_DEVICES = 'RECEIVE_DEVICES';

export const requestDevices = () => {
  return {
    type: REQUEST_DEVICES
  }
}

export const receiveDevices = (payload) => {
  return {
    type: RECEIVE_DEVICES,
    payload
  }
}

export const getDevices = (ips) =>
  dispatch => {
    dispatch(requestDevices());
    // const { command, parser } = getInterfacesCmd();
    //
    // cmd.get(command,
    //   function(err, data, stderr) {
    //     const list = parser(data);
    //
    //     dispatch(receiveDevices(list));
    //   }
    // );
    (async () => {
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
    })()
  }
