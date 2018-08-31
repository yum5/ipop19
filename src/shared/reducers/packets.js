import {
  REQUEST_PACKET_COUNT,
  RECEIVE_PACKET_COUNT
} from '../actions/packets';

import moment from 'moment';
import { takeRight } from 'lodash';

const initialState = {
  rawData: [],
  graphData: {
    rx: [],
    tx: []
  }
}
export default function packets(state = initialState, action) {
  switch (action.type) {
    case REQUEST_PACKET_COUNT: {
      return state;
    }

    case RECEIVE_PACKET_COUNT: {
      const { payload } = action;
      const lastEntry = state.rawData.slice(-1)[0];
      let nextEntry;

      if (lastEntry) {
        const timeInterval = moment(payload.timestamp) - moment(lastEntry.timestamp);
        const rxDelta = payload.rx - lastEntry.rx;
        const txDelta = payload.tx - lastEntry.tx;

        nextEntry = {
          timestamp: payload.timestamp,
          rx: payload.rx,
          tx: payload.tx,
          rxDelta: rxDelta,
          txDelta: txDelta,
          timeInterval: timeInterval,
          rxDeltaPerSec: rxDelta / timeInterval,
          txDeltaPerSec: txDelta / timeInterval
        };
      } else {
        nextEntry = {
          timestamp: payload.timestamp,
          rx: payload.rx,
          tx: payload.tx,
          rxDelta: 0,
          txDelta: 0,
          timeInterval: 0,
          rxDeltaPerSec: 0,
          txDeltaPerSec: 0
        };
      }

      return {
        ...state,
        rawData: state.rawData.concat(nextEntry),
        graphData: {
          ...state.graphData,
          rx: takeRight(state.graphData.rx.concat({
            x: nextEntry.timestamp,
            y: nextEntry.rxDeltaPerSec
          }), 30),
          tx: takeRight(state.graphData.tx.concat({
            x: nextEntry.timestamp,
            y: nextEntry.txDeltaPerSec
          }), 30),
        }
      };
    }

    default:
      return state;
  }
}
