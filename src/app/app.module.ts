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
import { NgxsFormPluginModule } from "@ngxs/form-plugin";
import { NgxsStoragePluginModule, StorageOption } from "@ngxs/storage-plugin";
import { HttpClientModule } from "@angular/common/http";
import { ProductModule } from "./modules/product/product.module";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceModule,
    ProductModule,
    FormsModule,
    HttpClientModule,
    NgxsModule.forRoot([ProductsState]),
    NgxsLoggerPluginModule.forRoot(),

    NgxsStoragePluginModule.forRoot({
      keys: ["products"], // state slices to persist
      storage: StorageOption.LocalStorage, // or sessionStorage
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production, // enable only in dev mode
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
