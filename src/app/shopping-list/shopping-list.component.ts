import {Component, OnDestroy, OnInit} from '@angular/core';
import {Ingredient} from "../shared/ingredient.model";
import {ShoppingListService} from "../shared/shoppingListService";
import {Observable, Subscription} from "rxjs";
import {LoggingService} from "../logging.service";
import {Store} from "@ngrx/store";

@Component({
    selector: 'app-shopping-list',
    templateUrl: './shopping-list.component.html',
    styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
    ingredients: Observable<{ ingredients: Ingredient[] }> = new Observable<{ ingredients: Ingredient[] }>();
    // private ingredientsChanged: Subscription = new Subscription();

    constructor(private shoppingListService: ShoppingListService,
                private loggingService: LoggingService,
                private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>) {
    }

    ngOnInit() {

        this.ingredients = this.store.select('shoppingList') // this takes care of subscribing to changes and initializing

        // this.ingredients = this.shoppingListService.getIngredients();
        //
        // this.ingredientsChanged = this.shoppingListService.onIngredientAdded
        //     .subscribe((ingredients: Ingredient[]) => {
        //         this.ingredients = ingredients;
        //     });

        this.loggingService.printLog('Hello from Shopping List Component ngOnInit')
    }

    ngOnDestroy() {
        // this.ingredientsChanged.unsubscribe();
    }

    onEditItem(id: number) {
        this.shoppingListService.startedEditing.next(id);
    }
}
