import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { MinMaxValidation } from './../../../../_validators/min-max.validator';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { CommonService } from './../../../../_services/common.service';
import { HrserviceService } from './../../../../_services/hrservice.service';
import { NgxSpinnerService } from "ngx-spinner";
import { AlertsService } from 'angular-alert-module';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ConfirmationDialogService } from './../../confirmation-dialog-component/confirmation-dialog-service';

declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-postjob',
  templateUrl: './postjob.component.html',
  styleUrls: ['./postjob.component.css'],
  providers: [CommonService , HrserviceService,ConfirmationDialogService]
})
export class PostjobComponent implements OnInit {
  postJobForm: FormGroup;
  loading = false;
  submitted = false;
  htmlContent = '';
  imageSrc: string;
  url:string;
  public currentUser:any;
  loggedInEmployeeID:any;
  employeeProfiles:Array<any>;
  isContentLoaded:boolean = false;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '10rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold', 'heading', 'fontName', 'backgroundColor', 'link',
      'unlink',
      'insertImage',
      'insertVideo',]
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  showLocationErrorMessage = false;
  showCompanyErrorMessage = false;
  showSkillErrorMessage = false;
  showPositionErrorMessage = false;

  selectedLocation:any;
  selectedCompany:any;
  selectedPosition:any;
  
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

  ImageSizeerror:boolean = false;
  ImageTypeeerror:boolean = false;
  ResumeTypeError:boolean = false;
  
  public isEmailAvailable = true;
  public isPhoneAvailable = true;

  public isLocationsLoaded = false;
    constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private CommonService_:CommonService,
      private HrserviceService_:HrserviceService,
      private spinner: NgxSpinnerService,
      private alerts: AlertsService,
      private confirmationDialogService: ConfirmationDialogService
     
  ) {
      // redirect to home if already logged in
  }

  ngOnInit(): void {
    this.spinner.show();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    //console.log(this.currentUser);
    this.loggedInEmployeeID  = this.currentUser[0].user_id;
    this.getEmployeeProfile(this.loggedInEmployeeID);

    // this.loggedInEmployeeID  = 16
    
    this.postJobForm = this.formBuilder.group({
        lookingFor:['',[Validators.required]], // alpha num with spaces
        jobLocation:['',[Validators.required]], // alpha num with spaces
        yearMin:['',[Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
        yearMax:['',[Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
        salMin:['',[Validators.required, Validators.pattern(/^[0-9]\d*(\.\d+)?$/)]],
        salMax:['',[Validators.required, Validators.pattern(/^[0-9]\d*(\.\d+)?$/)]],
        jobRole:['',[Validators.required, Validators.pattern(/^[a-z0-9 .\-]+$/i)]], // alpha num with spaces
        industryType:['',[Validators.required]], // alpha num with spaces
        functionalArea:['',[Validators.required]], // alpha num with spaces
        employmentType:['',[Validators.required]], // alpha num with spaces
        roleCategory:['',[Validators.required]], // alpha num with spaces
        requiredQualification:['',[Validators.required ]], 
        jobDesription:['',[Validators.required]],
        jobRes:['',[Validators.required]],
        jobBenefit:['',[Validators.required]]

  },
        {validator: [MinMaxValidation.checkYears , MinMaxValidation.checkSalary]}
  );

  }

  get f() { return this.postJobForm.controls; }

  onSubmit()
  {
    this.submitted = true;

    if (this.postJobForm.invalid) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
       return;
    }
    this.spinner.show();
    const formData = new FormData();
    formData.append('lookingFor', this.postJobForm.value.lookingFor);
    formData.append('jobLocation', this.postJobForm.value.jobLocation);
    formData.append('yearMin', this.postJobForm.value.yearMin);
    formData.append('yearMax', this.postJobForm.value.yearMax);
    formData.append('salMin', this.postJobForm.value.salMin);
    formData.append('salMax', this.postJobForm.value.salMax);
    formData.append('jobRole', this.postJobForm.value.jobRole);
    formData.append('industryType', this.postJobForm.value.industryType);
    formData.append('functionalArea', this.postJobForm.value.functionalArea);
    formData.append('employmentType', this.postJobForm.value.employmentType);
    formData.append('roleCategory', this.postJobForm.value.roleCategory);
    formData.append('requiredQualification', this.postJobForm.value.requiredQualification);
    formData.append('jobDesription', this.postJobForm.value.jobDesription);
    formData.append('jobRes', this.postJobForm.value.jobRes);
    formData.append('jobBenefit', this.postJobForm.value.jobBenefit);
    formData.append('loggedInUser', this.loggedInEmployeeID);  


    const _that = this;
            this.HrserviceService_
            .submitPost(formData)
            .subscribe((resp) => {
              this.spinner.hide();
               window.scrollTo({ top: 0, behavior: 'smooth' });
               this.alerts.setMessage('Thank you. Your job posting has been successfully updated! Please wait ..' ,'success');
               setTimeout(function(){
                $('.alertsContainer .alertsRow.success').attr("style", "display: none !important");
               _that.router.navigate(['/hrpostings']);
               }, 5000);

        });
  
  }

  public getEmployeeProfile(employeeID)
    {
        const _that = this;
        this.HrserviceService_
      .getEmployeeProfile(employeeID)
      .subscribe(employeeProfiles => (_that.employeeProfiles = employeeProfiles))
      .add(() => {
        /*console.log(_that.employeeProfiles['profileData'][0].firstName);*/
       // console.log(_that.employeeProfiles);
       this.isContentLoaded = true;
       this.spinner.hide();
      });

    }

    cancelRegForm() {
      this.confirmationDialogService.confirm('Please confirm..', 'Do you want to cancel')
        .then((confirmed) => { if (confirmed) { this.router.navigate(['/hrregister/home']); } })
        .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  
    }

    removeYearMax()
    {
      $("#yearMaxID").val('');
    }
    removeMaxSalary()
    {
      $("#salMaxID").val('');
    }

}
