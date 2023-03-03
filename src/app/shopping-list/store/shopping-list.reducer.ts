import {Ingredient} from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";
import {Action} from "@ngrx/store";

export interface State { // always prefer interfaces to types, only use types when interfaces don't suffice
    ingredients: Ingredient[],
    editedIngredient: Ingredient | null,
    editedIngredientIndex: number
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

            const updatedIngredient = {
                ...state.ingredients[state.editedIngredientIndex], // copy all values from previous state
                ...(<ShoppingListActions.UpdateIngredient>action).payload // override properties with updated values
            }

            const updatedIngredients = [...state.ingredients];
            updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

            return {
                ...state,
                ingredients: updatedIngredients,
                editedIngredientIndex: -1,
                editedIngredient: null
            };
        case ShoppingListActions.DELETE_INGREDIENT:
            return {
                ...state,
                ingredients: state.ingredients.filter((ig, igIndex) => {
                    return igIndex !== state.editedIngredientIndex
                }),
                editedIngredientIndex: -1,
                editedIngredient: null
            };
        case ShoppingListActions.START_EDIT:
            return {
                ...state,
                editedIngredientIndex: (<ShoppingListActions.StartEdit>action).payload,
                updatedIngredient: {...state.ingredients[(<ShoppingListActions.StartEdit>action).payload]} // copy the ingredient to a new object, because ingredients are an array inside the state, and it is a reference type. So, if we should edit the ingredient, it would change directly inside the store, which is wrong.
            };
        case ShoppingListActions.STOP_EDIT:
            return {
                ...state,
                editedIngredient: null,
                editedIngredientIndex: -1
            };
        default:
            return state;
    }
}
