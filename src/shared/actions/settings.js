import cmd from 'node-cmd';

export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';
export const ADD_GRAPH_ENTRY = 'ADD_GRAPH_ENTRY';
export const REMOVE_GRAPH_ENTRY = 'REMOVE_GRAPH_ENTRY';
export const UPDATE_SNMP_HOST = 'UPDATE_SNMP_HOST';


export const updateSettings = (newSetting) => {
  return {
    type: UPDATE_SETTINGS,
    payload: newSetting
  }
}

export const addGraphEntry = (entry) => {
  return {
    type: ADD_GRAPH_ENTRY,
    payload: entry
  }
}

export const updateSnmpHost = (entry) => {
  return {
    type: UPDATE_SNMP_HOST,
    payload: entry
  }
}
