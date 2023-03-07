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
        case AuthActions.AUTH_SUCCESS:
            const actionData = <AuthActions.AuthSuccess>action
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
        // Example of running the same code for more than 1 case
        case AuthActions.LOGIN_START:
        case AuthActions.SIGNUP_START:
            return {
                ...state,
                authError: null,
                loading: true
            }
        case AuthActions.AUTH_FAIL:
            return {
                ...state,
                user: null,
                authError: (<AuthActions.AuthFail>action).payload,
                loading: false
            }
        case AuthActions.CLEAR_ERROR:
            return {
                ...state,
                authError: null
            }
        default:
            return state
    }
}
