export interface Question {
  question: string;
  answers: Answer[];
}

export interface Answer {
  label: string;
  isCorrect: boolean;
}

export interface NewQuestionResponse {
  question: Question;
}

export interface QuizServiceInterface {
  newQuestion(): Promise<NewQuestionResponse>;
}
