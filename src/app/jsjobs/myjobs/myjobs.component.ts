import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router , ActivatedRoute, Params } from '@angular/router';
import { EmployeeService } from './../../../../_services/employee.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NgxSpinnerService } from "ngx-spinner";
import { HrserviceService } from './../../../../_services/hrservice.service';
import { Subscription } from 'rxjs';

declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-myjobs',
  templateUrl: './myjobs.component.html',
  styleUrls: ['./myjobs.component.css']
})
export class MyjobsComponent implements OnInit {

  
  loggedInEmployeeID:any;
  currentUser:any;
  getLatestJobs = [];
  filterJobs = [];
  isContentLoaded = false;
  searchString = '';
  applied = '';
  userSubscription: Subscription;

  constructor(
    private router: Router,
    private EmployeeService_:EmployeeService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private HrserviceService_:HrserviceService,
    private route: ActivatedRoute,
    
) {
    // redirect to home if already logged in
}

  ngOnInit(): void {

    this.spinner.show();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    localStorage.setItem('isAlreadyAppled', 'Yes');
    this.loggedInEmployeeID  = this.currentUser[0].user_id;
    this.myjobs(this.loggedInEmployeeID);
  }
     public myjobs(employeeID)
    {
      this.spinner.show();
        const _that = this;
        this.HrserviceService_
      .myjobs(employeeID)
      .subscribe(getLatestJobs => (_that.getLatestJobs = getLatestJobs))
      .add(() => {
        _that.filterJobs = _that.getLatestJobs;
        this.spinner.hide();

      });

    }
  
  
    filterJobPostings()
    {
      let searchJobString = $("#searchString").val().toLowerCase();
      if(searchJobString!='')
      {
        this.filterJobs = this.filterJobs.filter( ({ lookingFor }) => lookingFor.toLowerCase().includes(searchJobString));
        
      }
      else
      {
        this.filterJobs = this.getLatestJobs;
      }
      
    }
    jobDetailPage(jobID)
    {
      localStorage.removeItem('jobID');
      localStorage.setItem('jobID', jobID);
      this.router.navigate(['/jsjobs/jobdetail']);
    }

}
