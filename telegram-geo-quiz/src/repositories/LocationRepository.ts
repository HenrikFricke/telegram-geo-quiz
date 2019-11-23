import {
  City,
  CitiesRequest,
  CitiesResponse,
  LocationRepositoryInterface
} from "./LocationRepositoryInterface";
import { shuffle } from "../utils/shuffle";

const city1: City = {
  id: "1",
  name: "Berlin",
  country: "Germany",
  isCapital: true
};

const city2: City = {
  id: "2",
  name: "Paris",
  country: "France",
  isCapital: true
};

const city3: City = {
  id: "3",
  name: "Madrid",
  country: "Spain",
  isCapital: true
};

const city4: City = {
  id: "4",
  name: "Vienna",
  country: "Austria",
  isCapital: true
};

const city5: City = {
  id: "5",
  name: "Rome",
  country: "Italy",
  isCapital: true
};

const city6: City = {
  id: "5",
  name: "Hamburg",
  country: "Germany",
  isCapital: false
};

const cities: City[] = [city1, city2, city3, city4, city5, city6];

export class LocationRepository implements LocationRepositoryInterface {
  public async cities(options: CitiesRequest = {}): Promise<CitiesResponse> {
    const limit = options.limit || 100;

    const filteredCities = cities.filter(c => {
      if (options.isCapital && c.isCapital != options.isCapital) {
        return false;
      }

      return true;
    });

    return { cities: shuffle(filteredCities).slice(0, limit) };
  }
}
