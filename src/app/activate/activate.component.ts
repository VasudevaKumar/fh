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
  selector: 'facehiring-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css']
})
export class ActivateComponent implements OnInit {

  title = 'Activation';
  activationForm: FormGroup;
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
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    

    this.userSubscription = this.route.params.subscribe(
      (params: Params) => {
        this.activationString = params.string;
    })


    this.activationForm = this.formBuilder.group({
      activationCode: ['',
                [
                  Validators.required, 
                  Validators.pattern(/^[1-9]\d*$/) // Only allow numbers
                ]
            ]
    });
  }

  get f() { return this.activationForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.activationForm.invalid) {
      return;
    }
            
             this.loading = true;
             this.authenticationService.activate(this.f.activationCode.value , this.activationString)
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
                            this.alerts.setMessage('Thank you. Your profile has been activated! Please wait ..' ,'success');
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

  
