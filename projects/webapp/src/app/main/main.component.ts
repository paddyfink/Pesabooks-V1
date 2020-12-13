import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@app/services';
import { BaseComponent } from '@app/shared';
import { TdLayoutComponent, TdMediaService } from '@covalent/core';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { get } from 'lodash';
import { NgxPermissionsService } from 'ngx-permissions';
import * as Raven from 'raven-js';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent extends BaseComponent implements OnInit {
  @ViewChild('layout') layout: TdLayoutComponent;

  routes = [
    {
      icon: 'dashboard',
      route: '/dashboard',
      title: 'app.common.dashboard'
    },
    {
      icon: 'person',
      route: '/members',
      title: 'app.common.members'
    },
    {
      icon: 'compare_arrows',
      route: '/transactions',
      title: 'app.common.transactions'
    },
    {
      icon: 'compare_arrows',
      route: '/report',
      title: 'app.common.report'
    }
  ];

  constructor(
    public media: TdMediaService,
    private authService: AuthService,
    private permissionsService: NgxPermissionsService,
    private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics
  ) {
    super();
  }

  logout() {
    this.authService.logOut();
  }

  menuClicked() {
    if (!this.media.query('gt-sm')) {
      this.layout.close();
    }
  }
  ngOnInit() {
    this.currentUser$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(user => {
      this.angulartics2GoogleAnalytics.setUsername(user.id);

      // Set logging
      Raven.setUserContext({
        email: user.email,
        fullName: user.fullName,
        id: user.id
      });

      //Crisp
      if (!user.isDemo) {
        $crisp.push(['set', 'user:email', [user.email]]);
        $crisp.push(['set', 'user:nickname', [user.fullName]]);
        if (user.pictureUrl) {
          $crisp.push(['set', 'user:avatar', [user.pictureUrl]]);
        }
      }

      // Set permission
      const roles = [];
      const userRole = get(user, `groups.${user.lastGroupId}.role`);

      roles.push(userRole);

      if (get(user, 'isHost')) {
        roles.push('host');
        roles.push('admin');
      }
      this.permissionsService.loadPermissions(roles);
    });
  }
}
