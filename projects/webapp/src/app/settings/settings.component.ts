import { Component, OnInit } from '@angular/core';
import { NavigationService } from '@app/services';
import { TdMediaService } from '@covalent/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  navLinks = [
    { path: 'group', label: 'app.settings.general' },
    { path: 'categories', label: 'app.common.categories' },
    { path: 'users', label: 'app.common.users' }
  ];
  constructor(
    public media: TdMediaService,
    private navigationService: NavigationService
  ) {}

  ngOnInit() {
    this.navigationService.setPageTitle('app.common.settings');
  }
}
