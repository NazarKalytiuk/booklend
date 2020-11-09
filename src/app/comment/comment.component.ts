import { Selection, Comment } from './model/model';
import { CommentService } from './services/comment.service';
import {
  Component,
  EventEmitter,
  HostBinding,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  @HostBinding('style.top') top: string;
  @HostBinding('style.left') left: string;
  @Output() createSelection = new EventEmitter<Selection>();

  text: string;
  selector: string;
  form: FormGroup;
  selectionId: number;
  comments: Comment[] = [];
  constructor(private fb: FormBuilder, private cs: CommentService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      text: ['', Validators.required],
    });
    this.comments = this.cs.getComments(this.selectionId);
  }

  submit(): void {
    if (!this.selectionId) {
      const selection = this.cs.createSelection(this.selector, this.text);
      this.selectionId = selection.id;
      this.createSelection.emit(selection);
    }
    this.cs.createComment(this.form.value.text, this.selectionId);
    this.form.reset();
    this.comments = this.cs.getComments(this.selectionId);
  }

  remove(id: number): void {
    this.cs.removeComment(id);
    this.comments = this.cs.getComments(this.selectionId);
    if (this.comments.length === 0) {
      this.cs.removeSelection(this.selectionId);
    }
  }
}
