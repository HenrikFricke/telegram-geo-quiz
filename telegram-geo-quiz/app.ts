import {
  APIGatewayProxyResult,
  APIGatewayEventRequestContext,
  APIGatewayEvent
} from "aws-lambda";

export const handler = async (
  event: APIGatewayEvent,
  context: APIGatewayEventRequestContext
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "hello world 2"
    })
  };
};
