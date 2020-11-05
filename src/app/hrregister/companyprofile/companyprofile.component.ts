import { Component, OnInit , Inject  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router , ActivatedRoute, Params } from '@angular/router';
import { first } from 'rxjs/operators';

import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { CommonService } from './../../../../_services/common.service';
import { RegisterService } from './../../../../_services/register.service';
import { HrserviceService } from './../../../../_services/hrservice.service';

import { NgxSpinnerService } from "ngx-spinner";
import { AlertsService } from 'angular-alert-module';
import { Subscription } from 'rxjs';

import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-companyprofile',
  templateUrl: './companyprofile.component.html',
  styleUrls: ['./companyprofile.component.css'],
  providers: [CommonService , RegisterService , HrserviceService]
})
export class CompanyprofileComponent implements OnInit {

  
  profileId:any;
  employeeProfiles:Array<any>;
  similarCompanyProfiles:Array<any>;
  activeJobPostings:Array<any>;
  public currentUser:any;
  imageSrc: string;
  isEmployeeProfileLoaded = false;
  isSimilarProfileLoaded = false;
  userSubscription: Subscription;
  imageSrcLeft: string;
  companyUpdates:Array<any>;
  companyCareers:Array<any>;
  isContentLoaded = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private CommonService_:CommonService,
    private RegisterService_:RegisterService,
    private HrserviceService_:HrserviceService,
    private spinner: NgxSpinnerService,
    private alerts: AlertsService,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document
   
) {
    
}

  ngOnInit(): void {
    this.userSubscription = this.route.params.subscribe(
      (params: Params) => {
           //------ some code -----
          this.profileId = this.route.snapshot.params.id;
          this.getEmployeeProfile(this.profileId);
    })
    
  }

  

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }


  public getEmployeeProfile(employeeID)
    {
      this.spinner.show();
        const _that = this;
        this.HrserviceService_
      .getCompanyProfile(employeeID)
      .subscribe(employeeProfiles => (_that.employeeProfiles = employeeProfiles))
      .add(() => {
        /*console.log(_that.employeeProfiles['profileData'][0].firstName);*/
          // console.log(_that.employeeProfiles);
          this.imageSrcLeft = this.employeeProfiles[0]['companyProfilePicture'];
          this.isEmployeeProfileLoaded = true;
          this.loadCompanyContent(employeeID);

      });

    }

    async loadCompanyContent(employeeID) {
     
      let keyword = this.getFirstWord(this.employeeProfiles[0].Industry);
     /* const similarProfiles = this.HrserviceService_.getSimilarCompanyProfiles(employeeID, keyword).toPromise();
      const updates = this.HrserviceService_.companyUpdates(employeeID).toPromise();
      const careers = this.HrserviceService_.companyCareers(employeeID).toPromise();
      const activeJobs = this.HrserviceService_.getActiveJobs(employeeID).toPromise();
      */

     const companyContent = this.HrserviceService_.getCompanyHomePageDetails(employeeID, keyword).toPromise();

     let res = await Promise.all([companyContent]);
     
     this.similarCompanyProfiles = res[0]['similarProfiles'];
      this.companyUpdates = res[0]['companyUpdates'];
      this.companyCareers = res[0]['companyCareers'];
      this.activeJobPostings = res[0]['activeJobs'];

      this.isContentLoaded = true;
      // console.log(this.companyUpdates);
     // console.log(this.companyCareers);
      this.spinner.hide();

    }
    
    gotoWebSite()
    {
      var url = "http://"+this.employeeProfiles[0]['website'];
      window.open(url , "_blank");
    }

     getFirstWord(str) {
      let spaceIndex = str.indexOf(' ');
      return spaceIndex === -1 ? str : str.substr(0, spaceIndex);
      }


}
