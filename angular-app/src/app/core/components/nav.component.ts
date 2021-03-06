import { Component, OnInit } from '@angular/core';
import { UserInfo } from '../model/user-info';

@Component({
  selector: 'app-nav',
  template: `
    <div class="user" *ngIf="userInfo">
      <p>Welcome</p>
      <p>{{ userInfo?.userDetails }}</p>
      <p>{{ userInfo?.identityProviderLabel || "-" }}</p>
      <p *ngFor="let role of userInfo?.userRoles">{{ role }}</p>
      <hr>
    </div>
    <nav class="menu">
      <p class="menu-label">Menu</p>
      <ul class="menu-list">
        <a routerLink="/products" routerLinkActive="router-link-active">
          <span>Products</span>
        </a>
        <a routerLink="/about" routerLinkActive="router-link-active">
          <span>About</span>
        </a>
      </ul>
    </nav>
    <nav class="menu auth">
      <p class="menu-label">Auth</p>
      <ul class="menu-list auth">
        <ng-container *ngIf="!userInfo; else logout">
          <ng-container *ngFor="let provider of providers">
            <a href="/.auth/login/{{provider.value}}?post_login_redirect_uri={{redirect}}">{{provider.label}}</a>
          </ng-container>
        </ng-container>
        <ng-template #logout>
          <a href="/.auth/logout?post_logout_redirect_uri={{redirect}}">Logout</a>
        </ng-template>
      </ul>
    </nav>
  `,
})
export class NavComponent implements OnInit {
  providers: any[] = [{value:"github",label:"GitHub"}, {value:"aad",label:"Active Directory"}, {value:"google",label:"Google"}];
  redirect: string = window.location.pathname;
  userInfo: UserInfo;

  async ngOnInit() {
    this.userInfo = await this.getUserInfo();
    if (this.userInfo) {
      this.userInfo.identityProviderLabel = this.providers.find(p => p.value == this.userInfo.identityProvider).label;
    }
  }

  async getUserInfo() {
    try {
      const response = await fetch('/.auth/me');
      console.log(response);
      const payload = await response.json();
      console.log(payload);
      const { clientPrincipal } = payload;
      return clientPrincipal;
    } catch(error) {
      console.error('No profile could be found');
      return undefined;
    }
  }
}
