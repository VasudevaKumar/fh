import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../fh/src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HrserviceService {

  constructor(private http: HttpClient) { }
  env = environment;
  
  submitEmployeeRegister(formData:any)
  {     
    const api = this.env.apiBaseURL+'/Employee/register';
    return this.http.post(
        api,
        formData,
        ).pipe(map((data: any) => data));
  }
  
  getEmployeeProfile(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/Employee/getHRProfile';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  getCompanyProfile(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/Employee/getCompanyProfile';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  editHRProfile(formData:any)
  {
    const api = this.env.apiBaseURL+'/Employee/editHRProfile';
    return this.http.post(
        api,
        formData,
        ).pipe(map((data: any) => data));
  }


  verifyEmailAvailability(emailAddress:any)
  {
    const api = this.env.apiBaseURL+'/Employee/verifyEmail';
    return this.http.post(
        api,
        {emailAddress:emailAddress},
        ).pipe(map((data: any) => data.data));
  }

  verifyEmailAvailabilityForEdit(emailAddress:any, employeeID:any)
  {
    const api = this.env.apiBaseURL+'/Employee/verifyEmailForEdit';
    return this.http.post(
        api,
        {emailAddress:emailAddress , employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }
  getCompanyHomePageDetails(employeeID:any , Industry:any)
  {
    const api = this.env.apiBaseURL+'/Employee/getCompanyHomePageDetails';
    return this.http.post(
        api,
        {Industry:Industry , employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  getSimilarCompanyProfiles(employeeID:any , Industry:any)
  {
    const api = this.env.apiBaseURL+'/Employee/getSimilarProfiles';
    return this.http.post(
        api,
        {Industry:Industry , employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  pushUpdates(employeeID:any , commentNotes:any)
  {
    const api = this.env.apiBaseURL+'/Employee/pushUpdates';
    return this.http.post(
        api,
        {commentNotes:commentNotes , employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }


  companyUpdates(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/Employee/getComopanyUpdates';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  companyCareers(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/Employee/getCompanyCareers';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  pushCareer(employeeID:any , careerDetail:any)
  {
    const api = this.env.apiBaseURL+'/Employee/pushCareer';
    return this.http.post(
        api,
        {careerDetail:careerDetail , employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }
  uploadHomePageFileL(formData:any)
  {     
    const api = this.env.apiBaseURL+'/Employee/uploadHomePageFileL';
    return this.http.post(
        api,
        formData,
        ).pipe(map((data: any) => data.data));
  }

  changePassword(formData:any)
  {
    const api = this.env.apiBaseURL+'/changePassword';
    return this.http.post(
        api,
        formData,
        ).pipe(map((data: any) => data));
  }

  submitPost(formData:any)
  {     
    const api = this.env.apiBaseURL+'/Employee/submitJobPost';
    return this.http.post(
        api,
        formData,
        ).pipe(map((data: any) => data));
  }

  getAllJobPostings(employeeID:any)
  {     
    const api = this.env.apiBaseURL+'/Employee/getJobPostings';
    return this.http.post(
        api,
        {employeeID:employeeID}
        ).pipe(map((data: any) => data.data));
  }

  statusChange(employeeID , rowid, action)
  {
    const api = this.env.apiBaseURL+'/Employee/statusChange';
    return this.http.post(
        api,
        {employeeID:employeeID, rowid:rowid , action:action},
        ).pipe(map((data: any) => data.data));
  }

  getJobPostingsByID(employeeID:any, rowID:any)
  {     
    const api = this.env.apiBaseURL+'/Employee/getJobPostingByID';
    return this.http.post(
        api,
        {employeeID:employeeID , rowID:rowID},
        ).pipe(map((data: any) => data.data));
  }

  editPost(formData:any)
  {     
    const api = this.env.apiBaseURL+'/Employee/editJobPost';
    return this.http.post(
        api,
        formData,
        ).pipe(map((data: any) => data));
  }

  getActiveJobs(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/Employee/getActiveJobs';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  InterviewSchedules(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/Employee/InterviewSchedules';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  getLatestJobs(employeeID)
  {
    const api = this.env.apiBaseURL+'/Employee/getLatestJobs';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  getSingleJob(jobID:any)
  {
    const api = this.env.apiBaseURL+'/Employee/getSingleJob';
    return this.http.post(
        api,
        {jobID:jobID},
        ).pipe(map((data: any) => data.data));
  }


  applyJob(employeeID:any, jobID)
  {
    const api = this.env.apiBaseURL+'/Employee/applyJob';
    return this.http.post(
        api,
        {
            employeeID:employeeID,
            jobID:jobID
        },
        ).pipe(map((data: any) => data.data));
  }

  getjobListings(employeeID:any, jobID, statusID)
  {
    const api = this.env.apiBaseURL+'/Employee/getjobListings';
    return this.http.post(
        api,
        {
            employeeID:employeeID,
            jobID:jobID,
            statusID:statusID
        },
        ).pipe(map((data: any) => data.data));
  }

  myjobs(employeeID)
  {
    const api = this.env.apiBaseURL+'/Employee/myjobs';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  deleteProfilePic(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/Employee/deleteProfilePic';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  hrAction(applicationID , statusID)
  {
    const api = this.env.apiBaseURL+'/Employee/hrAction';
    return this.http.post(
        api,
        {applicationID:applicationID, statusID:statusID},
        ).pipe(map((data: any) => data.data));
  }


}
