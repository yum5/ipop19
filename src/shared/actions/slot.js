import "babel-polyfill";
import { getSlotSize } from '../utils';
import {
  appendError
} from './errors';

export const REQUEST_SLOT_SIZE = 'REQUEST_SLOT_SIZE';
export const RECEIVE_SLOT_SIZE = 'RECEIVE_SLOT_SIZE';

export const requestSlotSize = () => ({
  type: REQUEST_SLOT_SIZE
})

export const receiveSlotSize = payload => ({
  type: RECEIVE_SLOT_SIZE,
  payload
})


export const slotSize = ip =>
  dispatch => {
    dispatch(requestSlotSize());

    (async () => {
      try {
        const slotSize = await getSlotSize(ip);

        dispatch(receiveSlotSize(slotSize));
      } catch (e) {
        dispatch(appendError(e.message));
      }
    })()

  }
