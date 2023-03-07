import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import * as fromApp from "../store/app.reducer"
import * as AuthActions from "./store/auth.actions"

@Injectable({providedIn: 'root'})
export class AuthService {
    private tokenExpirationTimer: NodeJS.Timeout = setTimeout(() => {
    }, 0);

    constructor(private store: Store<fromApp.AppState>) {

    }

    setLogoutTimer(expirationDuration: number) {
        this.clearLogoutTimer() // just for precaution
        this.tokenExpirationTimer = setTimeout(() => {
            this.store.dispatch(new AuthActions.Logout())
        }, expirationDuration)
    }

    clearLogoutTimer() {
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer)
        }
    }
}
