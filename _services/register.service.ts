import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../fh/src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }
  env = environment;

  submitRegister(formData:any)
  {     
    const api = this.env.apiBaseURL+'/register';
    return this.http.post(
        api,
        formData,
        ).pipe(map((data: any) => data));
  }
  editProfile(formData:any)
  {
    const api = this.env.apiBaseURL+'/edit';
    return this.http.post(
        api,
        formData,
        ).pipe(map((data: any) => data));
  }
  getEmployeeProfile(employeeID:any)
  {
    const api = this.env.apiBaseURL+'/getEmployeeProfile';
    return this.http.post(
        api,
        {employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  verifyEmailAvailability(emailAddress:any)
  {
    const api = this.env.apiBaseURL+'/verifyEmail';
    return this.http.post(
        api,
        {emailAddress:emailAddress},
        ).pipe(map((data: any) => data.data));
  }
  
  verifyEmailAvailabilityForEdit(emailAddress:any, employeeID:any)
  {
    const api = this.env.apiBaseURL+'/verifyEmailForEdit';
    return this.http.post(
        api,
        {emailAddress:emailAddress , employeeID:employeeID},
        ).pipe(map((data: any) => data.data));
  }

  verifyPhoneAvailability(phoneNumber:any)
  {
    const api = this.env.apiBaseURL+'/verifyPhoneAvailability';
    return this.http.post(
        api,
        {phoneNumber:phoneNumber},
        ).pipe(map((data: any) => data));
  }

  verifyUserName(userName:any, firstName:any, lastName:any)
  {
    const api = this.env.apiBaseURL+'/verifyfhUserName';
    return this.http.post(
        api,
        {userName:userName, firstName:firstName, lastName:lastName},
        ).pipe(map((data: any) => data));
  }
  saveRegistration(userName:any, firstName:any, lastName:any,emailAddress:any,phoneNumber:any,role_id:any)
  {
    const api = this.env.apiBaseURL+'/saveRegistration';
    return this.http.post(
        api,
        {userName:userName, firstName:firstName, lastName:lastName, emailAddress:emailAddress, phoneNumber:phoneNumber, role_id:role_id},
        ).pipe(map((data: any) => data.data));
  }
  saveCMRegistration(formData:any)
  {
    const api = this.env.apiBaseURL+'/saveCMRegistration';
    return this.http.post(
        api,
        formData,
        ).pipe(map((data: any) => data.data));
  }
  getCareerManagerDetails()
  {
    const api = this.env.apiBaseURL+'/getCareerManagerDetails';
    return this.http.get(api).pipe(map((data: any) => data.data));
  }
  






}
