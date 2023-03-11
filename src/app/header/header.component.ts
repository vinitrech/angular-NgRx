import {Component, OnDestroy, OnInit} from "@angular/core";
import {DataStorageService} from "../shared/data-storage.service";
import {AuthService} from "../auth/auth.service";
import {map, Subscription} from "rxjs";
import * as fromApp from "../store/app.reducer"
import {Store} from "@ngrx/store";
import * as AuthActions from "../auth/store/auth.actions"
import * as RecipesActions from "../recipes/store/recipes.actions"

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
    loggedUserSubscription: Subscription = new Subscription();
    isMenuCollapsed: boolean = true;
    isAuthenticated: boolean = false;

    constructor(private dataStorageService: DataStorageService, private authService: AuthService, private store: Store<fromApp.AppState>) {

    }

    ngOnInit() {
        this.loggedUserSubscription = this.store.select('auth')
            .pipe(map(authState => authState.user))
            .subscribe((user) => {
                this.isAuthenticated = !!user; // checks if user is not null
            });
    }

    ngOnDestroy() {
        this.loggedUserSubscription.unsubscribe();
    }

    onSaveData() {
        this.dataStorageService.storeRecipes();
    }

    onFetchData() {
        this.store.dispatch(new RecipesActions.FetchRecipes());
    }

    onLogout() {
        this.store.dispatch(new AuthActions.Logout());
    }
}
