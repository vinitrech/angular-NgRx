import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from "@angular/common/http";
import {exhaustMap, map, Observable, take} from "rxjs";
import {Store} from "@ngrx/store";
import * as fromApp from "../store/app.reducer"

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService, private store: Store<fromApp.AppState>) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return this.store.select('auth').pipe(take(1), map(authState => authState.user), exhaustMap(user => {// take will take the specified number of values then unsubscribe / exhaustMap will take the return value from the first observable, then exchange it with the new observable created inside the function

            if (!user) {
                return next.handle(req);
            }

            const modifiedReq = req.clone({
                params: new HttpParams().set('auth', user ? user.token ? user.token : '' : '')
            });
            return next.handle(modifiedReq);
        }));
    }
}
