import { Update, TelegramClient } from "./clients/TelegramClient";
import {
  APIGatewayProxyResult,
  APIGatewayEventRequestContext,
  APIGatewayEvent
} from "aws-lambda";

export const handler = async (
  event: APIGatewayEvent,
  context: APIGatewayEventRequestContext
): Promise<APIGatewayProxyResult> => {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!telegramBotToken) {
    throw new Error("Environment variable TELEGRAM_BOT_TOKEN is missing");
  }

  console.log("BODY", event.body);

  const telegramUpdate: Update = JSON.parse(event.body || "{}");
  const telegramClient = new TelegramClient(telegramBotToken);

  await telegramClient.sendMessage({
    chatId: telegramUpdate.message.chat.id,
    text: "Hello 👋"
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      status: "Ok"
    })
  };
};
