import { Component, OnInit, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { QuizQuestion } from '../../model/QuizQuestion';

@Component({
  selector: 'codelab-question-container',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  @Input() answer: string;
  @Input() formGroup: FormGroup;
  @Output() question: QuizQuestion;
  totalQuestions: number;
  completionTime: number;
  correctAnswersCount = 0;

  questionID = 0;
  currentQuestion = 0;
  questionIndex: number;
  correctAnswer: boolean;
  hasAnswer: boolean;
  disabled: boolean;
  quizIsOver: boolean;
  progressValue: number;
  timeLeft: number;
  timePerQuestion = 20;
  interval: any;
  elapsedTime: number;
  elapsedTimes = [];
  blueBorder = '2px solid #007aff';

  allQuestions: QuizQuestion[] = [
    {
      questionId: 1,
      questionText: "How many days do we have in a week?",
      options: [
        { optionValue: "1", optionText: "Seven" },
        { optionValue: "2", optionText: "Five" },
        { optionValue: "3", optionText: "Six" },
        { optionValue: "4", optionText: "Four" }
      ],
      answer: "1",
      explanation: "Seven",
      selectedOption: ""
    },
    {
      questionId: 2,
      questionText: "How many colors are there in a rainbow?",
      options: [
        { optionValue: "1", optionText: "6" },
        { optionValue: "2", optionText: "7" },
        { optionValue: "3", optionText: "5" },
        { optionValue: "4", optionText: "4" }
      ],
      answer: "2",
      explanation: "7",
      selectedOption: ""
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.paramMap.subscribe(params => {
      this.setQuestionID(+params.get('questionId'));  // get the question ID and store it
      this.question = this.getQuestion;
    });
  }

  ngOnInit() {
    this.question = this.getQuestion;
    this.totalQuestions = this.allQuestions.length;
    this.timeLeft = this.timePerQuestion;
    this.progressValue = 100 * (this.currentQuestion + 1) / this.totalQuestions;
    //this.countdown();
  }

  displayNextQuestion() {
    this.resetTimer();
    this.increaseProgressValue();

    this.questionIndex = this.questionID++;

    if (typeof document.getElementById('question') !== 'undefined' && this.getQuestionID() <= this.totalQuestions) {
      document.getElementById('question').innerHTML = this.allQuestions[this.questionIndex]['questionText'];
      document.getElementById('question').style.border = this.blueBorder;
    } else {
      this.navigateToResults();
    }
  }

  /* displayPreviousQuestion() {
    this.resetTimer();
    this.decreaseProgressValue();

    this.questionIndex = this.questionID--;

    if (typeof document.getElementById('question') !== 'undefined' && this.getQuestionID() <= this.totalQuestions) {
      document.getElementById('question').innerHTML = this.allQuestions[this.questionIndex]['questionText'];
      document.getElementById('question').style.border = this.blueBorder;
    } else {
      this.navigateToResults();
    }
  } */

  navigateToNextQuestion(): void {
    this.router.navigate(['/question', this.getQuestionID() + 1]);
    this.displayNextQuestion();
  }

  /* navigateToPreviousQuestion(): void {
    this.router.navigate(['/question', this.getQuestionID() - 1]);
    this.displayPreviousQuestion();
  } */

  navigateToResults(): void {
    this.router.navigate(['/results'], { state:
      {
        totalQuestions: this.totalQuestions,
        correctAnswersCount: this.correctAnswersCount,
        completionTime: this.completionTime,
        allQuestions: this.allQuestions
      }
    });
  }

  // checks whether the question is valid and is answered correctly
  checkIfAnsweredCorrectly() {
    if (this.isThereAnotherQuestion() && this.isCorrectAnswer()) {
      this.incrementCorrectAnswersCount();
      this.correctAnswer = true;
      this.hasAnswer = true;
      this.disabled = false;

      this.elapsedTime = Math.ceil(this.timePerQuestion - this.timeLeft);
      if (this.getQuestionID() < this.totalQuestions) {
        this.elapsedTimes = [...this.elapsedTimes, this.elapsedTime];
      } else {
        this.elapsedTimes = [...this.elapsedTimes, 0];
        this.completionTime = this.calculateTotalElapsedTime(this.elapsedTimes);
      }

      this.quizDelay(3000);

      if (this.getQuestionID() < this.totalQuestions) {
        this.navigateToNextQuestion();
      } else {
        this.navigateToResults();
      }
    }
  }

  incrementCorrectAnswersCount() {
    if (this.questionID <= this.totalQuestions && this.isCorrectAnswer()) {
      if (this.correctAnswersCount === this.totalQuestions) {
        return this.correctAnswersCount;
      } else {
        this.correctAnswer = true;
        this.hasAnswer = true;
        return this.correctAnswersCount++;
      }
    } else {
      this.correctAnswer = false;
      this.hasAnswer = false;
    }
  }

  increaseProgressValue() {
    this.progressValue = parseFloat((100 * (this.getQuestionID() + 1) / this.totalQuestions).toFixed(1));
  }

  /* decreaseProgressValue() {
    this.progressValue = parseFloat((100 * (this.getQuestionID() - 1) / this.totalQuestions).toFixed(1));
  } */

  calculateTotalElapsedTime(elapsedTimes) {
    return this.completionTime = elapsedTimes.reduce((acc, cur) => acc + cur, 0);
  }

  /****************  public API  ***************/
  getQuestionID() {
    return this.questionID;
  }

  setQuestionID(id: number) {
    return this.questionID = id;
  }

  isThereAnotherQuestion(): boolean {
    return this.questionID <= this.allQuestions.length;
  }

  isFinalQuestion(): boolean {
    return this.currentQuestion === this.totalQuestions;
  }

  isCorrectAnswer(): boolean {
    return this.question.selectedOption === this.question.answer;
  }

  get getQuestion(): QuizQuestion {
    return this.allQuestions.filter(
      question => question.questionId === this.questionID
    )[0];
  }

  // countdown clock
  private countdown() {
    if (this.questionID <= this.totalQuestions) {
      this.interval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
          this.checkIfAnsweredCorrectly();

          if (this.correctAnswersCount <= this.totalQuestions) {
            this.calculateTotalElapsedTime(this.elapsedTimes);
          }
          if (this.timeLeft === 0 && !this.isFinalQuestion()) {
            this.navigateToNextQuestion();
          }
          if (this.timeLeft === 0 && this.isFinalQuestion()) {
            this.navigateToResults();
          }
          if (this.isFinalQuestion() && this.hasAnswer === true) {
            this.navigateToResults();
            this.quizIsOver = true;
          }

          // disable the next button until an option has been selected
          this.question.selectedOption === '' ? this.disabled = true : this.disabled = false;
        }
      }, 1000);
    }
  }

  private resetTimer() {
    this.timeLeft = this.timePerQuestion;
  }

  quizDelay(milliseconds) {
    const start = new Date().getTime();
    let counter = 0;
    let end = 0;

    while (counter < milliseconds) {
      end = new Date().getTime();
      counter = end - start;
    }
  }

  
}
