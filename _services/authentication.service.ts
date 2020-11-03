import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_models';
import { environment } from '../../fh/src/environments/environment';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    public isLoggedIn=false;

    env = environment;

    constructor(private http: HttpClient) {
        //this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(emailAddress, password, role_id) {
        // const api = 'http://facehiring.com/fhapi/verifyLogin';
        // const api = 'http://localhost/fhapi/verifyLogin';
        const api = this.env.apiBaseURL+'/verifyLogin';
        return this.http.post<any>(api, { emailAddress, password, role_id})
            .pipe(map(user => {

                if(user.data.msg == 'success')
                {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                this.isLoggedIn = true;
                 localStorage.setItem('currentUser', JSON.stringify(user.data.data));
                 this.currentUserSubject.next(user);
                 return user;
                }
                else {
                    this.isLoggedIn = false;
                    return user;
                }
               
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    activate(activationCode , activationString)
    {
        const api = this.env.apiBaseURL+'/activate';
        return this.http.post(
            api,
            {
                    activationCode:activationCode, activationString:activationString
            },
            ).pipe(map((data: any) => data.data));
    }

    forgotPassWord(emailAccount)
    {
        
        const api = this.env.apiBaseURL+'/forgotPassWord';
        return this.http.post(
            api,
            {
                emailAccount:emailAccount
            },
            ).pipe(map((data: any) => data.data));
    }
    
    modifyPassword(activationCode , activationString, password)
    {
        const api = this.env.apiBaseURL+'/modifyPassword';
        return this.http.post(
            api,
            {
                    activationCode:activationCode, 
                    activationString:activationString,
                    password:password
            },
            ).pipe(map((data: any) => data.data));
    }

}

