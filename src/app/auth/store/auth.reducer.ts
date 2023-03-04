import {User} from "../user.model";
import {Action} from "@ngrx/store";
import * as AuthActions from "./auth.actions"

export interface State {
    user: User | null,
    authError: string | null,
    loading: boolean
}

const initialState: State = {
    user: null,
    authError: null,
    loading: false
}

export function authReducer(state = initialState, action: Action) {
    switch (action.type) {
        case AuthActions.LOGIN:
            const actionData = <AuthActions.Login>action
            const newUser = new User(actionData.payload.email, actionData.payload.userId, actionData.payload.token, actionData.payload.expirationDate)

            return {
                ...state,
                authError: null,
                user: newUser,
                loading: false
            }
        case AuthActions.LOGOUT:
            return {
                ...state,
                user: null
            }
        case AuthActions.LOGIN_START:
            return {
                ...state,
                authError: null,
                loading: true
            }
        case AuthActions.LOGIN_FAILED:
            return {
                ...state,
                user: null,
                authError: (<AuthActions.LoginFailed>action).payload,
                loading: false
            }
        default:
            return state
    }
}
