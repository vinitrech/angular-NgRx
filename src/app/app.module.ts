import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from './app.component';
import {HeaderComponent} from "./header/header.component";
import {SharedModule} from "./shared/shared.module";
import {CoreModule} from "./core.module";
import {StoreModule} from "@ngrx/store";
import * as fromApp from "./store/app.reducer";
import {EffectsModule} from "@ngrx/effects";
import {AuthEffects} from "./auth/store/auth.effects";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {environment} from "../environments/environment"
import {StoreRouterConnectingModule} from "@ngrx/router-store";

// There should not be unused imports here, they would be bundled even if not used.

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
    ],
    imports: [ // Eager imports
        BrowserModule,
        NgbModule,
        AppRoutingModule,
        StoreModule.forRoot(fromApp.appReducer), // upon initializing, there will be initial actions dispatched / any action dispatched hits ALL reducers
        EffectsModule.forRoot([AuthEffects]),
        StoreDevtoolsModule.instrument({logOnly: environment.production}), // Store dev tools to sync with Redux Dev Tools extension for browser, to monitor actions on the go
        StoreRouterConnectingModule.forRoot(), // Bindings to connect Angular Router with Store
        HttpClientModule,
        SharedModule, // Components, directives, pipes work standalone inside modules, so every module needs its own imports. The only exception are services, which can be declared in the AppModule only once, and used application wide
        CoreModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
