import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ShoppingListService} from "../../shared/shoppingListService";
import {NgForm} from "@angular/forms";
import {Ingredient} from "../../shared/ingredient.model";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as ShoppingListActions from "../store/shopping-list.actions";
import * as fromShoppingList from "../store/shopping-list.reducer";

@Component({
    selector: 'app-shopping-edit',
    templateUrl: './shopping-edit.component.html',
    styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
    @ViewChild('ingredientsForm') ingredientsForm!: NgForm;
    editingSubscription: Subscription = new Subscription();
    editMode: boolean = false;
    editedItem: Ingredient = new Ingredient("", 0);

    constructor(private shoppingListService: ShoppingListService,
                private store: Store<fromShoppingList.AppState>) {
    }

    ngOnInit() {
        this.editingSubscription = this.store.select('shoppingList').subscribe(stateData => {
            if (stateData.editedIngredientIndex > -1 || stateData.editedIngredient !== null) {
                this.editMode = true;
                //@ts-ignore <- ignoring null check, because it's done above
                this.editedItem = stateData.editedIngredient

                this.ingredientsForm.setValue({
                    name: this.editedItem.name,
                    amount: this.editedItem.amount
                });
            } else {
                this.editMode = false;
            }
        });
    }

    ngOnDestroy() {
        this.editingSubscription.unsubscribe();
        this.store.dispatch(new ShoppingListActions.StopEdit());
    }

    addIngredient(form: NgForm): void {
        const value = form.value;
        const newIngredient = new Ingredient(value.name, value.amount);

        if (this.editMode) {
            // this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient);
            this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient))
        } else {
            // this.shoppingListService.addIngredient(newIngredient);
            this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient)); // the action dispatched will hit the store and then all the reducers. In the reducers the action's type is checked and treated accordingly and then saved in the store.
        }

        this.resetForm();
    }

    resetForm() {
        this.ingredientsForm.reset();
        this.editMode = false;
        this.store.dispatch(new ShoppingListActions.StopEdit());
    }

    removeIngredient() {
        // this.shoppingListService.removeIngredient(this.editedItemIndex);
        this.store.dispatch(new ShoppingListActions.DeleteIngredient());
        this.resetForm();
    }
}
