import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TopicService } from '../services/topic.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {
  subscribeForm: FormGroup;
  requestForm: FormGroup;
  topics: any[] = [];
  isButtonDisabled = true;

  constructor(private fb: FormBuilder, private http: HttpClient, private topicService: TopicService) {
    this.subscribeForm = this.fb.group({
      email: [''],
      topics: new FormArray([])
    });
    this.requestForm = this.fb.group({
      newTopic: ['']
    });
  }

  ngOnInit(): void {
    const queryParams = [{ "genre": " " }];
    this.topicService.getTopics(queryParams).subscribe((data: string[]) => {
      this.topics = data;
      this.addCheckboxes();
    }, (error: any) => {
      console.error('Error fetching topics', error);
    });

    // Listen to form changes to validate the email
    this.subscribeForm.get('email')!.valueChanges.subscribe(value => {
      this.isButtonDisabled = !value;
    });
  }

  private addCheckboxes() {
    this.topics.forEach(() => this.topicsFormArray.push(new FormControl(false)));
  }

  get topicsFormArray() {
    return this.subscribeForm.controls['topics'] as FormArray;
  }

  validateEmail() {
    const emailControl = this.subscribeForm.get('email');
    this.isButtonDisabled = !emailControl || !emailControl.value;
  }

  subscribe() {
    const email = this.subscribeForm.get('email')!.value;
    const selectedTopics: string[] = this.topics.filter((_, i) => this.subscribeForm.value.topics[i]);

    const subscriptionData = {
      email: email,
      topics: selectedTopics
    };

    console.log('Subscribed:', subscriptionData);
    this.topicService.postTopics(subscriptionData).subscribe(response => {
      console.log('Subscription successful', response);
      // Handle successful response here, if needed
    }, error => {
      console.error('Subscription failed', error);
      // Handle error response here, if needed
    });
    this.resetForm();
  }

  unsubscribe() {
    const email = this.subscribeForm.get('email')!.value;
    const selectedTopics: string[] = this.topics.filter((_, i) => this.subscribeForm.value.topics[i]);

    const subscriptionData = {
      email: email,
      topics: selectedTopics
    };

    console.log('Unsubscribed:', subscriptionData);
    this.topicService.deleteTopics(subscriptionData).subscribe(response => {
      console.log('Unsubscription successful', response);
      // Handle successful response here, if needed
    }, error => {
      console.error('Unsubscription failed', error);
      // Handle error response here, if needed
    });
    this.resetForm();
  }

  onCheckboxChange(event: any, index: number) {
    const formArray: FormArray = this.topicsFormArray;
    formArray.at(index).setValue(event.target.checked);
  }

  resetForm() {
    this.subscribeForm.reset();
    this.topicsFormArray.clear();
    this.addCheckboxes();
  }

  requestTopic() {
    const newTopic = this.requestForm.get('newTopic')!.value;
    console.log('Requested Topic:', newTopic);
    this.topicService.requestTopics(newTopic).subscribe(response => {
      console.log('Unsubscription successful', response);
      // Handle successful response here, if needed
    }, error => {
      console.error('Unsubscription failed', error);
      // Handle error response here, if needed
    });
    // Handle the topic request logic here, e.g., send it to the server
    this.requestForm.reset();
  }
}