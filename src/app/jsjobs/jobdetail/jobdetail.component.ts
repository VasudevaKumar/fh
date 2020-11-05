import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router , ActivatedRoute, Params } from '@angular/router';
import { EmployeeService } from './../../../../_services/employee.service';
import { NgxSpinnerService } from "ngx-spinner";
import { HrserviceService } from './../../../../_services/hrservice.service';
import { Subscription } from 'rxjs';
import { AlertsService } from 'angular-alert-module';

declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-jobdetail',
  templateUrl: './jobdetail.component.html',
  styleUrls: ['./jobdetail.component.css']
})
export class JobdetailComponent implements OnInit {

  
  userSubscription: Subscription;
  
  jobID:any;
  companyID:any;
  jobProfile:Array<any>;
  employeeProfiles:Array<any>;
  isEmployeeProfileLoaded = false;
  imageSrcLeft: string;
  loggedInEmployeeID:any;
  currentUser:any;
  isAlreadyApplied:any

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private HrserviceService_:HrserviceService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private alerts: AlertsService
    ) { }

    ngOnInit(): void {
      this.jobID = localStorage.getItem('jobID');
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.loggedInEmployeeID  = this.currentUser[0].user_id;
      this.isAlreadyApplied = localStorage.getItem('isAlreadyAppled')
      this.getSingleJob(this.jobID);
    }
    /*
    ngOnDestroy(): void {
      this.userSubscription.unsubscribe();
    }
    */
    getSingleJob(jobID)
    {
      this.spinner.show();
        const _that = this;
        this.HrserviceService_
      .getSingleJob(jobID)
      .subscribe(jobProfile => (_that.jobProfile = jobProfile))
      .add(() => {
        /*console.log(_that.employeeProfiles['profileData'][0].firstName);*/
        this.companyID = this.jobProfile[0]['companyID'];
        //console.log(_that.jobProfile);
        this.getEmployeeProfile(this.companyID);

      });

    }

    public getEmployeeProfile(employeeID)
    {
      this.spinner.show();
        const _that = this;
        this.HrserviceService_
      .getEmployeeProfile(employeeID)
      .subscribe(employeeProfiles => (_that.employeeProfiles = employeeProfiles))
      .add(() => {
          this.isEmployeeProfileLoaded = true;
          this.imageSrcLeft = this.employeeProfiles[0]['companyProfilePicture'];
          this.spinner.hide();
          // console.log(this.employeeProfiles);

      });

    }

    applyJob()
    {
      /* 
      console.log(this.loggedInEmployeeID);
      console.log(this.jobID);
      */
     this.spinner.show();
     const _that = this;
     this.HrserviceService_
   .applyJob(this.loggedInEmployeeID , this.jobID)
   .subscribe((resp) => {})
   .add(() => {
     /*console.log(_that.employeeProfiles['profileData'][0].firstName);*/
     this.spinner.hide();
     window.scrollTo({ top: 0, behavior: 'smooth' });
    this.alerts.setDefaults('timeout',500);
    this.alerts.setMessage('Thank you for applying this position. We will get back to you at earliest ' ,'success');

    setTimeout(function(){
      $('.alertsContainer .alertsRow.success').attr("style", "display: none !important");
      _that.router.navigate(['/jsjobs']);
    }, 5000);

   });



    }
}
