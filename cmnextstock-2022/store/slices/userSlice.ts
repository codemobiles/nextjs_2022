import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import * as serverService from "@/services/serverService";
import { UserData } from "@/models/user.model";
import { RootState } from "../store";
import httpClient from "@/utils/httpClient";
import { AxiosRequestConfig } from "axios";
import { NextRouter } from "next/router";

// config initialSate
export interface UserState {
  username: string;
  accessToken: string;
  error?: string;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  user?: UserData;
}

const initialState: UserState = {
  username: "",
  accessToken: "",
  isAuthenticated: false,
  isAuthenticating: true,
  user: undefined,
};

// interface of any actions
interface SignInAction {
  username: string;
  password: string;
}

interface SetSessionAction {
  user?: UserData;
  accessToken?: string;
  isAuthenticated: boolean;
}

interface SetUser {
  user: UserData;
}

export const signUp = createAsyncThunk(
  "user/signup",
  async (credential: SignInAction) => {
    const response = await serverService.signUp(credential);
    return response;
  }
);

export const signIn = createAsyncThunk(
  "user/signin",
  async (credential: SignInAction) => {
    const response = await serverService.signIn(credential);
    if (response.result != "ok") {
      throw new Error("login failed");
    }

    // set access token
    httpClient.interceptors.request.use((config?: AxiosRequestConfig) => {
      if (config && config.headers) {
        config.headers["Authorization"] = `Bearer ${response.token}`;
      }

      return config;
    });
    return response;
  }
);

export const signOut = createAsyncThunk(
  "user/signout",
  async (router: NextRouter) => {
    await serverService.signOut();

    // clear token
    httpClient.interceptors.request.use((config?: AxiosRequestConfig) => {
      if (config && config.headers) {
        config.headers["Authorization"] = "";
      }
      return config;
    });

    router.push("/");
  }
);

export const getSession = createAsyncThunk("user/fetchSession", async () => {
  const response = await serverService.getSession();

  // set access token
  if (response) {
    httpClient.interceptors.request.use((config?: AxiosRequestConfig) => {
      if (config && config.headers && response.user) {
        config.headers["Authorization"] = `Bearer ${response.user?.token}`;
      }
      return config;
    });
  }
  return response;
});

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setSession: (state, action: PayloadAction<SetSessionAction>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.isAuthenticating = false;
      if (action.payload.isAuthenticated && action.payload.accessToken) {
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
      }
    },
    setUser: (state, action: PayloadAction<SetUser>) => {
      state.user = action.payload.user;
    },
  },
  extraReducers: (builder) => {
    // fullfiled, pending, rejected
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.accessToken = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isAuthenticating = false;
    });
    builder.addCase(signIn.rejected, (state, action) => {
      state.error = action.error.message;
      state.isAuthenticated = false;
      state.isAuthenticating = false;
    });
    builder.addCase(signUp.fulfilled, (state, action) => {});
    builder.addCase(signOut.fulfilled, (state) => {
      state.accessToken = "";
      state.user = undefined;
      state.isAuthenticated = false;
    });
    builder.addCase(getSession.fulfilled, (state, action) => {
      state.isAuthenticating = false;
      if (action.payload && action.payload.user && action.payload.user.token) {
        state.accessToken = action.payload.user.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      }
    });
  },
});

// export actionCreator
export const { setSession, setUser } = userSlice.actions;

// export common user selector
export const userSelector = (store: RootState): UserData | undefined =>
  store.user.user;
export const isAuthenticatedSelector = (store: RootState): boolean =>
  store.user.isAuthenticated;

// // export reducer
export default userSlice.reducer;
