import cmd from 'node-cmd';
import { getInterfaces } from '../utils';

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

export const getDevices = () =>
  dispatch => {
    dispatch(requestDevices());
    const { command, parser } = getInterfaces();

    cmd.get(command,
      function(err, data, stderr) {
        const list = parser(data);

        dispatch(receiveDevices(list));
      }
    );
  }
