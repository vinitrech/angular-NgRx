import {Injectable} from "@angular/core";
import {HttpClient,} from "@angular/common/http";
import {RecipesService} from "./recipesService";
import {environment} from "../../environments/environment";
import * as fromApp from "../store/app.reducer"
import * as RecipesActions from "../recipes/store/recipes.actions"
import {Store} from "@ngrx/store";

@Injectable({providedIn: 'root'})
export class DataStorageService {
    constructor(private httpClient: HttpClient, private recipesService: RecipesService, private store: Store<fromApp.AppState>) { // HttpClient requires HttpClientModule to be imported in AppModule
    }

    storeRecipes() {
        const recipes = this.recipesService.getRecipes();
        this.httpClient.put(environment.apiUrl, recipes).subscribe(response => {
            console.log(response);
        });
    }

    fetchRecipes() {
        this.store.dispatch(new RecipesActions.FetchRecipes());
    }
}
