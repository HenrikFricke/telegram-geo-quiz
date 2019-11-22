import { Update, TelegramClient } from "./clients/TelegramClient";
import {
  APIGatewayProxyResult,
  APIGatewayEventRequestContext,
  APIGatewayEvent
} from "aws-lambda";

const Ok = {
  statusCode: 200,
  body: JSON.stringify({
    status: "Ok"
  })
};

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

  if (!telegramUpdate.message.text) {
    return Ok;
  }

  switch (telegramUpdate.message.text) {
    case "/start": {
      await telegramClient.sendMessage({
        chatId: telegramUpdate.message.chat.id,
        text: "Welcom to Geo Quizzz 👋"
      });
      break;
    }

    case "/new": {
      await telegramClient.sendMessage({
        chatId: telegramUpdate.message.chat.id,
        text: "New question 🎉"
      });
      break;
    }

    default: {
      await telegramClient.sendMessage({
        chatId: telegramUpdate.message.chat.id,
        text:
          "Hm, looks like I don't understand your message 😞 Do you want to have a /new question?"
      });
    }
  }

  return Ok;
};
