import {
  REQUEST_PACKET_COUNT,
  RECEIVE_PACKET_COUNT,
} from '../actions/packets';

import moment from 'moment';
import { takeRight } from 'lodash';

const initialState = {
  // **nic_name**: [
  //   rawData: [],
  //   graphData: {
  //     rx: [],
  //     tx: []
  //   }
  // ]
  vlan: {
    vlanId: 0,
    viaSW: ''
  }
}
export default function packets(state = initialState, action) {
  switch (action.type) {
    case REQUEST_PACKET_COUNT: {
      return state;
    }

    case RECEIVE_PACKET_COUNT: {
      const { payload } = action;
      const { device } = payload;

      if (state[device] && state[device].rawData.slice(-1)[0]) {
        const lastEntry = state[device].rawData.slice(-1)[0];

        const timeInterval = moment(payload.timestamp) - moment(lastEntry.timestamp);
        const rxDelta = payload.rx - lastEntry.rx;
        const txDelta = payload.tx - lastEntry.tx;

        const nextEntry = {
          timestamp: payload.timestamp,
          rx: payload.rx,
          tx: payload.tx,
          rxDelta,
          txDelta,
          timeInterval,
          rxDeltaPerSec: rxDelta / timeInterval * 1000,
          txDeltaPerSec: txDelta / timeInterval * 1000
          // rxDeltaPerSec: rxDelta / (timeInterval * 128),
          // txDeltaPerSec: txDelta / (timeInterval * 128)
        };

        return {
          ...state,
          [device]: {
            rawData: state[device].rawData.concat(nextEntry),
            graphData: {
              ...state[device].graphData,
              rx: takeRight(state[device].graphData.rx.concat({
                x: nextEntry.timestamp,
                y: nextEntry.rxDeltaPerSec
              }), 30),
              tx: takeRight(state[device].graphData.tx.concat({
                x: nextEntry.timestamp,
                y: nextEntry.txDeltaPerSec
              }), 30),
            }
          }
        };
      } else {
        const nextEntry = {
          timestamp: payload.timestamp,
          rx: payload.rx,
          tx: payload.tx,
          rxDelta: 0,
          txDelta: 0,
          timeInterval: 0,
          rxDeltaPerSec: 0,
          txDeltaPerSec: 0
        };

        return {
          ...state,
          [device]: {
            rawData: [nextEntry],
            graphData: {
              rx: [{
                x: nextEntry.timestamp,
                y: nextEntry.rxDeltaPerSec
              }],
              tx: [{
                x: nextEntry.timestamp,
                y: nextEntry.txDeltaPerSec
              }],
            }
          }
        }
      }
    }

    default:
      return state;
  }
}
