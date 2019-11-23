import {
  Update,
  TelegramClient
} from "./clients/TelegramClient/TelegramClient";
import { LocationRepository } from "./repositories/LocationRepository/LocationRepository";
import { QuizService } from "./services/QuizService/QuizService";
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
  const locationRepository = new LocationRepository();
  const quizService = new QuizService(locationRepository);

  if (telegramUpdate.callback_query) {
    await telegramClient.sendMessage({
      chat_id: telegramUpdate.callback_query.message.chat.id,
      text: telegramUpdate.callback_query.data
    });
    const { question } = await quizService.newQuestion();
    await telegramClient.sendMessage({
      chat_id: telegramUpdate.callback_query.message.chat.id,
      text: question.question,
      reply_markup: {
        inline_keyboard: [
          question.answers.map(a => ({
            text: a.label,
            callback_data: a.isCorrect
              ? "Wow! You're absolutely right."
              : "Hm, your answer was wrong 😱"
          }))
        ]
      }
    });

    return Ok;
  }

  if (!telegramUpdate.message) {
    return Ok;
  }

  switch (telegramUpdate.message.text) {
    case "/start": {
      await telegramClient.sendMessage({
        chat_id: telegramUpdate.message.chat.id,
        text: "Welcom to Geo Quizzz 👋"
      });
      break;
    }

    case "/new": {
      const { question } = await quizService.newQuestion();
      await telegramClient.sendMessage({
        chat_id: telegramUpdate.message.chat.id,
        text: question.question,
        reply_markup: {
          inline_keyboard: [
            question.answers.map(a => ({
              text: a.label,
              callback_data: a.isCorrect
                ? "Wow! You're absolutely right."
                : "Hm, your answer was wrong 😱"
            }))
          ]
        }
      });
      break;
    }

    default: {
      await telegramClient.sendMessage({
        chat_id: telegramUpdate.message.chat.id,
        text:
          "Hm, looks like I don't understand your message 😞 Do you want to have a /new question?"
      });
    }
  }

  return Ok;
};
