import {Component, OnDestroy, OnInit} from '@angular/core';
import {Recipe} from "../../shared/recipe.model";
import {map, Subscription} from "rxjs";
import * as fromApp from "../../store/app.reducer"
import {Store} from "@ngrx/store";

@Component({
    selector: 'app-recipes-list',
    templateUrl: './recipe-list.component.html',
    styleUrls: ['./recipe-list.component.css']
})

export class RecipeListComponent implements OnInit, OnDestroy {
    recipes: Recipe[] = []
    recipesChangedSubscription = new Subscription();

    constructor(private store: Store<fromApp.AppState>) {
    }

    ngOnInit() {
        this.recipesChangedSubscription = this.store.select('recipes')
            .pipe(map(recipesState =>
                recipesState.recipes
            ))
            .subscribe((recipes) => {
                this.recipes = recipes;
            });
    }

    ngOnDestroy() {
        this.recipesChangedSubscription.unsubscribe();
    }
}
