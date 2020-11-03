import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../../_services/authentication.service';
import { Subscription } from 'rxjs';
import { AlertsService } from 'angular-alert-module';


declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'facehiring-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  title = 'Forgot password';
  fgForm: FormGroup;
  submitted = false;
  loading = false;
  employeeDetails = [];
  returnUrl: '';
  currentUser =  '';
  isCredentialsCorrect = true;
  activationString = '';
  
  userSubscription: Subscription;
  
  constructor(private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private alerts: AlertsService,
    private route: ActivatedRoute) { 
      if (this.authenticationService.currentUserValue) {
        this.router.navigate(['/']);
    }

    }

  ngOnInit(): void {

    this.authenticationService.logout();

    this.fgForm = this.formBuilder.group({
      emailAccount: ['',
                [
                  Validators.required, 
                  Validators.email,
                  Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
                ]
            ]
    });

  }

  get f() { return this.fgForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.fgForm.invalid) {
      return;
    }

            this.loading = true;
             this.authenticationService.forgotPassWord(this.f.emailAccount.value)
                 .pipe(first())
                 .subscribe(
                     data => {
                          
                          if(data.msg == 'fail')
                          {
                            this.loading = false;
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            this.alerts.setDefaults('timeout',500);
                            this.alerts.setMessage('Your email account is not valied','error');
                          }
                          else {
                            $('.alertsContainer .alertsRow.error').attr("style", "display: none !important");
                            this.loading = false;
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            this.alerts.setDefaults('timeout',500);
                            this.alerts.setMessage('Thank you. Please check your email to update your password! Please wait ..' ,'success');
                              setTimeout(function(){
                                window.location.href = '/';
                              }, 10000);
                       }
                     },
                     error => {
                        this.loading = false;
                     });
  }


}
