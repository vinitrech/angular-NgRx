import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as RecipesActions from "./recipes.actions"
import {map, switchMap, withLatestFrom} from "rxjs";
import {Recipe} from "../../shared/recipe.model";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import * as fromApp from "../../store/app.reducer"
import {Store} from "@ngrx/store";

@Injectable() // injectable should be here to allow the injections
export class RecipesEffects {

    constructor(private actions$: Actions, private httpClient: HttpClient, private store: Store<fromApp.AppState>) {
    }

    fetchRecipes = createEffect(() =>
        this.actions$.pipe(
            ofType(RecipesActions.FETCH_RECIPES),
            switchMap(() => {
                return this.httpClient.get<Recipe[]>(environment.apiUrl)
            }),
            map(recipes => {
                return recipes.map(recipe => {
                    return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
                });
            }),
            map(recipes => {
                return new RecipesActions.SetRecipes(recipes);
            })
        ));

    storeRecipes = createEffect(() =>
        this.actions$.pipe(
            ofType(RecipesActions.STORE_RECIPES),
            withLatestFrom(this.store.select('recipes')),
            switchMap(
                ([actionData, recipesState]) => {
                    return this.httpClient.put(environment.apiUrl,
                        recipesState.recipes
                    );
                })
        ), {dispatch: false});
}