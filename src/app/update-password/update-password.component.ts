import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../../_services/authentication.service';
import { Subscription } from 'rxjs';
import { AlertsService } from 'angular-alert-module';
import { ConfirmPasswordValidator } from '../../../_validators/confirm-password.validator';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'facehiring-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {

  title = 'Update Password';
  updatePasswordForm: FormGroup;
  submitted = false;
  loading = false;
  employeeDetails = [];
  returnUrl: '';
  currentUser =  '';
  isCredentialsCorrect = true;
  activationString = '';
  phide = true;
  cphide = true;
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
    this.userSubscription = this.route.params.subscribe(
      (params: Params) => {
        this.activationString = params.string;
    })

    this.updatePasswordForm = this.formBuilder.group({
      activationCode: ['',
                [
                  Validators.required, 
                  Validators.pattern(/^[1-9]\d*$/) // Only allow numbers
                ]
            ],
            password: ['',
                [
                    Validators.required,
                    Validators.minLength(6)

                ]
            ],
            confirmPassword:
                ['',
                    [
                        Validators.required,
                        Validators.minLength(6)

                    ]
                ]
    },
    { validator: ConfirmPasswordValidator.MatchPassword }
    );

  }

  get f() { return this.updatePasswordForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.updatePasswordForm.invalid) {
      return;
    }

    this.loading = true;
             this.authenticationService.modifyPassword(
                                                        this.f.activationCode.value,
                                                        this.activationString,
                                                        this.f.password.value
                                                        )
                 .pipe(first())
                 .subscribe(
                     data => {
                          
                          if(data.msg == 'fail')
                          {
                            this.loading = false;
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            this.alerts.setDefaults('timeout',500);
                            this.alerts.setMessage('Your actication code is not valied','error');
                          }
                          else {
                            $('.alertsContainer .alertsRow.error').attr("style", "display: none !important");
                            this.loading = false;
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            this.alerts.setDefaults('timeout',500);
                            this.alerts.setMessage('Thank you. Your password has been updated! Please wait ..' ,'success');
                              setTimeout(function(){
                                window.location.href = '/';
                              }, 5000);
                       }
                     },
                     error => {
                        this.loading = false;
                     });

  }


}
