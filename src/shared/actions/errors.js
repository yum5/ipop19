import moment from 'moment'

export const APPEND_ERROR = 'APPEND_ERROR';

export const appendError = (message) => {
  return {
    type: APPEND_ERROR,
    payload: {
      timestamp: moment().format('HH:mm:ss.SSS'),
      message
    }
  }
}
