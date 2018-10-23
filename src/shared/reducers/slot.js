import {
  REQUEST_SLOT_SIZE,
  RECEIVE_SLOT_SIZE
} from '../actions/slot';

const initialState = {
  slotA: 2,
  slotB: 3,
  slotC: 5
}

export default function slot(state = initialState, action) {
  switch (action.type) {

    case REQUEST_SLOT_SIZE: {
      return state;
    }

    case RECEIVE_SLOT_SIZE: {
      const { payload } = action;
      return payload
    }

    default:
      return state;
  }
}
