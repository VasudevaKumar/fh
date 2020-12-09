import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ConfirmPasswordValidator } from './../../../_validators/confirm-password.validator';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { CommonService } from './../../../_services/common.service';
import { HrserviceService } from './../../../_services/hrservice.service';
import { NgxSpinnerService } from "ngx-spinner";
import { AlertsService } from 'angular-alert-module';
import { ConfirmationDialogService } from './../confirmation-dialog-component/confirmation-dialog-service';

declare var jQuery: any;
declare var $: any;

@Component({
    selector: 'app-hrregister',
    templateUrl: './hrregister.component.html',
    styleUrls: ['./hrregister.component.css'],
    providers: [CommonService, HrserviceService, ConfirmationDialogService]
})
export class HrregisterComponent implements OnInit {

    registerForm: FormGroup;
    loading = false;
    submitted = false;
    locations: Array<any>;
    positions: Array<any>;
    companies: Array<any>;
    skills: Array<any>;
    genders: Array<any>;
    languages: Array<any>;

    imageSrc: string;
    url: string;

    showLocationErrorMessage = false;
    showCompanyErrorMessage = false;
    showSkillErrorMessage = false;
    showPositionErrorMessage = false;

    selectedLocation: any;
    selectedCompany: any;
    selectedPosition: any;

    /* Skills */
    dropdownList = [];
    selectedSkillItems = [];
    dropdownSettings = {};
    slectedSkillItemString = '';

    separateDialCode = true;
    SearchCountryField = SearchCountryField;
    TooltipLabel = TooltipLabel;
    CountryISO = CountryISO;
    preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

    ImageSizeerror: boolean = false;
    ImageTypeeerror: boolean = false;
    ImageRequired: boolean = false;
    ResumeTypeError: boolean = false;
    ImageWidth: boolean = false;


    public isEmailAvailable = true;
    public isPhoneAvailable = true;

    public isLocationsLoaded = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private CommonService_: CommonService,
        private HrserviceService_: HrserviceService,
        private spinner: NgxSpinnerService,
        private alerts: AlertsService,
        private confirmationDialogService: ConfirmationDialogService

    ) {
        // redirect to home if already logged in
    }

    changePreferredCountries() {
        this.preferredCountries = [CountryISO.India, CountryISO.Canada];
    }

    ngOnInit() {
        this.spinner.show();
        this.selectedSkillItems = [];
        this.loadLocations();
        this.registerForm = this.formBuilder.group({

            companyName: ['',
                [
                    Validators.required,
                    //  Validators.pattern(/^([a-zA-Z]+\s)*[a-zA-Z]+$/)
                    Validators.pattern(/^[a-z0-9 .,_@\-]+$/i)  // alpha number with spaces and few special

                ]
            ],
            companyContact: ['',
                [
                    Validators.required,
                    Validators.pattern(/^([a-zA-Z]+\s)*[a-zA-Z]+$/) // Only alpha with space
                ]
            ],
            designation: ['',
                [
                    Validators.required,
                    Validators.pattern(/^([a-zA-Z]+\s)*[a-zA-Z]+$/) // Only alpha with space
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
                ],
            emailAddress: ['',
                [
                    Validators.required,
                    Validators.email,
                    //Validators.pattern(/^([\w-.]+@(?!gmail\.com)(?!yahoo\.com)(?!hotmail\.com)(?!mail\.ru)(?!yandex\.ru)(?!mail\.com)([\w-]+.)+[\w-]{2,4})?$/)
                    Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
                ]
            ],

            sizeOfCompany: ['',
                [
                    Validators.required,
                    Validators.pattern(/^[1-9]\d*$/)
                ]
            ],

            phoneNumber: ['',
                [
                    Validators.required
                ]
            ],
            aboutCompany: ['',
                [
                    Validators.required
                ]
            ],

            ddlLocation:
                [
                    '', [Validators.required]
                ],
            companyAddress: [
                '', [
                    Validators.required,
                    Validators.pattern(/[A-Za-z0-9'\.\-\s\,]/) // 
                ]
            ],
            file: [],
            fileSource: [],
            webSite: ['',
                [
                    Validators.required,
                    Validators.pattern(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/)
                ]
            ],
            Industry: ['',

                [
                    Validators.required,
                    // Validators.pattern(/^([a-zA-Z]+\s)*[a-zA-Z]+$/)
                    Validators.pattern(/^[a-z0-9 .,_@\-]+$/i)  // alpha number with spaces and few special
                ]
            ],
            companyType: ['',
                [
                    Validators.required,
                    // Validators.pattern(/^([a-zA-Z]+\s)*[a-zA-Z]+$/)
                    Validators.pattern(/^[a-z0-9 .,_@\-]+$/i)  // alpha number with spaces and few special
                ]
            ],
            Founded: ['',
                [
                    Validators.required,
                    Validators.pattern(/^[1-9]\d*$/)
                ]
            ],
            headQts: [
                '',
                [
                    Validators.required,
                    Validators.pattern(/^[a-z0-9 .,_@\-]+$/i)  // alpha number with spaces and few special
                ]
            ],
            specialties: [
                '',
                [
                    Validators.required,
                    Validators.pattern(/^[a-z0-9 .,_@\-]+$/i)  // alpha number with spaces and few special
                ]
            ]

        },
            { validator: ConfirmPasswordValidator.MatchPassword }
        );
    }
    months(months: any) {
        throw new Error("Method not implemented.");
    }


    get f() { return this.registerForm.controls; }

    /*
    onFileChange(event) {
  
        if (event.target.files.length > 0) {
            var reader = new FileReader();
                reader.onload = (event:any) => {

                this.imageSrc = event.target.result;
            }
            reader.readAsDataURL(event.target.files[0]);
            const file = event.target.files[0];
            this.registerForm.patchValue({
                fileSource: file
            });
        }
      }
     */


    onFileChange(event) {
        let reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            // console.log(file.size);
            // console.log(file);
            this.ImageRequired = false;
            this.ImageTypeeerror = false;
            this.ImageSizeerror = false;

            var pattern = /image-*/;
            if (!file.type.match(pattern)) {
                this.ImageTypeeerror = true;
                return;
            }
            else if (parseInt(file.size) > 2000000) {
                this.ImageSizeerror = true;
                return;
            }
            else {
                let img = new Image();
                img.src = window.URL.createObjectURL(file);
                reader.readAsDataURL(file);
                reader.onload = (event: any) => {
                    setTimeout(() => {
                        const width = img.naturalWidth;
                        const height = img.naturalHeight;
                        window.URL.revokeObjectURL(img.src);

                        // console.log(width + '*' + height);
                        if (width < 200) {
                            this.resetImage();
                            this.ImageWidth = true;
                            return;
                        }


                        // console.log(event.target);
                        this.ImageSizeerror = false;
                        this.ImageTypeeerror = false;
                        this.ImageWidth = false;

                        var canvas = document.createElement("canvas");
                        var context = canvas.getContext("2d");
                        // defining cause it wasnt
                        var maxWidth = 130,
                            maxHeight = 130;

                        if (img.width > maxWidth) {
                            var ratio = maxWidth / img.width;
                        }
                        else if (img.height > maxHeight) {
                            ratio = maxHeight / img.height;
                        }
                        else {
                            ratio = 1;
                        }

                        canvas.width = img.width;
                        canvas.height = img.height;
                        context.drawImage(img, 0, 0);

                        canvas.width = img.width * ratio;
                        canvas.height = img.width * ratio;
                        //context.drawImage(canvas, 0, 0, canvas.width, canvas.height);


                        context.drawImage(img,
                            0,
                            0,
                            img.width,
                            img.height,
                            0,
                            0,
                            canvas.width,
                            canvas.height
                        );

                        this.imageSrc = canvas.toDataURL();
                        this.registerForm.patchValue({
                            fileSource: file
                        });



                    }, 100);
                };
            } // else 
        }

    }

    onSubmit() {
        this.submitted = true;


        if (typeof (this.selectedLocation) == 'undefined') {
            this.showLocationErrorMessage = true;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        } else {
            this.showLocationErrorMessage = false;
        }

        if (!this.registerForm.value.file) {
            this.ImageRequired = true;
        }

        if (this.ImageRequired) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (this.registerForm.invalid) {
            // console.log('invalid');
            //this.findInvalidControls();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        this.spinner.show();

        const formData = new FormData();

        formData.append('aboutCompany', this.registerForm.value.aboutCompany);
        formData.append('companyName', this.registerForm.value.companyName);
        formData.append('companyContact', this.registerForm.value.companyContact);
        formData.append('designation', this.registerForm.value.designation);
        formData.append('phoneNumber', this.registerForm.value.phoneNumber.internationalNumber);
        formData.append('emailAddress', this.registerForm.value.emailAddress);
        formData.append('sizeOfCompany', this.registerForm.value.sizeOfCompany);
        formData.append('ddlLocation', this.selectedLocation['id']);
        formData.append('companyAddress', this.registerForm.value.companyAddress);
        formData.append('webSite', this.registerForm.value.webSite);
        formData.append('Industry', this.registerForm.value.Industry);
        formData.append('companyType', this.registerForm.value.companyType);
        formData.append('Founded', this.registerForm.value.Founded);
        formData.append('headQts', this.registerForm.value.headQts);
        formData.append('specialties', this.registerForm.value.specialties);
        formData.append('password', this.registerForm.value.password);
        formData.append('file', this.registerForm.value.file);
        formData.append('fileSource', this.registerForm.value.fileSource);
        const _that = this;
        this.HrserviceService_
            .submitEmployeeRegister(formData)
            .subscribe((resp) => {
                // const respMsg = "Thank you for that information. We will log this request to be completed within 30 days";
                //  this.showFlashMsg(respMsg,"success");
                // console.log(resp);
                // console.log(resp.status_code);

                if (resp.status_code == '201') {
                    this.spinner.hide();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    this.alerts.setDefaults('timeout', 500);
                    this.alerts.setMessage(resp.message, 'error');
                    $("#primaryPhoneNumber").val('');
                    $("#phoneAvailability").html(resp.message);
                    $("#phoneAvailability").show();

                }
                else {
                    this.spinner.hide();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    $('.alertsContainer .alertsRow.error').attr("style", "display: none !important");
                    this.alerts.setMessage('Thank you. Your registration has been completed! Please check your email to activate the facehiring account! Please wait ..', 'success');
                    setTimeout(function () {
                        $('.alertsContainer .alertsRow.success').attr("style", "display: none !important");
                        _that.router.navigate(['/']);
                    }, 5000);

                }


            });


    }

    /* Auto completes */
    location_keyword = 'locationName';

    selectLocationEvent(item) {
        // do something with selected item
        this.selectedLocation = item;
        this.showLocationErrorMessage = false;
    }

    onChangeLocationSearch(val: string) {
        // fetch remote data from here
        // And reassign the 'data' which is binded to 'data' property.
    }

    onLocationFocused(e) {
        // do something when input is focused
    }
    onLocationClosed(e) {
        // this.showLocationErrorMessage = true;
    }


    hidePhoneAvailability() {
        $("#phoneAvailability").hide();
    }
    resetImage() {
        this.ImageRequired = true;
        this.imageSrc = 'assets/img/p13.png';

    }
    resetEmailValidation() {

    }
    verifyEmailAvailability(emailAddress) {

        if (emailAddress != '') {
            this.isEmailAvailable = true;
            this.HrserviceService_
                .verifyEmailAvailability(emailAddress)
                .subscribe((resp) => {
                    // console.log(resp.length);
                    if (resp.length > 0) {
                        $("#emailAddress").val('');
                        this.isEmailAvailable = false;
                    }

                });
        }
    }


    loadLocations() {
        const _that = this;
        _that.isLocationsLoaded = false;

        this.CommonService_
            .getLocations()
            .subscribe(locations => (_that.locations = locations))
            .add(() => {
                _that.isLocationsLoaded = true;
                this.spinner.hide();
            });

    }

    cancelRegForm() {
        this.confirmationDialogService.confirm('Please confirm..', 'Do you want to cancel')
            .then((confirmed) => { if (confirmed) { window.location.href = '/'; } })
            .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));

    }


    public findInvalidControls() {
        const invalid = [];
        const controls = this.registerForm.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        console.log(invalid);
    }


}
