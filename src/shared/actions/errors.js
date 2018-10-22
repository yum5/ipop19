import moment from 'moment'

export const APPEND_ERROR = 'APPEND_ERROR';

export const appendError = message => ({
  type: APPEND_ERROR,
  payload: {
    timestamp: moment().format('HH:mm:ss.SSS'),
    message
  }
})
