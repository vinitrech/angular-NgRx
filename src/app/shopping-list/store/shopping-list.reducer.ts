import {Ingredient} from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";
import {Action} from "@ngrx/store";

const initialState: { ingredients: Ingredient[] } = {
    ingredients: [
        new Ingredient("Apples", 1),
        new Ingredient("Tomatoes", 1)
    ]
}

export function shoppingListReducer(state = initialState, action: Action) { // default value assignment to the state param
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT: // naming convention
            return {
                ...state, // always copy the old data and then override what's needed
                ingredients: [ // override ingredients
                    ...state.ingredients,
                    (<ShoppingListActions.AddIngredient>action).payload
                ]
            };
        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [
                    ...state.ingredients,
                    ...(<ShoppingListActions.AddIngredients>action).payload
                ]
            };
        case ShoppingListActions.UPDATE_INGREDIENT:

            // ############## IMPORTANT ##############
            // Always edit data immutably, copying and editing the new object and not altering the state directly

            const ingredientIndex = (<ShoppingListActions.UpdateIngredient>action).payload.index;
            const ingredientNewData = (<ShoppingListActions.UpdateIngredient>action).payload.ingredient;

            const updatedIngredient = {
                ...state.ingredients[ingredientIndex], // copy all values from previous state
                ...ingredientNewData // override properties with updated values
            }

            const updatedIngredients = [...state.ingredients];
            updatedIngredients[ingredientIndex] = updatedIngredient;

            return {
                ...state,
                ingredients: updatedIngredients
            };
        case ShoppingListActions.DELETE_INGREDIENT:
            const actionPayload = (<ShoppingListActions.DeleteIngredient>action).payload

            return {
                ...state,
                ingredients: state.ingredients.filter((ig, igIndex) => {
                    return igIndex !== actionPayload
                })
            };
        default:
            return state;
    }
}
