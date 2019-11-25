import anyTest, { TestInterface } from "ava";
import { LocationRepository } from "./LocationRepository";
import { DynamoDB } from "aws-sdk";
import AWS from "aws-sdk";
import AWSMock from "aws-sdk-mock";
import sinon from "sinon";

const tableName = "a-table-name";

const test = anyTest as TestInterface<{
  scanStub: sinon.SinonStub;
}>;

test.beforeEach(t => {
  t.context.scanStub = sinon.stub();
  AWSMock.setSDKInstance(AWS);
  AWSMock.mock("DynamoDB.DocumentClient", "scan", t.context.scanStub);
});

test.afterEach(() => {
  AWSMock.restore("DynamoDB.DocumentClient");
});

test("cities method should return mapped cities", async t => {
  t.context.scanStub.resolves({
    Items: [
      {
        id: "1",
        location: "city#earth#europe#germany#berlin",
        isCapital: true
      },
      {
        id: "2",
        location: "city#earth#europe#france#paris",
        isCapital: true
      },
      {
        id: "3",
        location: "city#earth#europe#spain#madrid",
        isCapital: true
      }
    ]
  });

  const dynamoDBClient = new DynamoDB.DocumentClient({ region: "eu-west-1" });
  const locationRepoitory = new LocationRepository(dynamoDBClient, tableName);
  const { cities } = await locationRepoitory.cities({
    limit: 2,
    isCapital: true
  });

  t.is(cities.length, 2);
});
