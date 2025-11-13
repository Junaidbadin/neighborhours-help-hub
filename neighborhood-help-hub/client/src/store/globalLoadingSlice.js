import { createSlice } from '@reduxjs/toolkit';

const initialState = { loading: false };
 const globalLoadingSlice = createSlice({
   name: 'globalLoading',
   initialState,
   reducers: {
     setLoading: (state, action) => {
       state.loading = action.payload;
     },
   },
 });
export const { setLoading } = globalLoadingSlice.actions;
export default globalLoadingSlice.reducer;
