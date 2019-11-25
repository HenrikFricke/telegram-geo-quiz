import { DynamoDB } from "aws-sdk";

export function createDynamoDBClient() {
  return new DynamoDB.DocumentClient();
}
