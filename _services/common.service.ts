import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../fh/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }
  env = environment;
  getLocations()
  {     
    const api = this.env.apiBaseURL+'/locations';
    return this.http.get(
        api,
        ).pipe(map((data: any) => data.data));
  }
  getPositions()
  {     
    const api = this.env.apiBaseURL+'/jobPositions';
    return this.http.get(
        api,
        ).pipe(map((data: any) => data.data));
  }
  getCompanies()
  {     
    const api = this.env.apiBaseURL+'/companies';
    return this.http.get(
        api,
        ).pipe(map((data: any) => data.data));
  }
  getSkills()
  {     
    const api = this.env.apiBaseURL+'/skills';
    return this.http.get(
        api,
        ).pipe(map((data: any) => data.data));
  }
  getGenders()
  {     
    const api = this.env.apiBaseURL+'/genders';
    return this.http.get(
        api,
        ).pipe(map((data: any) => data.data));
  }

  getLanguages()
  {     
    const api = this.env.apiBaseURL+'/languages';
    return this.http.get(
        api,
        ).pipe(map((data: any) => data.data));
  }



}
