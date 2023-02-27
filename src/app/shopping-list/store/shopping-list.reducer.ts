import {Ingredient} from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";
import {Action} from "@ngrx/store";

export interface State { // always prefer interfaces to types, only use types when interfaces don't suffice
    ingredients: Ingredient[],
    editedIngredient: Ingredient | null,
    editedIngredientIndex: number
}

export interface AppState { // creating interface to encapsulate the store state in the shoppingListReducer's point of view, so that the places that use this reducer only have access to the shoppingList state
    shoppingList: State
}

const initialState: State = {
    ingredients: [
        new Ingredient("Apples", 1),
        new Ingredient("Tomatoes", 1)
    ],
    editedIngredient: null,
    editedIngredientIndex: -1
}

export function shoppingListReducer(state: State = initialState, action: Action) { // default value assignment to the state param
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
