import cmd from 'node-cmd';
import { getPacketCount, getInterfaces } from '../utils';

export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';
export const REQUEST_PACKET_COUNT = 'REQUEST_PACKET_COUNT';
export const RECEIVE_PACKET_COUNT = 'RECEIVE_PACKET_COUNT';
export const APPEND_TIME = 'APPEND_TIME';

export const updateSettings = (newSetting) => {
  return {
    type: UPDATE_SETTINGS,
    payload: newSetting
  }
}

export const requestPacketCount = () => {
  return {
    type: REQUEST_PACKET_COUNT
  }
}

export const receivePacketCount = (payload) => {
  return {
    type: RECEIVE_PACKET_COUNT,
    payload
  }
}

export const appendTime = (time) => {
  return {
    type: APPEND_TIME,
    payload: time
  }
}

export const packetCount = nic =>
  dispatch => {
    dispatch(requestPacketCount());
    const { command, parser } = getPacketCount(nic);

    cmd.get(command,
      function(err, data, stderr) {
        const result = parser(data);

        dispatch(receivePacketCount({
          timestamp: new Date(),
          rx: result.rx,
          tx: result.tx
        }));
      }
    );
  }
