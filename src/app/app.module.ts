import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { AppComponent } from './app.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { DataService } from './services/data.service';
import { ErrorLogModalModule } from './home/error-log/ErrorLogModal.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ErrorLogModalModule,
  ],
  providers: [
    // { provide: RouteReuseStrategy, useClass: HashLocationStrategy },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    DataService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
