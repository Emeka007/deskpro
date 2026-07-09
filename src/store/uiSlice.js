import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toast:       null,   // { message, type: 'success' | 'error' | 'info' }
    sidebarOpen: false,
  },
  reducers: {
    showToast(state, action) {
      state.toast = action.payload;
    },
    clearToast(state) {
      state.toast = null;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const selectToast       = (state) => state.ui.toast;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;

export const { showToast, clearToast, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
