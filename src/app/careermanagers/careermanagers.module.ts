import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CareermanagersRoutingModule } from './careermanagers-routing.module';
import { CareermanagersComponent } from './careermanagers.component';
import { RegisterComponent } from './register/register.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

@NgModule({
  declarations: [CareermanagersComponent, RegisterComponent],
  imports: [
    CommonModule,
    CareermanagersRoutingModule,
    NgxIntlTelInputModule,
    ReactiveFormsModule,
    FormsModule

  ]
})
export class CareermanagersModule { }