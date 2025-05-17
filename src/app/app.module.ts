import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ServiceModule } from "./core/service/service.module";
import { NgxsDevelopmentModule, NgxsModule } from "@ngxs/store";
import { ProductsState } from "./state/products/products.state";
import { NgxsLoggerPluginModule } from "@ngxs/logger-plugin";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { environment } from "src/environments/environment";
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceModule,
    NgxsModule.forRoot([ProductsState]),
    NgxsLoggerPluginModule.forRoot(),

    // NgxsStoragePluginModule.forRoot({
    //   keys: ["products"], // state slices to persist
    //   storage: StorageOption.LocalStorage, // or sessionStorage
    // }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production, // enable only in dev mode
    }),
     NgxsModule.forRoot([], { developmentMode: /** !environment.production */ false }),
     NgxsReduxDevtoolsPluginModule.forRoot(),
     NgxsFormPluginModule.forRoot(),
     NgxsStoragePluginModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
