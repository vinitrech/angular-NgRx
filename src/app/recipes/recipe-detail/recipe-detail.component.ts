import {Component, OnInit} from '@angular/core';
import {Recipe} from "../../shared/recipe.model";
import {RecipesService} from "../../shared/recipesService";
import {ActivatedRoute, Router} from "@angular/router";
import * as fromApp from "../../store/app.reducer"
import {Store} from "@ngrx/store";
import {map, switchMap} from "rxjs";

@Component({
    selector: 'app-recipes-detail',
    templateUrl: './recipe-detail.component.html',
    styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
    recipe: Recipe = new Recipe("", "", "", []);
    id: number = 0;

    constructor(private recipeService: RecipesService, private activeRoute: ActivatedRoute, private router: Router, private store: Store<fromApp.AppState>) {
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
        this.recipeService.addIngredients(this.recipe.ingredients);
    }

    deleteRecipe() {
        this.recipeService.deleteRecipe(this.id);
        this.router.navigate(["../"], {relativeTo: this.activeRoute});
    }
}
