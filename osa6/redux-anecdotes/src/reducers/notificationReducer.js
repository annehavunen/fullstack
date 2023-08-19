import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    notificate(state, action) {
      return action.payload
    },
  },
})

export const setNotification = (content, seconds) => {
  return async dispatch => {
    const milliseconds = seconds * 1000
    dispatch(notificate(content))
    setTimeout(() => {dispatch(notificate(''))}, milliseconds)
  }
}

export const { notificate } = notificationSlice.actions
export default notificationSlice.reducer
