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

export const { notificate } = notificationSlice.actions
export default notificationSlice.reducer
