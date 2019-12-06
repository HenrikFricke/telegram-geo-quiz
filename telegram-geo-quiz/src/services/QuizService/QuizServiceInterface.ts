export enum QuestionType {
  CAPITAL_CITY_1,
  CAPITAL_CITY_2
}

export interface Question {
  question: string;
  expectedAnswer: Answer;
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
  newQuestion(type?: QuestionType): Promise<NewQuestionResponse>;
}
