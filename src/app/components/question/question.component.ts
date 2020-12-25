import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { QuizQuestion } from '../../model/QuizQuestion';

@Component({
  selector: 'codelab-quiz-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, OnChanges {
  @Output() answer = new EventEmitter<string>();
  @Output() formGroup: FormGroup;
  @Input() question: QuizQuestion;
  option = '';
  grayBorder = '2px solid #979797';

  constructor() {}

  ngOnInit() {
    this.buildForm();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.question && changes.question.currentValue && !changes.question.firstChange) {
      this.formGroup.patchValue({answer: ''});
    }
  }

  buildForm() {
    this.formGroup = new FormGroup({
      answer: new FormControl(['', Validators.required])
    });
  }

  radioChange(answer: string) {
    debugger
    this.question.selectedOption = answer;
    this.answer.emit(answer);
    this.displayExplanation();
    //this.addballonevent();

  }

  displayExplanation(): void {
    const questionElem = document.getElementById('question');
    if (questionElem !== null) {
       questionElem.innerHTML = '<div class="display_question_wrapper">' + this.question.questionText + '</div>';
      questionElem.style.border = this.grayBorder;
    }
  }

  // mark the correct answer regardless of which option is selected once answered
  isCorrect(): boolean {
    return this.question.selectedOption === this.question.answer;
  }

  // mark incorrect answer if selected
  isIncorrect(option: string): boolean {
    return option !== this.question.answer && option === this.question.selectedOption;
  }

  onSubmit() {
    this.formGroup.reset({answer: null});
  }

   

   addballonevent(): any {
    const normalMotion: any = document.querySelector<HTMLElement>('.normal-motion');
    const mainSvg: any = document.querySelector<HTMLElement>('.main-svg');
   const secondSvg: any = document.querySelector<HTMLElement>('.second-svg');
   const thirdSvg: any = document.querySelector<HTMLElement>('.third-svg');
   const content: any = document.querySelector<HTMLElement>('.content');
    
      setTimeout(() => {
        mainSvg.setAttribute("style", "visibility:visible");
        secondSvg.setAttribute("style", "visibility:visible");
      }, 50);
  
      setTimeout(() => {
        thirdSvg.setAttribute("style", "visibility:visible");
      },150);
  
      setTimeout(() => {
        content.setAttribute("style", "opacity:.9");
      }, 170);
  
      setTimeout(() => {
        content.setAttribute("style", "opacity:.8");
      }, 190);
  
      setTimeout(() => {
        content.setAttribute("style", "opacity:.7");
      }, 210);
  
      setTimeout(() => {
        content.setAttribute("style", "opacity:.6");
      }, 230);
  
      setTimeout(() => {
      content.setAttribute("style", "opacity:.4");
      }, 250);
  
      setTimeout(() => {
        content.setAttribute("style", "opacity:.3");
      },270);
  
      setTimeout(() => {
       content.setAttribute("style", "opacity:.2");
      }, 290);
  
      setTimeout(() => {
        content.setAttribute("style", "opacity:.1");
      }, 300);
  
      setTimeout(() => {
        content.setAttribute("style", "opacity:0");
      }, 300);
  
      setTimeout(() => {
        mainSvg.setAttribute("style", "visibility:visible");
        secondSvg.setAttribute("style", "visibility:visible");
        thirdSvg.setAttribute("style", "visibility:visible");
        content.setAttribute("style", "opacity:1");
      }, 50);
      
      setTimeout(() =>{
        normalMotion.setAttribute("style", "visibility:visible");
      }, 20);
    }
}

