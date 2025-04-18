import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        error: null,
        message: null,
        user: null,
        isAuthenticated: false,
    },
    reducers: {
        registerRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        registerSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
        },
        registerFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        otpVerificationRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        otpVerificationSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        otpVerificationFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        loginRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        loginSuccess(state, action) {
            console.log('loginSuccess reducer called with:', action.payload);
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.message = action.payload.message;
            state.error = null;
            // Store user role in localStorage for easy access
            localStorage.setItem('userRole', action.payload.user.role);
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        loginFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        logoutRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        logoutSuccess(state) {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.message = null;
            state.error = null;
        },
        logoutFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        resetAuthSlice(state) {
            state.error = null;
            state.loading = false;
            state.message = null;
            state.user = state.user;
            state.isAuthenticated = state.isAuthenticated;
        },
        getUserRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        getUserSuccess(state, action) {
            state.loading = false;
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        getUserFailed(state) {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
        },
        forgotPasswordRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        forgotPasswordSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
        },
        forgotPasswordFailed(state,action) {
            state.loading = false;
            state.error = action.payload;
        },
        resetPasswordRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        resetPasswordSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
        },
        resetPasswordFailed(state) {
            state.loading = false;
            state.error = action.payload;
        },

    }
});

export const resetAuthSlice = () => (dispatch) => {
    dispatch(authSlice.actions.resetAuthSlice());
  };

export const register = (data) => async (dispatch) => {
    dispatch(authSlice.actions.registerRequest());
    await axios
        .post("http://localhost:3000/api/v1/auth/register", data, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => {
            dispatch(authSlice.actions.registerSuccess(res.data));
        })
        .catch((error) => {
            dispatch(authSlice.actions.registerFailed(error.response.data.message));
        });
};

export const otpVerification = (email, otp) => async (dispatch) => {
    dispatch(authSlice.actions.otpVerificationRequest());
    await axios
        .post("http://localhost:3000/api/v1/auth/verify-otp", { email, otp }, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => {
            dispatch(authSlice.actions.otpVerificationSuccess(res.data));
        })
        .catch((error) => {
            dispatch(authSlice.actions.otpVerificationFailed(error.response.data.message));
        });
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      console.log('Login attempt with:', { email });
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/v1/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      console.log('Login response:', response.data);
      
      // Manually dispatch loginSuccess to ensure state is updated
      dispatch(authSlice.actions.loginSuccess(response.data));
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: 'Login failed' });
    }
  }
);

export const logout = () => async (dispatch) => {
    try {
        // First clear the local state and storage
        localStorage.removeItem('user');
        dispatch(authSlice.actions.logoutSuccess());
        
        // Then make the API call to clear the cookie
        await axios.get("http://localhost:3000/api/v1/auth/logout", {
            withCredentials: true,
        });
        
        return true;
    } catch (error) {
        console.error('Logout error:', error);
        // Even if the API call fails, we've already cleared the local state
        // So we still return true to allow navigation
        return true;
    }
};

export const getUser = () => async (dispatch) => {
    // Check if we have a user in localStorage first
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
        dispatch(authSlice.actions.getUserFailed());
        return;
    }

    dispatch(authSlice.actions.getUserRequest());
    try {
        const response = await axios.get(
            "http://localhost:3000/api/v1/auth/profile",
            {
                withCredentials: true,
            }
        );
        dispatch(authSlice.actions.getUserSuccess(response.data));
    } catch (error) {
        console.error("Profile fetch error:", error);
        dispatch(authSlice.actions.getUserFailed());
        // Clear stored user data on auth error
        localStorage.removeItem('user');
    }
};

export const forgotPassword = (email) => async (dispatch) => {
    dispatch(authSlice.actions.forgotPasswordRequest());
    await axios
        .post("http://localhost:3000/api/v1/auth/password/forgot", { email }, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => {
            dispatch(authSlice.actions.forgotPasswordSuccess(res.data));
        })
        .catch((error) => {
            dispatch(authSlice.actions.forgotPasswordFailed(error?.response?.data?.message || "Something went wrong"));
        });
};


export const resetPassword = (data, token) => async (dispatch) => {
    dispatch(authSlice.actions.resetPasswordRequest());
    await axios
        .put(
            `http://localhost:3000/api/v1/auth/password/reset/${token}`,
            data,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        .then((res) => {
            dispatch(authSlice.actions.resetPasswordSuccess(res.data));
        })
        .catch((error) => {
            dispatch(
                authSlice.actions.resetPasswordFailed(error.response.data.message)
            );
        });
};

export default  authSlice.reducer;