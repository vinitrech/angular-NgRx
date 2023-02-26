import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ShoppingListService} from "../../shared/shoppingListService";
import {NgForm} from "@angular/forms";
import {Ingredient} from "../../shared/ingredient.model";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as ShoppingListActions from "../store/shopping-list.actions";

@Component({
    selector: 'app-shopping-edit',
    templateUrl: './shopping-edit.component.html',
    styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
    @ViewChild('ingredientsForm') ingredientsForm!: NgForm;
    editingSubscription: Subscription = new Subscription();
    editMode: boolean = false;
    editedItemIndex: number = 0;
    editedItem: Ingredient = new Ingredient("", 0);

    constructor(private shoppingListService: ShoppingListService,
                private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>) {
    }

    ngOnInit() {
        this.editingSubscription = this.shoppingListService.startedEditing.subscribe((id) => {
            this.editMode = true;
            this.editedItemIndex = id;
            this.editedItem = this.shoppingListService.getIngredient(id);
            this.ingredientsForm.setValue({
                name: this.editedItem.name,
                amount: this.editedItem.amount
            })
        });
    }

    ngOnDestroy() {
        this.editingSubscription.unsubscribe();
    }

    addIngredient(form: NgForm): void {
        const value = form.value;
        const newIngredient = new Ingredient(value.name, value.amount);

        if (this.editMode) {
            // this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient);
            this.store.dispatch(new ShoppingListActions.UpdateIngredient({
                index: this.editedItemIndex,
                ingredient: newIngredient
            }))
        } else {
            // this.shoppingListService.addIngredient(newIngredient);
            this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient)); // the action dispatched will hit the store and then all the reducers. In the reducers the action's type is checked and treated accordingly and then saved in the store.
        }

        this.resetForm();
    }

    resetForm() {
        this.ingredientsForm.reset();
        this.editMode = false;
    }

    removeIngredient() {
        // this.shoppingListService.removeIngredient(this.editedItemIndex);
        this.store.dispatch(new ShoppingListActions.DeleteIngredient(this.editedItemIndex));
        this.resetForm();
    }
}
