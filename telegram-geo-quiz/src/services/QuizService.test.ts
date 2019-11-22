import test from "ava";
import { QuizService } from "./QuizService";
import { LocationRepositoryInterface } from "../repositories/LocationRepositoryInterface";

class LocationRepositoryMock implements LocationRepositoryInterface {
  public async cities() {
    return {
      cities: [
        {
          id: "5",
          name: "Rome",
          country: "Italy",
          isCapital: true
        },
        {
          id: "5",
          name: "Madrid",
          country: "Spain",
          isCapital: true
        }
      ]
    };
  }
}

test("newQuestion method should return question", async t => {
  const quizService = new QuizService(new LocationRepositoryMock());
  const { question } = await quizService.newQuestion();

  const answer1 = {
    id: "answer-capital-italy-rome",
    label: "Rome"
  };

  const answer2 = {
    id: "answer-capital-spain-madrid",
    label: "Madrid"
  };

  t.is(question.id, "question-capital-italy-rome");
  t.is(question.question, "What is the capital city of Italy?");

  if (question.answers[0].id === answer1.id) {
    t.deepEqual(question.answers, [answer1, answer2]);
  } else {
    t.deepEqual(question.answers, [answer2, answer1]);
  }
});
