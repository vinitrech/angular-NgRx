import {Component, OnInit} from '@angular/core';
import {Recipe} from "../../shared/recipe.model";
import {ActivatedRoute, Router} from "@angular/router";
import * as fromApp from "../../store/app.reducer"
import {Store} from "@ngrx/store";
import {map, switchMap} from "rxjs";
import * as RecipesActions from "../store/recipes.actions"
import * as ShoppingListActions from "../../shopping-list/store/shopping-list.actions"

@Component({
    selector: 'app-recipes-detail',
    templateUrl: './recipe-detail.component.html',
    styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
    recipe: Recipe = new Recipe("", "", "", []);
    id: number = 0;

    constructor(private activeRoute: ActivatedRoute, private router: Router, private store: Store<fromApp.AppState>) {
    }

    ngOnInit() {
        this.activeRoute.params.pipe(map(params => {
                return +params['id'];
            }), switchMap((id) => {
                this.id = id;
                return this.store.select('recipes');
            }),
            map(recipesState => {
                return recipesState.recipes.find((recipe, index) => {
                    return index === this.id
                })
            })).subscribe(recipe => {
            if (recipe !== undefined) {
                this.recipe = recipe;
            }
        });
    }

    addToShoppingList() {
        this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));
    }

    deleteRecipe() {
        this.store.dispatch(new RecipesActions.DeleteRecipe(this.id));
        this.router.navigate(["../"], {relativeTo: this.activeRoute});
    }
}
