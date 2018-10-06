import "babel-polyfill";
import cmd from 'node-cmd';
import { getPacketCountCmd, getInOctets, getOutOctets } from '../utils';
import {
  appendError
} from './errors';

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

export const packetCount = device =>
  dispatch => {
    dispatch(requestPacketCount());
    // const { command, parser } = getPacketCountCmd(nic);
    //
    // cmd.get(command,
    //   function(err, data, stderr) {
    //     const result = parser(data);
    //
    //     dispatch(receivePacketCount({
    //       device: nic,
    //       timestamp: new Date(),
    //       rx: result.rx,
    //       tx: result.tx
    //     }));
    //   }
    // );

    (async () => {
      try {
        const { ip, index, id } = device;
        const rx = await getInOctets(ip, index);
        const tx = await getOutOctets(ip, index);

        dispatch(receivePacketCount({
          device: id,
          timestamp: new Date(),
          rx,
          tx
        }));
      } catch (e) {
        dispatch(appendError(e.message));
      }
    })()

  }
