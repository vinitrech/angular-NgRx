import {
    Component,
    OnDestroy, OnInit,
    ViewChild,
} from "@angular/core";
import {NgForm} from "@angular/forms";
import {AuthService} from "./auth.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {AlertComponent} from "../shared/alert/alert.component";
import {PlaceholderDirective} from "../shared/placeholder/placeholder.directive";
import {Store} from "@ngrx/store";
import * as fromApp from "../store/app.reducer"
import * as AuthActions from "../auth/store/auth.actions"

@Component({
    selector: 'app-auth',
    templateUrl: 'auth.component.html'
})
export class AuthComponent implements OnDestroy, OnInit {
    isLoginMode: boolean = true;
    isLoading: boolean = false;
    @ViewChild(PlaceholderDirective) alertPlaceholder !: PlaceholderDirective; // ViewChild will search for the first occurrence of the informed type
    alertCloseSubscription: Subscription = new Subscription();
    authSubscription: Subscription = new Subscription();

    constructor(private authService: AuthService, private router: Router,
                private store: Store<fromApp.AppState>) {
    }

    ngOnInit() {
        this.authSubscription = this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.loading
            if (authState.authError) {
                this.showErrorAlert(authState.authError);
            }
        })
    }

    ngOnDestroy(): void {
        if (this.alertCloseSubscription) {
            this.alertCloseSubscription.unsubscribe();
        }
        this.authSubscription.unsubscribe()
    }

    private showErrorAlert(message: string) {
        this.alertPlaceholder.viewContainerRef.clear();
        const alertComponent = this.alertPlaceholder.viewContainerRef.createComponent<AlertComponent>(AlertComponent);

        alertComponent.instance.message = message;
        this.alertCloseSubscription = alertComponent.instance.close.subscribe(() => {
            this.alertCloseSubscription.unsubscribe();
            this.alertPlaceholder.viewContainerRef.clear();
            this.onHandleError();
        });
    }

    onHandleError() {
        this.store.dispatch(new AuthActions.ClearError());
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(formValue: NgForm) {
        if (!formValue.valid) {
            return
        }

        const email = formValue.value.email;
        const password = formValue.value.password;

        if (this.isLoginMode) {
            this.store.dispatch(new AuthActions.LoginStart({
                email: email,
                password: password
            }))
        } else {
            this.store.dispatch(new AuthActions.SignupStart({
                    email: email,
                    password: password
                }
            ))
        }

        formValue.reset();
    }
}
