import * as fromShoppingList from "../shopping-list/store/shopping-list.reducer";
import * as fromAuth from "../auth/store/auth.reducer";
import * as fromRecipes from "../recipes/store/recipes.reducer"
import {ActionReducerMap} from "@ngrx/store";

export interface AppState { // creating interface to encapsulate the store state in the shoppingListReducer's point of view, so that the places that use this reducer only have access to the shoppingList state
    shoppingList: fromShoppingList.State,
    auth: fromAuth.State,
    recipes: fromRecipes.State
}

export const appReducer: ActionReducerMap<AppState> = {
    shoppingList: fromShoppingList.shoppingListReducer,
    auth: fromAuth.authReducer,
    recipes: fromRecipes.recipesReducer
}
