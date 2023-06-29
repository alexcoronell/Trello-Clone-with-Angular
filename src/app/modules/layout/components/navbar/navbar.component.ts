import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  faBell,
  faInfoCircle,
  faClose,
  faAngleDown,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '@services/auth.service';
import { BoardsService } from '@services/boards.service';

import { Colors, NAVBAR_BACKGROUNDS } from '@models/colors.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);
  private boardsService: BoardsService = inject(BoardsService);

  faBell = faBell;
  faInfoCircle = faInfoCircle;
  faClose = faClose;
  faAngleDown = faAngleDown;

  navBarColors = NAVBAR_BACKGROUNDS;
  navBarBackgroundColor: Colors = 'sky';
  isOpenOverlayAvatar = false;
  isOpenOverlayBoards = false;
  isOpenOverlayCreateBoard = false;

  user$ = this.authService.user$;

  constructor() {
    this.boardsService.backgroundColor$.subscribe(
      (color) => (this.navBarBackgroundColor = color)
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  close(event: boolean) {
    this.isOpenOverlayCreateBoard = false;
  }

  get colors() {
    const classes = this.navBarColors[this.navBarBackgroundColor];
    return classes ? classes : {};
  }
}
