import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as RecipesActions from "./recipes.actions"
import {map, switchMap} from "rxjs";
import {Recipe} from "../../shared/recipe.model";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable() // injectable should be here to allow the injections
export class RecipesEffects {

    constructor(private actions$: Actions, private httpClient: HttpClient) {
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
}