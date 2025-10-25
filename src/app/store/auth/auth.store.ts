import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { createFeature, createReducer, on } from '@ngrx/store';
import {
  User,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  VerifyOtpRequest,
  VerifyEmailRequest,
  SendTokenVerifyEmailRequest,
  ResetPasswordRequest,
  CreateSuperAdminRequest,
} from '../../api';

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  status: 'idle' | 'loading' | 'authenticated' | 'error';
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  accessToken: null,
  status: 'idle',
  error: null,
};

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    login: props<{ credentials: LoginRequest }>(),
    loginSuccess: props<{ response: LoginResponse }>(),
    loginFailure: props<{ error: string }>(),
    register: props<{ payload: RegisterRequest }>(),
    registerSuccess: props<{ user: User }>(),
    registerFailure: props<{ error: string }>(),
    logout: emptyProps(),
    hydrate: emptyProps(),
    hydrateComplete: props<{ user: User | null; accessToken: string | null }>(),

    verifyOtp: props<{ payload: VerifyOtpRequest }>(),
    verifyOtpSuccess: props<{ ok: boolean }>(),
    verifyOtpFailure: props<{ error: string }>(),

    verifyEmail: props<{ payload: VerifyEmailRequest }>(),
    verifyEmailSuccess: props<{ message: string }>(),
    verifyEmailFailure: props<{ error: string }>(),

    sendTokenVerifyEmail: props<{ payload: SendTokenVerifyEmailRequest }>(),
    sendTokenVerifyEmailSuccess: props<{ message: string }>(),
    sendTokenVerifyEmailFailure: props<{ error: string }>(),

    sendTokenResetPassword: props<{ userEmail: string }>(),
    sendTokenResetPasswordSuccess: props<{ message: string }>(),
    sendTokenResetPasswordFailure: props<{ error: string }>(),

    resetPassword: props<{ payload: ResetPasswordRequest }>(),
    resetPasswordSuccess: props<{ message: string }>(),
    resetPasswordFailure: props<{ error: string }>(),

    resendOtp: props<{ login: string }>(),
    resendOtpSuccess: props<{ message: string }>(),
    resendOtpFailure: props<{ error: string }>(),

    createSuperAdmin: props<{ payload: CreateSuperAdminRequest }>(),
    createSuperAdminSuccess: props<{ message: string }>(),
    createSuperAdminFailure: props<{ error: string }>(),
  },
});

export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.login, (state) => ({ ...state, status: 'loading', error: null })),
  on(AuthActions.loginSuccess, (state, { response }) => ({
    ...state,
    status: 'authenticated',
    accessToken: response.accessToken,
    user: response.user,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    status: 'error',
    error,
  })),
  on(AuthActions.register, (state) => ({ ...state, status: 'loading', error: null })),
  on(AuthActions.registerSuccess, (state, { user }) => ({
    ...state,
    user,
    status: 'idle',
    error: null,
  })),
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    status: 'error',
    error,
  })),
  on(AuthActions.logout, () => ({ ...initialAuthState })),
  on(AuthActions.hydrateComplete, (state, { user, accessToken }) => ({
    ...state,
    user,
    accessToken,
    status: accessToken ? 'authenticated' : 'idle',
  })),

  // Extended AUTH flows - status and error management
  on(AuthActions.verifyOtp, (state) => ({ ...state, status: 'loading', error: null })),
  on(AuthActions.verifyOtpSuccess, (state) => ({ ...state, status: 'idle', error: null })),
  on(AuthActions.verifyOtpFailure, (state, { error }) => ({ ...state, status: 'error', error })),

  on(AuthActions.verifyEmail, (state) => ({ ...state, status: 'loading', error: null })),
  on(AuthActions.verifyEmailSuccess, (state) => ({ ...state, status: 'idle', error: null })),
  on(AuthActions.verifyEmailFailure, (state, { error }) => ({ ...state, status: 'error', error })),

  on(AuthActions.sendTokenVerifyEmail, (state) => ({ ...state, status: 'loading', error: null })),
  on(AuthActions.sendTokenVerifyEmailSuccess, (state) => ({
    ...state,
    status: 'idle',
    error: null,
  })),
  on(AuthActions.sendTokenVerifyEmailFailure, (state, { error }) => ({
    ...state,
    status: 'error',
    error,
  })),

  on(AuthActions.sendTokenResetPassword, (state) => ({ ...state, status: 'loading', error: null })),
  on(AuthActions.sendTokenResetPasswordSuccess, (state) => ({
    ...state,
    status: 'idle',
    error: null,
  })),
  on(AuthActions.sendTokenResetPasswordFailure, (state, { error }) => ({
    ...state,
    status: 'error',
    error,
  })),

  on(AuthActions.resetPassword, (state) => ({ ...state, status: 'loading', error: null })),
  on(AuthActions.resetPasswordSuccess, (state) => ({ ...state, status: 'idle', error: null })),
  on(AuthActions.resetPasswordFailure, (state, { error }) => ({
    ...state,
    status: 'error',
    error,
  })),

  on(AuthActions.resendOtp, (state) => ({ ...state, status: 'loading', error: null })),
  on(AuthActions.resendOtpSuccess, (state) => ({ ...state, status: 'idle', error: null })),
  on(AuthActions.resendOtpFailure, (state, { error }) => ({ ...state, status: 'error', error })),

  on(AuthActions.createSuperAdmin, (state) => ({ ...state, status: 'loading', error: null })),
  on(AuthActions.createSuperAdminSuccess, (state) => ({ ...state, status: 'idle', error: null })),
  on(AuthActions.createSuperAdminFailure, (state, { error }) => ({
    ...state,
    status: 'error',
    error,
  })),
);

export const authFeature = createFeature({
  name: 'auth',
  reducer: authReducer,
});

export const { selectAuthState, selectAccessToken, selectUser, selectStatus, selectError } =
  authFeature;
