import { LocationRepositoryInterface } from "../repositories/LocationRepositoryInterface";
import { QuizServiceInterface, Question } from "./QuizServiceInterface";

export class QuizService implements QuizServiceInterface {
  constructor(private locationRepository: LocationRepositoryInterface) {}

  public async newQuestion() {
    const question = await this.questionCapital();

    return { question };
  }

  public checkAnswer(questionId: string, answerId: string) {
    return this.checkAnswerCapital(questionId, answerId);
  }

  private async questionCapital(): Promise<Question> {
    const { cities } = await this.locationRepository.cities({
      limit: 4,
      isCapital: true
    });

    const expectedCity = cities[0];

    const answers = cities.map(c => ({
      id: `answer-capital-${c.country.toLowerCase()}-${c.name.toLowerCase()}`,
      label: c.name
    }));

    return {
      id: `question-capital-${expectedCity.country.toLowerCase()}-${expectedCity.name.toLowerCase()}`,
      question: `What is the capital city of ${expectedCity.country}?`,
      answers: this.shuffle(answers)
    };
  }

  private checkAnswerCapital(questionId: string, answerId: string) {
    const expectedCountry = questionId.split("0")[2].toLowerCase();
    const expectedCity = questionId.split("0")[3].toLowerCase();

    const country = answerId.split("0")[2].toLowerCase();

    if (expectedCountry === country) {
      return {
        expectedAnswer: expectedCity
      };
    }

    return {};
  }

  private shuffle<I>(array: I[]): I[] {
    let ctr = array.length,
      temp,
      index;

    while (ctr > 0) {
      index = Math.floor(Math.random() * ctr);
      ctr--;
      temp = array[ctr];
      array[ctr] = array[index];
      array[index] = temp;
    }

    return array;
  }
}
