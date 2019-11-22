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

export interface LocationRepositoryInterface {
  cities(options?: CitiesRequest): Promise<CitiesResponse>;
}
