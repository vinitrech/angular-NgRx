import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as AuthActions from "./auth.actions"
import {catchError, map, of, switchMap, tap} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {User} from "../user.model";
import {AuthService} from "../auth.service";

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

const handleAuthentication = (resData: AuthResponseData) => {
    const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);

    const user = new User(
        resData.email,
        resData.localId,
        resData.idToken,
        expirationDate
    )

    localStorage.setItem('userData', JSON.stringify(user));

    return new AuthActions.AuthSuccess({ // this action gets dispatched automatically by createEffect()
        email: resData.email,
        userId: resData.localId,
        token: resData.idToken,
        expirationDate: expirationDate
    });
}

const handleError = (error: HttpErrorResponse) => {
    let errorMessage: string = 'An error occurred!';

    if (error.error && error.error.error) {
        switch (error.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already!';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist!';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'Incorrect password!';
                break;
        }
    }

    return of(new AuthActions.AuthFail(errorMessage));
}

@Injectable() // allowing other parts to be injected inside this effects class
export class AuthEffects {
    // All actions dispatched run through the pipe, then ofType filters which type of action should be handled by this observer

    authSignup = createEffect(() =>
        this.actions$.pipe(ofType(AuthActions.SIGNUP_START),
            switchMap((authData: AuthActions.SignupStart) => { // switchMap returns a new observable
                const postData = {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }

                const postOptions = {
                    params: {
                        key: environment.apiKey
                    }
                }

                return this.httpClient.post<AuthResponseData>(environment.apiSignUpUrl,
                    postData,
                    postOptions).pipe(
                    tap(resData => {
                        this.authService.setLogoutTimer(+resData.expiresIn * 1000)
                    }),
                    map(resData => {
                            return handleAuthentication(resData)
                        }
                    ),
                    catchError((error: HttpErrorResponse) => { // must not return error here to avoid killing the main stream
                        // catchError does not wrap the return inside a new observable, like map does
                        return handleError(error);
                    }))
            })
        )
    );

    authLogin = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.LOGIN_START),
                switchMap((authData: AuthActions.LoginStart) => {

                    const postData = {
                        email: authData.payload.email,
                        password: authData.payload.password,
                        returnSecureToken: true
                    }

                    const postOptions = {
                        params: {
                            key: environment.apiKey
                        }
                    }

                    return this.httpClient.post<AuthResponseData>(environment.apiSignInUrl,
                        postData,
                        postOptions).pipe(tap(resData => {
                            this.authService.setLogoutTimer(+resData.expiresIn * 1000)
                        }),
                        map(resData => {
                                return handleAuthentication(resData);
                            }
                        ),
                        catchError((error: HttpErrorResponse) => { // must not return error here to avoid killing the main stream
                            // catchError does not wrap the return inside a new observable, like map does

                            return handleError(error);
                        }))
                })
            )
    ) // NgRx effects will handle subscription automatically | ofType can handle multiple types

    authRedirect = createEffect(() =>
            this.actions$.pipe(ofType(AuthActions.AUTH_SUCCESS), tap(() => {
                this.router.navigate(["/"]);
            }))
        , {dispatch: false}) // this effect doesn't dispatch action, so this config is necessary

    authAutoLogin = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
            if (!localStorage.getItem('userData')) {
                return new AuthActions.Logout();
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
                const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                this.authService.setLogoutTimer(expirationDuration)
                return new AuthActions.AuthSuccess({
                    email: loadedUser.email,
                    userId: loadedUser.id,
                    token: loadedUser.token,
                    expirationDate: new Date(userData._tokenExpirationDate),
                });
            }

            return new AuthActions.Logout();
        })
    ));

    authLogout = createEffect(() =>
            this.actions$.pipe(ofType(AuthActions.LOGOUT),
                tap(() => {
                    this.authService.clearLogoutTimer()
                    localStorage.removeItem('userData');
                    this.router.navigate(['/auth']);
                }))
        , {dispatch: false}) // it has to made clear that the effect doesn't dispatch actions

    // The Actions class is a big observable that allows us to react to actions dispatched, however the idea is not to change state here. New actions are dispatched from here to continue the flow, since this is the place for side effects.
    constructor(private actions$: Actions, private httpClient: HttpClient, private router: Router, private authService: AuthService) { // $ suffix indicates that the variable contains an observable or a stream

    }
}
