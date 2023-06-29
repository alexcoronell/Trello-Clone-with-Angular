import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Dialog } from '@angular/cdk/dialog';
import { TodoDialogComponent } from '@boards/components/todo-dialog/todo-dialog.component';

import { Card } from '@models/card.model';
import { BoardsService } from '@services/boards.service';
import { ListsService } from '@services/lists.service';
import { CardsService } from '@services/cards.service';
import { Board } from '@models/board.model';
import { List } from '@models/list.model';
import { BACKGROUNDS } from '@models/colors.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styles: [
    `
      .cdk-drop-list-dragging .cdk-drag {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
      .cdk-drag-animating {
        transition: transform 300ms cubic-bezier(0, 0, 0.2, 1);
      }
    `,
  ],
})
export class BoardComponent implements OnInit, OnDestroy {
  private dialog: Dialog = inject(Dialog);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private boardsService: BoardsService = inject(BoardsService);
  private cardsService: CardsService = inject(CardsService);
  private listsService: ListsService = inject(ListsService);

  board: Board | null = null;
  inputCard = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  inputList = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  showListForm: boolean = false;
  colorBackgrounds = BACKGROUNDS;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('boardId');
      if (id) {
        this.getBoard(id);
      }
    });
  }

  drop(event: CdkDragDrop<Card[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    const rta = this.boardsService.getPosition(
      event.container.data,
      event.currentIndex
    );
    const position = this.boardsService.getPosition(
      event.container.data,
      event.currentIndex
    );
    const card = event.container.data[event.currentIndex];
    const listId = event.container.id;
    this.updateCard(card, position, listId);
  }

  addList() {
    const title = this.inputList.value;
    if (this.board) {
      this.listsService
        .create({
          title,
          boardId: this.board.id,
          position: this.boardsService.getPositionNewItem(this.board.lists),
        })
        .subscribe((list) => {
          this.board?.lists.push({
            ...list,
            cards: [],
          });
          this.showListForm = false;
          this.inputList.setValue('');
        });
    }
  }

  openDialog(card: Card) {
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      minWidth: '300px',
      maxWidth: '50%',
      data: {
        card: card,
      },
    });
    dialogRef.closed.subscribe((output) => {
      if (output) {
        console.log(output);
      }
    });
  }

  private getBoard(id: string) {
    this.boardsService.getBoard(id).subscribe((board) => {
      this.board = board;
      this.boardsService.setBackgroudnColor(this.board.backgroundColor);
    });
  }

  private updateCard(card: Card, position: number, listId: number | string) {
    this.cardsService
      .update(card.id, { position, listId })
      .subscribe((cardUpdate) => console.log(cardUpdate));
  }

  openFormCard(list: List) {
    //list.showCardForm = !list.showCardForm
    if (this.board?.lists) {
      this.board.lists = this.board.lists.map((iteratorList) => {
        if (iteratorList.id === list.id) {
          return {
            ...iteratorList,
            showCardForm: true,
          };
        } else {
          return {
            ...iteratorList,
            showCardForm: false,
          };
        }
      });
    }
  }

  createCard(list: List) {
    const title = this.inputCard.value;
    if (this.board) {
      this.cardsService
        .create({
          title,
          listId: list.id,
          boardId: this.board.id,
          position: this.boardsService.getPositionNewItem(list.cards),
        })
        .subscribe((card) => {
          list.cards.push(card as Card);
          this.inputCard.setValue('');
          this.closeCardForm(list);
        });
    }
  }

  closeCardForm(list: List) {
    list.showCardForm = false;
  }

  get colors() {
    if (this.board) {
      const classes = this.colorBackgrounds[this.board.backgroundColor];
      return classes ? classes : {};
    }
    return {};
  }

  ngOnDestroy(): void {
    this.boardsService.setBackgroudnColor('sky');
  }
}
