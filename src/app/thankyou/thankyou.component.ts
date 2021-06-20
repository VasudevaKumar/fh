import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { first } from 'rxjs/operators';
import { EmployeeService } from '../../../_services/employee.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})
export class ThankyouComponent implements OnInit {

  likedEmployee = '';
  activationString = '';
  userSubscription: Subscription;

  constructor(
    private _EmployeeService: EmployeeService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    

    this.userSubscription = this.route.params.subscribe(
      (params: Params) => {
        this.likedEmployee = params.string;
    })

    this.sendEmailConfirmation(this.likedEmployee);

  }

  sendEmailConfirmation(likedEmployee)
  {
    this._EmployeeService.sendEmailConfirmation(likedEmployee).subscribe();
  }
}
