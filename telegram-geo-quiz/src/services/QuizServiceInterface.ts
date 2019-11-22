import { LocationRepositoryInterface } from "../repositories/LocationRepositoryInterface";

export interface Question {
  id: string;
  question: string;
  answers: Answer[];
}

export interface Answer {
  id: string;
  label: string;
}

export interface NewQuestionResponse {
  question: Question;
}

export interface AnswerRight {}
export interface AnswerWrong {
  expectedAnswer: string;
}

export type CheckAnswerResponse = AnswerRight | AnswerWrong;

export interface QuizServiceInterface {
  newQuestion(): Promise<NewQuestionResponse>;
  checkAnswer(questionId: string, answer: string): AnswerRight | AnswerWrong;
}
