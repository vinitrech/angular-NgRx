import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Recipe} from "./recipe.model";
import {DataStorageService} from "./data-storage.service";
import {RecipesService} from "./recipesService";
import * as fromApp from "../store/app.reducer";
import * as RecipesActions from "../recipes/store/recipes.actions"
import {Store} from "@ngrx/store";
import {Actions, ofType} from "@ngrx/effects";
import {take} from "rxjs";

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {
    constructor(private dataStorageService: DataStorageService, private recipesService: RecipesService,
                private store: Store<fromApp.AppState>,
                private actions$: Actions) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.store.dispatch(new RecipesActions.FetchRecipes());
        return this.actions$.pipe(ofType(RecipesActions.SET_RECIPES),
            take(1));
    }
}
