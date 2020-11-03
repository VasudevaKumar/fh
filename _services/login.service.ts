import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }
  env = environment;
 

  verifyLogin(formData:any)
  {     
    console.log(this.env);
    const api = 'http://localhost/fhapi/verifyLogin';
    return this.http.post(
        api,
        formData,
        ).pipe(map((data: any) => data.data));
  }

}
