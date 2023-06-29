import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BoardsService } from '@services/boards.service';

import { Colors } from '@models/colors.model';

@Component({
  selector: 'app-board-form',
  templateUrl: './board-form.component.html',
})
export class BoardFormComponent {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private boardsService: BoardsService = inject(BoardsService);

  @Output() closeOverlay = new EventEmitter<boolean>();

  form = this.formBuilder.nonNullable.group({
    title: ['', Validators.required],
    backgroundColor: new FormControl<Colors>('sky', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  doSave() {
    if (this.form.valid) {
      const { title, backgroundColor } = this.form.getRawValue();
      this.boardsService
        .createBoard(title, backgroundColor)
        .subscribe((board: any) => {
          this.closeOverlay.next(false)
          this.router.navigate(['/app/boards', board.id]);
        });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
