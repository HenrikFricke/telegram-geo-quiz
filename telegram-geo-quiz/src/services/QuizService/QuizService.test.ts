import test from "ava";
import { QuizService } from "./QuizService";
import { LocationRepositoryInterface } from "../../repositories/LocationRepository/LocationRepositoryInterface";
import { QuestionType } from "./QuizServiceInterface";

class LocationRepositoryMock implements LocationRepositoryInterface {
  public async cities() {
    return {
      cities: [
        {
          id: "4",
          name: "rome",
          country: "italy",
          isCapital: true
        },
        {
          id: "5",
          name: "madrid",
          country: "spain",
          isCapital: true
        }
      ]
    };
  }
}

test("QuestionType.CAPITAL_CITY_1", async t => {
  const quizService = new QuizService(new LocationRepositoryMock());
  const { question } = await quizService.newQuestion(
    QuestionType.CAPITAL_CITY_1
  );

  const answer1 = {
    label: "Rome",
    isCorrect: true
  };

  const answer2 = {
    label: "Madrid",
    isCorrect: false
  };

  t.is(question.question, "What is the capital city of Italy?");

  t.deepEqual(question.expectedAnswer, answer1);

  if (question.answers[0].label === answer1.label) {
    t.deepEqual(question.answers, [answer1, answer2]);
  } else {
    t.deepEqual(question.answers, [answer2, answer1]);
  }
});

test("QuestionType.CAPITAL_CITY_2", async t => {
  const quizService = new QuizService(new LocationRepositoryMock());
  const { question } = await quizService.newQuestion(
    QuestionType.CAPITAL_CITY_2
  );

  const answer1 = {
    label: "Italy",
    isCorrect: true
  };

  const answer2 = {
    label: "Spain",
    isCorrect: false
  };

  t.is(question.question, "Rome is the capital city of …?");

  t.deepEqual(question.expectedAnswer, answer1);

  if (question.answers[0].label === answer1.label) {
    t.deepEqual(question.answers, [answer1, answer2]);
  } else {
    t.deepEqual(question.answers, [answer2, answer1]);
  }
});
