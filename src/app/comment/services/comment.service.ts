import { filter } from 'rxjs/operators';
import { Comment, Selection } from './../model/model';
import { Injectable } from '@angular/core';

enum KEYS {
  SELECTIONS = 'SELECTIONS',
  COMMENTS = 'COMMENTS',
}

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor() {}

  createSelection(selector: string, text: string): Selection {
    const selections = JSON.parse(localStorage.getItem(KEYS.SELECTIONS)) || [];
    const s = {
      id: new Date().getTime(),
      text,
      selector,
    };
    selections.push(s);
    localStorage.setItem(KEYS.SELECTIONS, JSON.stringify(selections));
    return s;
  }

  getSelections(): Selection[] {
    return JSON.parse(localStorage.getItem(KEYS.SELECTIONS)) || [];
  }

  getSelection(id: number): Selection {
    const selections = this.getSelections();
    return selections.find((s) => s.id === id);
  }

  createComment(text: string, selectionId: number): Comment {
    const comment: Comment = {
      id: new Date().getTime(),
      date: new Date().toTimeString(),
      selectionId,
      text,
      userAvatar: '',
      username: '',
    };
    const comments = JSON.parse(localStorage.getItem(KEYS.COMMENTS)) || [];
    comments.push(comment);
    localStorage.setItem(KEYS.COMMENTS, JSON.stringify(comments));
    return comment;
  }

  getComments(selectionId: number): Comment[] {
    let comments = JSON.parse(localStorage.getItem(KEYS.COMMENTS)) || [];
    comments = comments.filter((c) => c.selectionId === selectionId);
    return comments;
  }
  getAllComments(): Comment[] {
    const comments = JSON.parse(localStorage.getItem(KEYS.COMMENTS)) || [];
    return comments;
  }

  removeComment(id: number): void {
    let comments = this.getAllComments();
    comments = comments.filter((c) => c.id !== id);
    localStorage.setItem(KEYS.COMMENTS, JSON.stringify(comments));
  }

  removeSelection(id: number): void {
    let selections = JSON.parse(localStorage.getItem(KEYS.SELECTIONS)) || [];
    selections = selections.filter((s) => s.id !== id);
    localStorage.setItem(KEYS.SELECTIONS, JSON.stringify(selections));
  }
}
