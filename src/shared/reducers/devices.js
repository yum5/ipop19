import {
  REQUEST_DEVICES,
  RECEIVE_DEVICES
} from '../actions/devices';

const initialState = {
  // watch TX ports of ToR1 to analyze energy consumption
  dataSources: [
    {
      id: 'tx--to-spine',
      index: 19,
      ip: '192.168.100.2',
      desc: 'packets going to spine SW',
      status: 'up'
    },
    {
      id: 'tx--to-mems',
      index: 15,
      ip: '192.168.100.2',
      desc: 'packets going to mems SW',
      status: 'up'
    },
    {
      id: 'tx--to-plzt',
      index: 21,
      ip: '192.168.100.2',
      desc: 'packets going to plzt SW',
      status: 'up'
    }
  ],
  interfaces: [
    {
      id: 'slotA',
      index: 21,
      ip: '192.168.100.14',
      desc: 'slotA interface',
      status: 'up'
    },
    {
      id: 'slotB',
      index: 21,
      ip: '192.168.100.15',
      desc: 'slotB interface',
      status: 'up'
    },
    {
      id: 'slotC',
      index: 21,
      ip: '192.168.100.16',
      desc: 'slotC interface',
      status: 'up'
    }
  ],
  isLoading: false
}

export default function interfaces(state = initialState, action) {
  switch (action.type) {
    case REQUEST_DEVICES: {
      return {
        ...state,
        isLoading: true
      };
    }
    case RECEIVE_DEVICES: {
      const { payload } = action;

      return {
        ...state,
        // nic: [...payload],
        interfaces: [...state.interfaces, ...payload],
        isLoading: false
      };
    }

    default:
      return state;
  }
}
