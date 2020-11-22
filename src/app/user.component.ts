import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export class Users {
  _id!: string;
  firstName!: string;
  lastName!: string;
}

@Component({
  templateUrl: './user.component.html'
})

export class UserComponent {
  title = 'Todo Management';

  users!: Users[];
  _id!: string;
  firstName!: string;
  lastName!: string;
  editButton = true;
  createButton = false;
  isUsers = false;

  baseURL = 'https://tm-backend.herokuapp.com';

  constructor(private http: HttpClient){}

  public createUser() {
    const headers = { 'content-type': 'application/json'};
    const body = JSON.stringify({ firstName: this.firstName, lastName: this.lastName });
    this.http.post(this.baseURL + '/users', body, { headers, observe: 'response' })
      .subscribe(
       response => {
            console.log('POST completed sucessfully. The response received ' + response);
            alert('User saved Successfully!');
            this.ngOnInit();
        },
        error => {
            console.log('Post failed with the errors');
            alert(error);
        },
        () => {
            console.log('Post Completed');
        });
  }

  ngOnInit() {
    this.createButton = false;
    this.firstName = '';
    this.lastName = '';
    this.getUsers();
  }

  public getUsers() {
    return this.http.get<Users[]>(this.baseURL + '/users')
      .subscribe(
        (response) => {                           // Next callback
          console.log('response received');
          console.log(response);
          this.users = response;
          this.isUsers = true;
        },
        (error) => {                              // Error callback
          console.error('Request failed with error');
          alert(error);
        },
        () => {                                   // Complete callback
          console.log('Request completed');
        });
  }

  public deleteUser(userID: string) {
    this.http.delete(this.baseURL + `/users/${userID}`)
      .subscribe(
       response => {
            console.log(response);
            this.ngOnInit();
        },
        error => {
            console.log('Post failed with the errors');
            alert(error);
        },
        () => {
            console.log('Post Completed');
        });
  }

  public editUser(userID: string) {
    this.editButton = false;
    this.createButton = true;
    this._id = userID;
    return this.http.get<Users>(this.baseURL + `/users/${userID}`)
      .subscribe(
        (resp) => {                           // Next callback
          console.log('response received');
          console.log(resp);
          // this.singleTask = resp;
          this.firstName = resp.firstName;
          this.lastName = resp.lastName;
        },
        (error) => {                              // Error callback
          console.error('Request failed with error');
          alert(error);
        },
        () => {                                   // Complete callback
          console.log('Request completed');
        });

  }

  public updateUserDetails () {
    this.editButton = true;
    this.createButton = false;

    const headers = { 'content-type': 'application/json'};
    const body = JSON.stringify({ firstName: this.firstName, lastName: this.lastName });
    this.http.patch(this.baseURL + `/users/${this._id}`, body, { headers, observe: 'response' })
      .subscribe(
        (response) => {
          console.log('patch completed sucessfully. The response received ' + response);
          this.ngOnInit();
        },
        (error) => {                              // Error callback
          console.error('Request failed with error');
          alert(error);
        },
        () => {                                   // Complete callback
          console.log('Request completed');
        });
  }

}
