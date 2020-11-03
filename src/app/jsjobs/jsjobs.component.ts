import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router , ActivatedRoute, Params } from '@angular/router';
import { EmployeeService } from './../../../_services/employee.service';
import { NgxSpinnerService } from "ngx-spinner";
import { HrserviceService } from './../../../_services/hrservice.service';
import { Subscription } from 'rxjs';


declare var jQuery: any;
declare var $: any;



@Component({
  selector: 'app-jsjobs',
  templateUrl: './jsjobs.component.html',
  styleUrls: ['./jsjobs.component.css']
})
export class JsjobsComponent implements OnInit {

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
    this.loggedInEmployeeID  = this.currentUser[0].user_id;

    this.userSubscription = this.route.params.subscribe(
      (params: Params) => {
           //------ some code -----
          this.applied = this.route.snapshot.params.applied;
    })

    this.loadContent(this.loggedInEmployeeID, this.applied);
  }

  async loadContent(employeeID, appliedString)
    {
      const _that = this;
      console.log('appliedString' + appliedString);
      const res1 = this.HrserviceService_.getLatestJobs(employeeID).toPromise();
      let res = await Promise.all([res1]);
      //let res = await Promise.all([res1, res4]);
      _that.getLatestJobs = res[0];
      _that.filterJobs = res[0];

      this.isContentLoaded = true;
       this.spinner.hide();
      
       console.log(_that.getLatestJobs);


     
      
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
