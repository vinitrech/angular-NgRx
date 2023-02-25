import {Action} from "@ngrx/store";
import {Ingredient} from "../../shared/ingredient.model";

export const ADD_INGREDIENT = 'ADD_INGREDIENT'; // convention of using constant which name is the same as the identifier
export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';
export const UPDATE_INGREDIENT = 'UPDATE_INGREDIENT';
export const DELETE_INGREDIENT = 'DELETE_INGREDIENT';

export class AddIngredient implements Action {
    readonly type: string = ADD_INGREDIENT; // readonly is a good practice for type safety

    constructor(public payload: Ingredient) {
    }
}

export class AddIngredients implements Action {
    readonly type: string = ADD_INGREDIENTS;

    constructor(public payload: Ingredient[]) {
    }
}

export class UpdateIngredient implements Action {
    readonly type: string = UPDATE_INGREDIENT;

    constructor(public payload: { index: number, ingredient: Ingredient }) {
    }
}

export class DeleteIngredient implements Action {
    readonly type: string = DELETE_INGREDIENT;

    constructor(public payload: number) {
    }
}
