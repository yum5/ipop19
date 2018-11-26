import {
  REQUEST_DEVICES,
  RECEIVE_DEVICES
} from '../actions/devices';

const initialState = {
  // watch TX ports of ToR1 to analyze energy consumption
  dataSources: [
    {
      id: 'tx--to-spine',
      index: 10,
      ip: '192.168.100.11',
      desc: 'packets going to spine SW',
      status: 'up'
    },
    {
      id: 'tx--to-mems',
      index: 10,
      ip: '192.168.100.11',
      desc: 'packets going to mems SW',
      status: 'up'
    },
    {
      id: 'tx--to-plzt',
      index: 10,
      ip: '192.168.100.11',
      desc: 'packets going to plzt SW',
      status: 'up'
    }
  ],
  interfaces: [
    {
      id: 'mf',
      index: 10,
      ip: '192.168.100.11',
      desc: 'mf interface',
      status: 'up'
    },
    {
      id: 'df',
      index: 10,
      ip: '192.168.100.12',
      desc: 'df interface',
      status: 'up'
    },
    {
      id: 'ef',
      index: 11,
      ip: '192.168.100.13',
      desc: 'ef interface',
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
