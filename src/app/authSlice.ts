import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    user: { email: string } | null;
}

const initialState: AuthState = {
    user: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ email: string }>) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
        },
    },
});