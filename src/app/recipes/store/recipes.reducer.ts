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
            };

        case RecipesActions.ADD_RECIPE:
            return {
                ...state,
                recipes: [...state.recipes, (<RecipesActions.AddRecipe>action).payload] // Pull out all elements of the payload
            };

        case RecipesActions.UPDATE_RECIPE:

            const updatedRecipe: Recipe = {
                ...state.recipes[(<RecipesActions.UpdateRecipe>action).payload.index],
                ...(<RecipesActions.UpdateRecipe>action).payload.newRecipe
            };

            const updatedRecipes = [
                ...state.recipes,
            ]

            updatedRecipes[(<RecipesActions.UpdateRecipe>action).payload.index] = updatedRecipe;

            return {
                ...state,
                recipes: updatedRecipes
            };

        case RecipesActions.DELETE_RECIPE:
            return {
                ...state,
                recipes: state.recipes.filter((_, index) => { // filter always returns a new list, so the original one is not mutated
                    return index !== (<RecipesActions.DeleteRecipe>action).payload;
                })
            }
        default:
            return state;
    }
}