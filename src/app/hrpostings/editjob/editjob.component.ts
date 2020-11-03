import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router , ActivatedRoute, Params } from '@angular/router';
import { first } from 'rxjs/operators';
import { HrserviceService } from './../../../../_services/hrservice.service';

import { NgxSpinnerService } from "ngx-spinner";
import { AlertsService } from 'angular-alert-module';
import { Subscription } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MinMaxValidation } from './../../../../_validators/min-max.validator';
import { ConfirmationDialogService } from './../../confirmation-dialog-component/confirmation-dialog-service';

declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-editjob',
  templateUrl: './editjob.component.html',
  styleUrls: ['./editjob.component.css'],
  providers: [HrserviceService, ConfirmationDialogService]
})
export class EditjobComponent implements OnInit {

  selectedJobPosting: any[];
  userSubscription: Subscription;
  public currentUser:any;
  loggedInEmployeeID:any;
  postJobForm: FormGroup;
  loading = false;
  submitted = false;
  htmlContent = '';
  rowID:any;
  isContentLoaded:boolean = false;

  employeeProfiles:Array<any>;

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
      ['bold']
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

  constructor( private formBuilder: FormBuilder,
    private router: Router,
    private HrserviceService_:HrserviceService,
    private spinner: NgxSpinnerService,
    private alerts: AlertsService,
    private route: ActivatedRoute,
    private confirmationDialogService: ConfirmationDialogService
    ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.loggedInEmployeeID  = this.currentUser[0].user_id;
    this.getEmployeeProfile(this.loggedInEmployeeID);

    this.userSubscription = this.route.params.subscribe(
      (params: Params) => {
           //------ some code -----
          this.rowID = this.route.snapshot.params.id;
          this.getJobPostingsByID(this.loggedInEmployeeID , this.rowID);
    })
    
    this.postJobForm = this.formBuilder.group({
      lookingFor:['',[Validators.required, Validators.pattern(/^[ A-Za-z0-9_@.,/#&+-]*$/)]], // alpha num with spaces
      jobLocation:['',[Validators.required, Validators.pattern(/^[ A-Za-z0-9_@.,/#&+-]*$/)]], // alpha num with spaces
      yearMin:['',[Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      yearMax:['',[Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      salMin:['',[Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      salMax:['',[Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      jobRole:['',[Validators.required, Validators.pattern(/^[ A-Za-z0-9_@.,/#&+-]*$/)]], // alpha num with spaces
      industryType:['',[Validators.required, Validators.pattern(/^[ A-Za-z0-9_@.,/#&+-]*$/)]], // alpha num with spaces
      functionalArea:['',[Validators.required, Validators.pattern(/^[ A-Za-z0-9_@.,/#&+-]*$/)]], // alpha num with spaces
      employmentType:['',[Validators.required, Validators.pattern(/^[ A-Za-z0-9_@.,/#&+-]*$/)]], // alpha num with spaces
      roleCategory:['',[Validators.required, Validators.pattern(/^[ A-Za-z0-9_@.,/#&+-]*$/)]], // alpha num with spaces
      requiredQualification:['',[Validators.required , Validators.pattern(/^[ A-Za-z0-9_@.,/#&+-]*$/)]], 
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
    formData.append('rowID', this.rowID);  


    const _that = this;
            this.HrserviceService_
            .editPost(formData)
            .subscribe((resp) => {
              this.spinner.hide();
               window.scrollTo({ top: 0, behavior: 'smooth' });
               $('.alertsContainer .alertsRow.error').attr("style", "display: none !important");
               this.alerts.setMessage('Thank you. Your job posting has been successfully updated! Please wait ..' ,'success');
               setTimeout(function(){
               _that.router.navigate(['/hrpostings']);
               }, 5000);

        });
  
  }

  getJobPostingsByID(employeeID , rowID)
  {
    const _that = this;
    this.HrserviceService_
    .getJobPostingsByID(employeeID , rowID)
    .subscribe(selectedJobPosting => (_that.selectedJobPosting = selectedJobPosting))
    .add(() => {
      
      this.postJobForm.controls["lookingFor"].setValue(_that.selectedJobPosting[0].lookingFor);
      this.postJobForm.controls["jobLocation"].setValue(_that.selectedJobPosting[0].jobLocation);
      this.postJobForm.controls["yearMin"].setValue(_that.selectedJobPosting[0].yearMin);
      this.postJobForm.controls["yearMax"].setValue(_that.selectedJobPosting[0].yearMax);
      this.postJobForm.controls["salMin"].setValue(_that.selectedJobPosting[0].salMin);
      this.postJobForm.controls["salMax"].setValue(_that.selectedJobPosting[0].salMax);
      this.postJobForm.controls["jobRole"].setValue(_that.selectedJobPosting[0].jobRole);
      this.postJobForm.controls["industryType"].setValue(_that.selectedJobPosting[0].industryType);
      this.postJobForm.controls["functionalArea"].setValue(_that.selectedJobPosting[0].functionalArea);
      this.postJobForm.controls["employmentType"].setValue(_that.selectedJobPosting[0].employmentType);
      this.postJobForm.controls["roleCategory"].setValue(_that.selectedJobPosting[0].roleCategory);
      this.postJobForm.controls["requiredQualification"].setValue(_that.selectedJobPosting[0].requiredQualification);
      this.postJobForm.controls["jobDesription"].setValue(_that.selectedJobPosting[0].jobDesription);
      this.postJobForm.controls["jobRes"].setValue(_that.selectedJobPosting[0].jobRes);
      this.postJobForm.controls["jobBenefit"].setValue(_that.selectedJobPosting[0].jobBenefit);

      this.spinner.hide();
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
        this.isContentLoaded = true;
      });

    }
  
    cancelRegForm() {
      this.confirmationDialogService.confirm('Please confirm..', 'Do you want to cancel')
        .then((confirmed) => { if (confirmed) { this.router.navigate(['/hrregister/home']); } })
        .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  
    }
    
}
