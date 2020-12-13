import { Component, Input, OnInit } from '@angular/core';
import { NavigationService } from '@app/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Input() title: string;
  title$: Observable<string>;
  constructor(private navigationService: NavigationService) {}

  ngOnInit() {
    this.title$ = this.navigationService.PageTitle;
  }
}
