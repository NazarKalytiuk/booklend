import { CommentService } from './comment/services/comment.service';
import { CommentComponent } from './comment/comment.component';
import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { from, fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'book';
  items = [
    {
      image:
        'https://assets.teenvogue.com/photos/5cd4384fac4d9e712fe2ebb0/2:3/w_1852,h_2778,c_limit/The%20Gravity%20of%20Us_.jpg',
      text: 'Sepsis Management in Resource-limited Settings',
    },
    {
      image:
        'https://static-cse.canva.com/blob/193579/millionlittlepieces_2.jpg',
      text: 'Tuberculosis in Adults and Children',
    },
    {
      image:
        'https://ic.pics.livejournal.com/polyarinov/65159805/200088/200088_900.jpg',
      text: 'Red Book Atlas of Pediatric Infectious Diseases',
    },
    {
      image:
        'https://assets.teenvogue.com/photos/5cd4384fac4d9e712fe2ebb0/2:3/w_1852,h_2778,c_limit/The%20Gravity%20of%20Us_.jpg',
      text: 'Sepsis Management in Resource-limited Settings',
    },
    {
      image:
        'https://static-cse.canva.com/blob/193579/millionlittlepieces_2.jpg',
      text: 'Tuberculosis in Adults and Children',
    },
    {
      image:
        'https://ic.pics.livejournal.com/polyarinov/65159805/200088/200088_900.jpg',
      text: 'Red Book Atlas of Pediatric Infectious Diseases',
    },
    {
      image:
        'https://assets.teenvogue.com/photos/5cd4384fac4d9e712fe2ebb0/2:3/w_1852,h_2778,c_limit/The%20Gravity%20of%20Us_.jpg',
      text: 'Sepsis Management in Resource-limited Settings',
    },
  ];
  popupOpened = false;
  @ViewChild('commentContainer', { read: ViewContainerRef }) commentContainer;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private cs: CommentService
  ) {}

  ngOnInit(): void {
    this.highlightSelections();
    const selectEvent = fromEvent(window, 'mouseup');
    const mouseOverEvent = fromEvent(window, 'mouseover');
    mouseOverEvent
      .pipe(
        filter((e: any) => {
          const popup = document.querySelector('app-comment');
          if (popup) {
            return (
              popup.contains(e.target) ||
              e.target.classList.contains('highlighted-comment')
            );
          } else {
            return e.target.classList.contains('highlighted-comment');
          }
        })
      )
      .subscribe((e) => {
        if (!this.popupOpened) {
          const sid = e.target.getAttribute('data-id');
          const selection = this.cs.getSelection(+sid);
          this.showPopup(
            e.clientX,
            e.clientY,
            selection.text,
            selection.selector,
            +sid
          );
        }
      });
    mouseOverEvent
      .pipe(
        filter((e: any) => {
          const popup = document.querySelector('app-comment');
          if (popup) {
            return !(
              popup.contains(e.target) ||
              e.target.classList.contains('highlighted-comment')
            );
          } else {
            return !e.target.classList.contains('highlighted-comment');
          }
        })
      )
      .subscribe((e) => {
        this.closePopup();
      });
    selectEvent
      .pipe(
        filter((e: any) => {
          const popup = document.querySelector('app-comment');
          console.log(popup);
          if (popup) {
            return !popup.contains(e.target);
          } else {
            return true;
          }
        })
      )
      .subscribe((e: any) => {
        console.log('SELECT');
        this.closePopup();
        const selection = window.getSelection();
        console.log(selection.toString());
        if (selection.toString() !== '') {
          const selector = this.getUniqueSelector(e.target);
          const text = selection.toString();
          this.showPopup(e.clientX, e.clientY, text, selector);
        }
      });
  }

  private getUniqueSelector(element): string {
    let uniqueSelector = '';
    let par = element;
    while (par.parentNode.tagName != 'HTML') {
      let count = 1;
      let prev = par;
      while (prev.previousElementSibling != null) {
        count++;
        prev = prev.previousElementSibling;
      }
      uniqueSelector = '>:nth-child(' + count + ')' + uniqueSelector;
      par = par.parentNode;
    }
    uniqueSelector = par.tagName + uniqueSelector;
    return uniqueSelector;
  }

  showPopup(
    x: number,
    y: number,
    text: string,
    selector: string,
    selectionId?: number
  ): void {
    const factory = this.componentFactoryResolver.resolveComponentFactory(
      CommentComponent
    );
    const component: ComponentRef<CommentComponent> = this.commentContainer.createComponent(
      factory
    );
    if (window.innerWidth > 480) {
      component.instance.left = `${x}px`;
      component.instance.top = `${y}px`;
    }
    component.instance.selector = selector;
    component.instance.text = text;
    component.instance.selectionId = selectionId;
    component.instance.createSelection.subscribe((s) => {
      this.highlightSelection(s.selector, s.text, s.id);
    });
    this.popupOpened = true;
  }

  closePopup(): void {
    this.commentContainer.clear();
    this.popupOpened = false;
  }

  highlightSelection(selector: string, text: string, id: number): void {
    const el = document.querySelector(selector);
    const innerHtml = el.innerHTML;
    const index = innerHtml.search(text);
    el.innerHTML =
      innerHtml.slice(0, index) +
      `<span class="highlighted-comment" data-id=${id}>${text}</span>` +
      innerHtml.slice(index + text.length);
  }

  highlightSelections(): void {
    const selections = this.cs.getSelections();
    selections.forEach((s) => {
      this.highlightSelection(s.selector, s.text, s.id);
    });
  }
}
