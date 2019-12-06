import { LocationRepositoryInterface } from "../../repositories/LocationRepository/LocationRepositoryInterface";
import {
  QuizServiceInterface,
  Question,
  QuestionType
} from "./QuizServiceInterface";
import { shuffle } from "../../utils/shuffle";
import { capitalize } from "../../utils/capitalize";
import { assertNever } from "../../utils/assertNever";
import { randomEnum } from "../../utils/randomEnum";

export class QuizService implements QuizServiceInterface {
  constructor(private locationRepository: LocationRepositoryInterface) {}

  public async newQuestion(type?: QuestionType) {
    const questionType = type || randomEnum(QuestionType);

    switch (questionType) {
      case QuestionType.CAPITAL_CITY_1: {
        const question = await this.questionCapital1();
        return { question };
      }

      case QuestionType.CAPITAL_CITY_2: {
        const question = await this.questionCapital2();
        return { question };
      }

      default: {
        return assertNever(questionType);
      }
    }
  }

  private async questionCapital1(): Promise<Question> {
    const { cities } = await this.locationRepository.cities({
      limit: 4,
      isCapital: true
    });

    const expectedCity = cities[0];

    const answers = cities.map(c => ({
      label: capitalize(c.name),
      isCorrect: c.id === expectedCity.id
    }));

    return {
      question: `What is the capital city of ${capitalize(
        expectedCity.country
      )}?`,
      expectedAnswer: answers.filter(a => a.isCorrect)[0],
      answers: shuffle(answers)
    };
  }

  private async questionCapital2(): Promise<Question> {
    const { cities } = await this.locationRepository.cities({
      limit: 4,
      isCapital: true
    });

    const expectedCity = cities[0];

    const answers = cities.map(c => ({
      label: capitalize(c.country),
      isCorrect: c.id === expectedCity.id
    }));

    return {
      question: `${capitalize(expectedCity.name)} is the capital city of …?`,
      expectedAnswer: answers.filter(a => a.isCorrect)[0],
      answers: shuffle(answers)
    };
  }
}
