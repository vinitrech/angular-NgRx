import {Action} from "@ngrx/store";
import {Ingredient} from "../../shared/ingredient.model";

export const ADD_INGREDIENT = '[Shopping List] Add Ingredient'; // convention of using constant with the feature prefix for unique identification
export const ADD_INGREDIENTS = '[Shopping List] Add Ingredients';
export const UPDATE_INGREDIENT = '[Shopping List] Update Ingredient';
export const DELETE_INGREDIENT = '[Shopping List] Delete Ingredient';
export const START_EDIT = '[Shopping List] Star Edit';
export const STOP_EDIT = '[Shopping List] Stop Edit';

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

    constructor(public payload: Ingredient) {
    }
}

export class DeleteIngredient implements Action {
    readonly type: string = DELETE_INGREDIENT;
}

export class StartEdit implements Action {
    readonly type: string = START_EDIT;

    constructor(public payload: number) {
    }
}

export class StopEdit implements Action {
    readonly type: string = STOP_EDIT;
}
