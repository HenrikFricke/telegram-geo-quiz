import { LocationRepositoryInterface } from "../../repositories/LocationRepository/LocationRepositoryInterface";
import { QuizServiceInterface, Question } from "./QuizServiceInterface";
import { shuffle } from "../../utils/shuffle";
import { capitalize } from "../../utils/capitalize";

export class QuizService implements QuizServiceInterface {
  constructor(private locationRepository: LocationRepositoryInterface) {}

  public async newQuestion() {
    const question = await this.questionCapital();

    return { question };
  }

  private async questionCapital(): Promise<Question> {
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
}
