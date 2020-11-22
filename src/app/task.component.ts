import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router} from '@angular/router';

export class Tasks {
  _id!: string;
  user!: {};
  task!: string;
  state!: string;
}

@Component({
  templateUrl: './task.component.html'
})

export class TaskComponent {
  title = 'Todo Management';

  tasks!: Tasks[];
  _id!: string;
  user!: {};
  userID!: string | null;
  task!: string;
  // singleTask!: Tasks;
  state!: string;
  editButton = true;
  createButton = false;

  baseURL = 'https://tm-backend.herokuapp.com/';

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router ){}

  public createTask() {
    const headers = { 'content-type': 'application/json'};
    const body = JSON.stringify({ userID: this.userID, task: this.task, state: 'to do' });
    console.log({ userID: this.userID, task: this.task, state: 'to do' });
    this.http.post(this.baseURL + '/tasks', body, { headers, observe: 'response' })
      .subscribe(
       response => {
            console.log('POST completed sucessfully. The response received ' + response);
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
    this.task = '';
    this.getTasks();
  }

  public getTasks() {
    this.userID = this.activatedRoute.snapshot.paramMap.get('user_id');
    return this.http.get<Tasks[]>(this.baseURL + `/tasks/me/${this.userID}`)
      .subscribe(
        (resp) => {                           // Next callback
          console.log('response received');
          console.log(resp);
          this.tasks = resp;
        },
        (error) => {                              // Error callback
          console.error('Request failed with error');
          alert(error);
        },
        () => {                                   // Complete callback
          console.log('Request completed');
        });
  }

  public updateTask(taskID: string, state: string) {
    const headers = { 'content-type': 'application/json'};
    const body = JSON.stringify({ state });
    this.http.patch(this.baseURL + `/tasks/${taskID}`, body, { headers, observe: 'response' })
      .subscribe(
       response => {
            console.log('patch completed sucessfully. The response received ' + response);
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

  public editTask(taskID: string) {
    this.editButton = false;
    this.createButton = true;
    this._id = taskID;
    return this.http.get<Tasks>(this.baseURL + `/tasks/${taskID}`)
      .subscribe(
        (resp) => {                           // Next callback
          console.log('response received');
          console.log(resp);
          // this.singleTask = resp;
          this.task = resp.task;
        },
        (error) => {                              // Error callback
          console.error('Request failed with error');
          alert(error);
        },
        () => {                                   // Complete callback
          console.log('Request completed');
        });

  }

  public updateTaskDetails () {
    this.editButton = true;
    this.createButton = false;

    const headers = { 'content-type': 'application/json'};
    const body = JSON.stringify({ task: this.task });
    console.log({ id: this._id, task: this.task });
    this.http.patch(this.baseURL + `/tasks/detail/${this._id}`, body, { headers, observe: 'response' })
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

  public deleteTask(taskID: string) {
    this.http.delete(this.baseURL + `/tasks/${taskID}`)
      .subscribe(
       response => {
            console.log('delete completed sucessfully. The response received ' + response);
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
}
