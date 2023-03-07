import {Injectable} from "@angular/core";
import {User} from "./user.model";
import {Store} from "@ngrx/store";
import * as fromApp from "../store/app.reducer"

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

    }
}
