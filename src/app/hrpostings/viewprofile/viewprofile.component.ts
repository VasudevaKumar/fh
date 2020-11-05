import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router , ActivatedRoute, Params } from '@angular/router';
import { EmployeeService } from './../../../../_services/employee.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-viewprofile',
  templateUrl: './viewprofile.component.html',
  styleUrls: ['./viewprofile.component.css']
})
export class ViewprofileComponent implements OnInit {

  
  myProfileBasicInfo = [];
  totalConnects = [];
  skillInfo = [];
  expInfo = [];
  companyProfiles = [];
  eduInfo = [];
  socialMediaLinks = [];

  profileID:any;
  currentUser:any;
  isContentLoaded = false;
  displayUser:any;
  userSubscription: Subscription;

  constructor(
    private router: Router,
    private EmployeeService_:EmployeeService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.spinner.show();
    this.userSubscription = this.route.params.subscribe(
      (params: Params) => {
           //------ some code -----
          this.profileID = this.route.snapshot.params.id;
          this.loadContent(this.profileID);

    })

  }

  async loadContent(employeeID)
    {
      const _that = this;
      /*
      const res1 = this.EmployeeService_.getMyProfileBasicInfo(employeeID).toPromise();
      const res3 = this.EmployeeService_.getMyProfileSkillInfo(employeeID).toPromise();
      const res4 = this.EmployeeService_.getMyProfileExp(employeeID).toPromise();
      const res5 = this.EmployeeService_.geViewedCompanyProfiles(employeeID).toPromise();
      const res6 = this.EmployeeService_.getMyProfileEducation(employeeID).toPromise();
      const res7 = this.EmployeeService_.getSocialMediaLinks(employeeID).toPromise();
      */

     const res1 = this.EmployeeService_.getProfilePageInfo(employeeID).toPromise();

      let res = await Promise.all([res1]);
      // console.log(res);
      //let res = await Promise.all([res1, res4]);
     
      _that.myProfileBasicInfo = res[0]['basicInfo'];
      _that.skillInfo = res[0]['skillInfo'];
      _that.expInfo = res[0]['experience'];
      _that.companyProfiles = res[0]['viewCompanyProfile'];
      _that.eduInfo = res[0]['education'];
      _that.socialMediaLinks = res[0]['mediaLinks'];
      this.isContentLoaded = true;
      // console.log(this.myProfileBasicInfo);
      //  console.log(this.socialMediaLinks);
      
      // _that.imageSrcLeft =  _that.isEmployeeProfileLoaded.data
      this.spinner.hide();

    }

    logout()
  {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('companyID');
    localStorage.clear();
    window.location.href = '/';
    
  }

}
