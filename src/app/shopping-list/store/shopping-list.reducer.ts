import {Ingredient} from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";
import {Action} from "@ngrx/store";

const initialState = {
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
        default:
            return state;
    }
}
