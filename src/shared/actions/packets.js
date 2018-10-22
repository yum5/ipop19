import "babel-polyfill";
import { getInOctets, getOutOctets } from '../utils';
import {
  appendError
} from './errors';

export const REQUEST_PACKET_COUNT = 'REQUEST_PACKET_COUNT';
export const RECEIVE_PACKET_COUNT = 'RECEIVE_PACKET_COUNT';

export const requestPacketCount = () => ({
  type: REQUEST_PACKET_COUNT
})

export const receivePacketCount = payload => ({
  type: RECEIVE_PACKET_COUNT,
  payload
})

export const packetCount = device =>
  dispatch => {
    dispatch(requestPacketCount());

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
