import { TelegramClient } from "./clients/TelegramClient/TelegramClient";
import { LocationRepository } from "./repositories/LocationRepository/LocationRepository";
import { QuizService } from "./services/QuizService/QuizService";
import { TelegramService } from "./services/TelegramService/TelegramService";
import { TelegramWebhookUpdate } from "./services/TelegramService/TelegramServiceInterface";
import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!telegramBotToken) {
    throw new Error("Environment variable TELEGRAM_BOT_TOKEN is missing");
  }

  console.log("BODY", event.body);

  const telegramUpdate: TelegramWebhookUpdate = JSON.parse(event.body || "{}");
  const telegramClient = new TelegramClient(telegramBotToken);
  const locationRepository = new LocationRepository();
  const quizService = new QuizService(locationRepository);

  const telegramService = new TelegramService(quizService, telegramClient);
  await telegramService.handle(telegramUpdate);

  return {
    statusCode: 200,
    body: JSON.stringify({
      status: "Ok"
    })
  };
};
