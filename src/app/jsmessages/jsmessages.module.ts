import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsmessagesRoutingModule } from './jsmessages-routing.module';
import { JsmessagesComponent } from './jsmessages.component';
import { Pipe, PipeTransform } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterPipeModule } from 'ngx-filter-pipe';

@Pipe({name: 'replaceImg78'})
export class replaceImg78Pipe implements PipeTransform {
  transform(value: string): string {
    return value.replace('profilePics_130','profilePics_78');
  }
}

@Pipe({name: 'replaceImg40'})
export class replaceImg40Pipe implements PipeTransform {
  transform(value: string): string {
    return value.replace('profilePics_130','profilePics_40');
  }
}



@NgModule({
  declarations: [JsmessagesComponent, replaceImg78Pipe,replaceImg40Pipe],
  imports: [
    CommonModule,
    JsmessagesRoutingModule,
    FormsModule,
    FilterPipeModule
  ]
})
export class JsmessagesModule { }
