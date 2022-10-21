import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgbdModalBasic } from './sell-modal.component';

@NgModule({
  imports: [BrowserModule, NgbModule],
  declarations: [NgbdModalBasic],
  exports: [NgbdModalBasic],
  bootstrap: [NgbdModalBasic],
})
export class NgbdModalBasicModule {}
