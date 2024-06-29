import { Component } from '@angular/core';
import { SubscribeComponent } from './subscribe/subscribe.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [SubscribeComponent]
})
export class AppComponent {
  title = 'quotes';
}
