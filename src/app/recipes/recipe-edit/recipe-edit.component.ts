import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import * as fromApp from "../../store/app.reducer"
import {Store} from "@ngrx/store";
import {map, Subscription} from "rxjs";
import * as RecipesActions from "../store/recipes.actions"

@Component({
    selector: 'app-recipe-edit',
    templateUrl: './recipe-edit.component.html',
    styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
    id: number = 0;
    editMode: boolean = false;
    recipeForm!: FormGroup;
    private storeSubscription: Subscription = new Subscription();

    constructor(private router: Router, private activeRoute: ActivatedRoute, private store: Store<fromApp.AppState>) {
    }

    ngOnInit() {
        this.activeRoute.params.subscribe((params: Params) => {
            this.id = +params['id'];
            this.editMode = params['id'] !== undefined;
            this.initForm();
        })
    }

    ngOnDestroy() {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    }

    onAddIngredient() {
        (<FormArray>this.recipeForm.get('ingredients')).push(new FormGroup({
            'name': new FormControl(null, Validators.required),
            'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
        }))
    }

    private initForm() {
        let recipeName = '';
        let recipeImagePath = '';
        let recipeDescription = '';
        let recipeIngredients = new FormArray<FormGroup>([]);

        if (this.editMode) {

            this.storeSubscription = this.store.select('recipes').pipe(map(recipesState => {
                return recipesState.recipes.find((recipe, index) => {
                    return index === this.id;
                })
            })).subscribe(recipe => {
                if (recipe !== undefined) {
                    recipeName = recipe.name;
                    recipeImagePath = recipe.imagePath;
                    recipeDescription = recipe.description;

                    if (recipe['ingredients']) {
                        for (let ingredient of recipe.ingredients) {
                            recipeIngredients.push(
                                new FormGroup({
                                    'name': new FormControl(ingredient.name, Validators.required),
                                    'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
                                })
                            );
                        }
                    }
                }
            })
        }

        this.recipeForm = new FormGroup({
            'name': new FormControl(recipeName, Validators.required),
            'imagePath': new FormControl(recipeImagePath, Validators.required),
            'description': new FormControl(recipeDescription, Validators.required),
            'ingredients': recipeIngredients
        });
    }

    deleteIngredient(index: number) {
        // this.recipeForm.value.ingredients.splice(index, 1); <- this won't work, it will delete but won't fire a change to the screen
        (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
        //(<FormArray>this.recipeForm.get('ingredients')).clear() <- removes all items from array
    }

    cancelForm() {
        this.router.navigate(['../'], {relativeTo: this.activeRoute});
    }

    onSubmit() {
        // const newRecipe = new Recipe(
        //   this.recipeForm.value.name,
        //   this.recipeForm.value.description,
        //   this.recipeForm.value.imagePath,
        //   this.recipeForm.value.ingredients
        // );

        if (this.editMode) {
            this.store.dispatch(new RecipesActions.UpdateRecipe({index: this.id, newRecipe: this.recipeForm.value}));
        } else {
            this.store.dispatch(new RecipesActions.AddRecipe(this.recipeForm.value));
        }

        this.cancelForm();
    }

    getControls() {
        return (<FormArray>this.recipeForm.get('ingredients')).controls;
    }
}
