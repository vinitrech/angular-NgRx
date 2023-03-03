import {Component, OnDestroy, OnInit} from '@angular/core';
import {Ingredient} from "../shared/ingredient.model";
import {Observable} from "rxjs";
import {LoggingService} from "../logging.service";
import {Store} from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import * as ShoppingListActions from "./store/shopping-list.actions"

@Component({
    selector: 'app-shopping-list',
    templateUrl: './shopping-list.component.html',
    styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
    ingredients: Observable<{ ingredients: Ingredient[] }> = new Observable<{ ingredients: Ingredient[] }>();

    constructor(
        private loggingService: LoggingService,
        private store: Store<fromApp.AppState>) {
    }

    ngOnInit() {
        this.ingredients = this.store.select('shoppingList') // this takes care of subscribing to changes and initializing
        this.loggingService.printLog('Hello from Shopping List Component ngOnInit')
    }

    onEditItem(id: number) {
        // this.shoppingListService.startedEditing.next(id);
        this.store.dispatch(new ShoppingListActions.StartEdit(id));
    }
}
