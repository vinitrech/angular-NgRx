import {Recipe} from "../../shared/recipe.model";
import {Action} from "@ngrx/store";
import * as RecipesActions from "./recipes.actions"

export interface State {
    recipes: Recipe[];
}

const initialState: State = {
    recipes: []
}

export function recipesReducer(state: State = initialState, action: Action) {

    switch (action.type) {
        case RecipesActions.SET_RECIPES:
            return {
                ...state,
                recipes: [...(<RecipesActions.SetRecipes>action).payload] // Pull out all elements of the payload
            }

        default:
            return state;
    }
}