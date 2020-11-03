import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../../_services/authentication.service';
import { RegisterService } from '../../../_services/register.service';
import {InteractionService} from '../../../_services/interaction.service';

import { Subscription } from 'rxjs';
import { AlertsService } from 'angular-alert-module';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';


declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'facehiring-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponentComponent implements OnInit {

  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  title = 'login';
  loginForm: FormGroup;
  registerForm: FormGroup;
  submitted = false;
  loading = false;
  loginPage = true;
  registrationPage = false;
  
  employeeDetails = [];
  returnUrl: '';
  currentUser =  '';
  isCredentialsCorrect = true;
  role_id = 2;
  userSubscription: Subscription;
  hide = true;

  step1 = true;
  step2 = false;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private registerService : RegisterService,
    private router: Router,
    private route: ActivatedRoute,
    private alerts: AlertsService,
    private _interactionService:InteractionService
  ){

    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
  }
  }

  changePreferredCountries() {
		this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }
  
  ngOnInit(): void {
    this.authenticationService.logout();
    this.clearLocalstorage();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    

    this.userSubscription = this.route.params.subscribe(
      (params: Params) => {
       // console.log(params);
    })


    this.loginForm = this.formBuilder.group({
      emailAddress: ['',
                [
                  Validators.required, 
                  Validators.email,
                  Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
                ]
            ],
            password: ['',
                [
                    Validators.required,
                    Validators.minLength(6)

                ]
            ]
    });

    this.registerForm = this.formBuilder.group({
      regEmailAddress: ['',
                [
                  Validators.required, 
                  Validators.email,
                  Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
                ]
            ],
            firstName: ['',
                [
                    Validators.required,
                    Validators.pattern(/^([a-zA-Z]+\s)*[a-zA-Z]+$/)
                    
                ]
            ],
            lastName: ['',
                [
                    Validators.required,
                    Validators.pattern(/^([a-zA-Z]+\s)*[a-zA-Z]+$/)
                ]
            ],
            phoneNumber: ['', 
                        [
                            Validators.required
                        ]
                ]
    });


  }
  get f() { return this.loginForm.controls; }
  get fr() { return this.registerForm.controls; }

  onSubmit() {
    const _that = this;
    
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
            
             this.loading = true;
             this.authenticationService.login(this.f.emailAddress.value, this.f.password.value, this.role_id)
                 .pipe(first())
                 .subscribe(
                     data => {
                         if(data.data.msg == 'fail')
                         {
                            this.loading = false;
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            this.alerts.setDefaults('timeout',500);
                            this.alerts.setMessage(data.data.returnMessage,'error');

                         }
                         else {
                          _that.loginPage = false;
                          $("#loginDialog").dialog('close');
                          $('.alertsContainer .alertsRow.error').attr("style", "display: none !important");
                           this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
                          // console.log(this.currentUser);
                          this.loading = false;
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          this.alerts.setDefaults('timeout',500);
                          this.alerts.setMessage(data.data.returnMessage ,'success');
                          
                          if(this.currentUser.length > 0)
                          {
                            _that.loginPage = false;
                            this._interactionService.sendMessage(this.currentUser[0]['role_id']);
                            $("#loginDialog").dialog('close');
                            if(this.currentUser[0]['role_id'] == 2)
                            {
                              setTimeout(function(){
                                $('.alertsContainer .alertsRow.success').attr("style", "display: none !important");
                                _that.router.navigate(['/jspostings']);
                                }, 8000);
                            }
                            if(this.currentUser[0]['role_id'] == 3)
                            {
                              setTimeout(function(){
                                $('.alertsContainer .alertsRow.success').attr("style", "display: none !important");
                                _that.router.navigate(['/hrregister/home']);
                              }, 8000);
                            }
                          }
                         }
                        
                     },
                     error => {
                        this.loading = false;
                     });

  }

  forgotPassword()
  {
    // alert('here');
    this.loginPage = false;
    $("#loginDialog").dialog('close');
    this.router.navigate(['/forgotPassword']);
  }
  
  register(roleID)
  {
    /*
    this.role_id = roleID;
    this.loginPage = false;
    this.registrationPage = true;
    */
   if(roleID == 2)
    {
      window.location.href = '/profile/signup';
    }

    if(roleID == 3)
    {
      window.location.href = '/employee';
    }

  }
  openLoginForm(roleID)
  {
    this.role_id = roleID;
    this.loginPage = true;
    this.registrationPage = false;

    $('#loginDialog').dialog({
      modal: true,
       title: 'Login here',
       zIndex: 10000,
       maxHeight: 270,
       height: 270,
       maxWidth: 425,
       width: 425,
       resizable: false,
       close: this.loginFormClose,
       dialogClass: 'no-titlebar'
     });
  }

  loginFormClose()
  {
    $('.alertsContainer .alertsRow.error').attr("style", "display: none !important");
  }



  // Registration Page.

  processRegistration()
  {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
   // this.verifyPhoneAvailability(this.registerForm.value.phoneNumber.internationalNumber);
   this.moveToStep2();
 }
 
 verifyPhoneAvailability(phoneNumber:any)
 {
    this.loading = true;
     const _that = this;
     this.registerService
   .verifyPhoneAvailability(phoneNumber)
  .subscribe((resp) => {
//    console.log(resp);
  if(resp.status_code == '201')
  {
    this.loading = false;
       $("#primaryPhoneNumber").val('');
       $("#phoneAvailability").html(resp.message);
       $("#phoneAvailability").show();
       return;
  } 
  else {
    this.verifyUserName();
  }
    
  });

 }

 verifyUserName()
 {
   let firstName = this.registerForm.value.firstName;
   let lastName = this.registerForm.value.lastName;
   let userName = firstName+'.'+lastName+'@facehiring.com';

    const _that = this;
      this.registerService
    .verifyUserName(userName,firstName,lastName)
    .subscribe((resp) => {
     // console.log(resp);
     this.loading = false;
     if(resp.status_code == '200')
     {
        this.saveRegistration();
     }
    });

 }

 saveRegistration()
 {
  let firstName = this.registerForm.value.firstName;
  let lastName = this.registerForm.value.lastName;
  let userName = firstName+'.'+lastName+'@facehiring.com';
  let emailAddress = this.registerForm.value.regEmailAddress; 
  let phoneNumber = this.registerForm.value.phoneNumber.internationalNumber;

  const _that = this;
      this.registerService
    .saveRegistration(userName,firstName,lastName,emailAddress,phoneNumber, this.role_id)
    .subscribe((resp) => {
     //console.log(resp);
    });
 }
 moveToStep2()
 {
   this.step1 = false;
   this.step2 = true;
 }
  cancelRegistration()
  {
    this.loginPage =true;
    this.registrationPage = false;
  }

  hidePhoneAvailability()
  { 

  }
  ngAfterViewInit(){
    this.registerForm.controls.firstName.setValue('');
    this.registerForm.controls.lastName.setValue('');
    this.registerForm.controls.regEmailAddress.setValue('');
    this.registerForm.controls.phoneNumber.setValue('');
  }
    
  clearLocalstorage()
  {
    
    localStorage.removeItem('currentUser');
    localStorage.removeItem('companyID');
    localStorage.removeItem('appliedJob');
    localStorage.removeItem('searchUser');
    localStorage.clear();
  }

}
