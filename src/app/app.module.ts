import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ParserComponent } from './parser/parser.component';
import { ParserUtil } from './parser/parser.util';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ParserComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [ParserUtil],
  bootstrap: [AppComponent]
})
export class AppModule { }
