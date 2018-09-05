import cmd from 'node-cmd';
import { getInterfacesCmd } from '../utils';

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
    const { command, parser } = getInterfacesCmd();

    cmd.get(command,
      function(err, data, stderr) {
        const list = parser(data);

        dispatch(receiveDevices(list));
      }
    );
  }
