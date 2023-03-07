import {Action} from "@ngrx/store";

export const LOGIN_START = "[Auth] Login Start"
export const AUTH_FAIL = "[Auth] Auth Fail"
export const AUTH_SUCCESS = '[Auth] Auth Success';
export const LOGOUT = '[Auth] Logout';
export const SIGNUP_START = '[Auth] Sign Up Start';

export class LoginStart implements Action {
    readonly type: string = LOGIN_START

    constructor(public payload: {
        email: string,
        password: string
    }) {
    }
}

export class AuthSuccess implements Action {
    readonly type: string = AUTH_SUCCESS;

    constructor(public payload: { email: string, userId: string, token: string, expirationDate: Date }) {
    }
}

export class Logout implements Action {
    readonly type: string = LOGOUT;
}

export class AuthFail implements Action {
    readonly type: string = AUTH_FAIL

    constructor(public payload: string) {
    }
}

export class SignupStart implements Action {
    readonly type = SIGNUP_START;

    constructor(public payload: { email: string, password: string }) {
    }
}
