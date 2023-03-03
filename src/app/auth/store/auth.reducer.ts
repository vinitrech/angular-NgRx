import {User} from "../user.model";
import {Action} from "@ngrx/store";
import * as AuthActions from "./auth.actions"

export interface State {
    user: User | null
}

const initialState: State = {
    user: null
}

export function authReducer(state = initialState, action: Action) {
    switch (action.type) {
        case AuthActions.LOGIN:
            const actionData = <AuthActions.Login>action
            const newUser = new User(actionData.payload.email, actionData.payload.userId, actionData.payload.token, actionData.payload.expirationDate)

            return {
                ...state,
                user: newUser
            }
        case AuthActions.LOGOUT:
            return {
                ...state,
                user: null
            }
        default:
            return state
    }
}
