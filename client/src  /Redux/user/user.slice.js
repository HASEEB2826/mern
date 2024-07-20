import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    SignInStart: (state) => {
      state.loading = true;
    },
    SignInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    SignInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    UpdateInStart: (state) => {
      state.loading = true;
    },
    UpdateInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    UpdateInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    SignOutInStart: (state) => {
      state.loading = true;
    },
    SignOutInSuccess: (state, action) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    SignOutInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    DeleteInStart: (state) => {
      state.loading = true;
    },
    DeleteInSuccess: (state, action) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    DeleteInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  SignInStart,
  SignInSuccess,
  SignInFailure,
  UpdateInStart,
  UpdateInSuccess,
  UpdateInFailure,
  SignOutInStart,
  SignOutInSuccess,
  SignOutInFailure,
  DeleteInStart,
  DeleteInSuccess,
  DeleteInFailure,
} = userSlice.actions;
export default userSlice.reducer;
