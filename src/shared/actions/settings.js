import cmd from 'node-cmd';
import { getPacketCount, getInterfaces } from '../utils';

export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';
export const APPEND_TIME = 'APPEND_TIME';

export const updateSettings = (newSetting) => {
  return {
    type: UPDATE_SETTINGS,
    payload: newSetting
  }
}

export const appendTime = (time) => {
  return {
    type: APPEND_TIME,
    payload: time
  }
}
