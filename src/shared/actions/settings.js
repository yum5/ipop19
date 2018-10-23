const electronSettings = require('electron-settings');

export const ADD_GRAPH_ENTRY = 'ADD_GRAPH_ENTRY';
// export const REMOVE_GRAPH_ENTRY = 'REMOVE_GRAPH_ENTRY';
export const UPDATE_SNMP_HOST = 'UPDATE_SNMP_HOST';
export const UPDATE_RYU_HOST = 'UPDATE_RYU_HOST';
export const REQUEST_LOAD_SETTINGS = 'REQUEST_LOAD_SETTINGS';
export const RECEIVE_LOAD_SETTINGS = 'RECEIVE_LOAD_SETTINGS';
export const REQUEST_SAVE_SETTINGS = 'REQUEST_SAVE_SETTINGS';


export const addGraphEntry = entry => ({
  type: ADD_GRAPH_ENTRY,
  payload: entry
})

export const updateSnmpHost = entry => ({
  type: UPDATE_SNMP_HOST,
  payload: entry
})

export const updateRyuHost = entry => ({
  type: UPDATE_RYU_HOST,
  payload: entry
})

export const requestLoadSettings = () => ({
  type: REQUEST_LOAD_SETTINGS
})

// export const receiveLoadSettings = payload => {
//   return {
//     type: RECEIVE_LOAD_SETTINGS,
//     payload
//   }
// }


export const loadSettings = () =>
  dispatch => {
    dispatch(requestLoadSettings())
    const snmpHosts = JSON.parse(electronSettings.get('settings.snmpHosts') || `["192.168.1.1"]`);
    const ryuHost = JSON.parse(electronSettings.get('settings.ryuHost') || `"192.168.100.21"`);
    dispatch(updateSnmpHost(snmpHosts));
    dispatch(updateRyuHost(ryuHost));
    // dispatch(receiveLoadSettings());
  }


export const requestSaveSettings = () => ({
  type: REQUEST_SAVE_SETTINGS
})

// TODO: this is not compatible with action creators
// consider move this to reducer??? or somewhere else ???
export const saveSettings = settings =>
  dispatch => {
    dispatch(requestSaveSettings())

    electronSettings.set('settings', {
      snmpHosts: JSON.stringify(settings.snmpHosts),
      ryuHost: JSON.stringify(settings.ryuHost)
    });
  }
