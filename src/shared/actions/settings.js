export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';

export const updateSettings = (newSetting) => {
  return {
    type: UPDATE_SETTINGS,
    payload: newSetting
  }
}
