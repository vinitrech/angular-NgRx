import {Injectable} from "@angular/core";
import {User} from "./user.model";
import {Store} from "@ngrx/store";
import * as fromApp from "../store/app.reducer"
import * as AuthActions from "./store/auth.actions";

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
    token: string = '';

    constructor(private store: Store<fromApp.AppState>) {

    }

    autoLogin() {
        if (!localStorage.getItem('userData')) {
            return;
        }

        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string
            // @ts-ignore <- added ignore due to the fact that the localstorage item will never be null when it reaches this point
        } = JSON.parse(localStorage.getItem('userData'));

        const loadedUser: User = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
            this.store.dispatch(new AuthActions.AuthSuccess({
                email: loadedUser.email,
                userId: loadedUser.id,
                token: loadedUser.token,
                expirationDate: new Date(userData._tokenExpirationDate),
            }));
        } else {
            localStorage.removeItem('userData');
        }
    }
}
