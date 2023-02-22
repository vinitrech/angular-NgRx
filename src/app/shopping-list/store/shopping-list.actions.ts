import {Action} from "@ngrx/store";
import {Ingredient} from "../../shared/ingredient.model";

export const ADD_INGREDIENT = 'ADD_INGREDIENT'; // convention of using constant which name is the same as the identifier

export class AddIngredient implements Action {
    readonly type: string = ADD_INGREDIENT; // readonly is a good practice for type safety
    payload: Ingredient = new Ingredient("name", 1);
}
