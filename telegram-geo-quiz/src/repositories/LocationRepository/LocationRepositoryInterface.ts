export interface City {
  id: string;
  name: string;
  country: string;
  isCapital: boolean;
}

export interface CitiesRequest {
  limit?: number;
  isCapital?: boolean;
}

export interface CitiesResponse {
  cities: City[];
}

export enum LocationType {
  city = "city"
}

export interface LocationEntityCity {
  type: LocationType.city;
  planet: string;
  continent: string;
  country: string;
  city: string;
}

export type LocationEntity = LocationEntityCity;

export interface LocationRepositoryInterface {
  cities(options?: CitiesRequest): Promise<CitiesResponse>;
}
