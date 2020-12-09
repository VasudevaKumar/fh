import { Component, OnInit , Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router , ActivatedRoute, Params } from '@angular/router';
import { first } from 'rxjs/operators';
import { HrserviceService } from './../../../../_services/hrservice.service';

import { NgxSpinnerService } from "ngx-spinner";
import { AlertsService } from 'angular-alert-module';
import { ConfirmationDialogService } from './../../confirmation-dialog-component/confirmation-dialog-service';
import { Subscription } from 'rxjs';

declare var $: any;



@Component({
  selector: 'app-userprofiles',
  templateUrl: './userprofiles.component.html',
  styleUrls: ['./userprofiles.component.css'],
  providers: [HrserviceService, ConfirmationDialogService]
})
export class UserprofilesComponent implements OnInit {

  loggedInEmployeeID:any;
  jobListings:Array<any>;
  public currentUser:any;
  jobID:any;
  public isGridDataReady = false;
  public searchProfiles = '';
  public typeOfProfiles = 'All profiles';

  public gridOptions: any;
  userSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private HrserviceService_:HrserviceService,
    private spinner: NgxSpinnerService,
    private alerts: AlertsService,
    private confirmationDialogService: ConfirmationDialogService,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.spinner.show();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.searchProfiles = localStorage.getItem('searchProfiles');
    
    if(this.searchProfiles == '5')
    {
      this.typeOfProfiles = 'Shortlisted profiles';
    }

    if(this.searchProfiles == '6')
    {
      this.typeOfProfiles = 'Rejected profiles';
    }

    
    this.loggedInEmployeeID  = this.currentUser[0].user_id;

    this.userSubscription = this.route.params.subscribe(
      (params: Params) => {
           //------ some code -----
          this.jobID = this.route.snapshot.params.id;
          this.getjobListings(this.loggedInEmployeeID , this.jobID);
    })


  }

  getjobListings(employeeID , jobID)
  {
      // console.log(this.searchProfiles);

      const _that = this;
          this.HrserviceService_
        .getjobListings(employeeID , jobID , this.searchProfiles)
        .subscribe(jobListings => (_that.jobListings = jobListings))
        .add(() => {
          /*console.log(_that.employeeProfiles['profileData'][0].firstName);*/
         // console.log(_that.jobListings);
          this.isGridDataReady = true;
          
          this.spinner.hide();
        });
  }

  rejectProfile(applicationID:any)
  {
    var item = this.jobListings.find(x => x.application_id == applicationID);
    if (item) {
      item.action_id = 6;
    }
    const _that = this;
          this.HrserviceService_
        .hrAction(applicationID , 6)
        .subscribe()
  }

  shortListProfile(applicationID:any)
  {
    // console.log('application');
    var item = this.jobListings.find(x => x.application_id == applicationID);
    if (item) {
      item.action_id = 5;
    }

    const _that = this;
    this.HrserviceService_
  .hrAction(applicationID , 5)
  .subscribe()


  }

   

}
