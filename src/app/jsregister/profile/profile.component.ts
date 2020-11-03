import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from './../../../../_services/employee.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  myProfileBasicInfo = [];
  totalConnects = [];
  skillInfo = [];
  expInfo = [];
  companyProfiles = [];
  eduInfo = [];
  socialMediaLinks = [];

  loggedInEmployeeID:any;
  currentUser:any;
  isContentLoaded = false;
  displayUser:any;

  constructor(
    private router: Router,
    private EmployeeService_:EmployeeService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.spinner.show();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.loggedInEmployeeID  = this.currentUser[0].user_id;
    this.displayUser = localStorage.getItem('searchUser');
    localStorage.removeItem('searchUser');
    if(this.displayUser>0)
    {
      this.loadContent(this.displayUser);
      if(this.displayUser!=this.loggedInEmployeeID)
      {
        this.countUpdate(this.displayUser);
      }
      
    }
    else{
      this.loadContent(this.loggedInEmployeeID);
    }

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

  countUpdate(displayUser)
  {
    const _that = this;
        this.EmployeeService_.countUpdate(this.loggedInEmployeeID ,displayUser).subscribe();
  }


}
