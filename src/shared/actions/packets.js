import cmd from 'node-cmd';
import { getPacketCount } from '../utils';

export const REQUEST_PACKET_COUNT = 'REQUEST_PACKET_COUNT';
export const RECEIVE_PACKET_COUNT = 'RECEIVE_PACKET_COUNT';

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

export const packetCount = nic =>
  dispatch => {
    dispatch(requestPacketCount());
    const { command, parser } = getPacketCount(nic);

    cmd.get(command,
      function(err, data, stderr) {
        const result = parser(data);

        dispatch(receivePacketCount({
          device: nic,
          timestamp: new Date(),
          rx: result.rx,
          tx: result.tx
        }));
      }
    );
  }
