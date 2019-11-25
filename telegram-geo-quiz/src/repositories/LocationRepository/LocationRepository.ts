import { DynamoDB } from "aws-sdk";
import {
  CitiesRequest,
  CitiesResponse,
  LocationRepositoryInterface,
  LocationType,
  LocationEntity
} from "./LocationRepositoryInterface";
import { shuffle } from "../../utils/shuffle";

export class LocationRepository implements LocationRepositoryInterface {
  constructor(
    private dynamoDBClient: DynamoDB.DocumentClient,
    private tableName: string
  ) {}

  public async cities(options: CitiesRequest = {}): Promise<CitiesResponse> {
    const limit = options.limit || 100;

    const { Items } = await this.dynamoDBClient
      .scan({
        TableName: this.tableName,
        FilterExpression: `begins_with(#location,:beginsWith) AND #isCapital = :isCapital`,
        ExpressionAttributeNames: {
          "#location": "location",
          "#isCapital": "isCapital"
        },
        ExpressionAttributeValues: {
          ":beginsWith": "city#",
          ":isCapital": options.isCapital
        }
      })
      .promise();

    if (!Items) {
      throw new Error(`Couldn't find any items.`);
    }

    const cities = Items.map(i => ({
      id: i.id,
      name: this.decodeLocation(i.location).city,
      country: this.decodeLocation(i.location).country,
      isCapital: i.isCapital
    }));

    return { cities: shuffle(cities).slice(0, limit) };
  }

  private decodeLocation(location: string): LocationEntity {
    const l = location.split("#");

    return {
      type: LocationType.city,
      planet: l[1],
      continent: l[2],
      country: l[3],
      city: l[4]
    };
  }
}
