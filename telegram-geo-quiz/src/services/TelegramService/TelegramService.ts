import { QuizServiceInterface } from "../QuizService/QuizServiceInterface";
import {
  TelegramServiceInterface,
  TelegramWebhookUpdate,
  TelegramUpdateMessage,
  TelegramUpdateCallbackQuery
} from "./TelegramServiceInterface";
import { TelegramClientInterface } from "../../clients/TelegramClient/TelegramClientInterface";

export class TelegramService implements TelegramServiceInterface {
  constructor(
    private quizService: QuizServiceInterface,
    private telegramClient: TelegramClientInterface
  ) {}

  async handle(update: TelegramWebhookUpdate) {
    if (update.callback_query) {
      await this.hadleCallbackQueries(update.callback_query);
    }

    if (update.message) {
      await this.handleTextMessage(update.message);
    }
  }

  private async hadleCallbackQueries(
    callbackQuery: TelegramUpdateCallbackQuery
  ) {
    const chatId = callbackQuery.message.chat.id;

    await this.telegramClient.sendMessage({
      chat_id: chatId,
      text: callbackQuery.data
    });

    await this.newQuestion(chatId);
  }

  private async handleTextMessage(message: TelegramUpdateMessage) {
    const chatId = message.chat.id;

    switch (message.text) {
      case "/start": {
        return this.greeting(chatId);
      }

      case "/new": {
        return await this.newQuestion(chatId);
      }

      default: {
        return this.fallback(chatId);
      }
    }
  }

  private async greeting(chatId: string) {
    return this.telegramClient.sendMessage({
      chat_id: chatId,
      text: "Welcom to Geo Quizzz 👋"
    });
  }

  private async newQuestion(chatId: string) {
    const { question } = await this.quizService.newQuestion();
    return this.telegramClient.sendMessage({
      chat_id: chatId,
      text: question.question,
      reply_markup: {
        inline_keyboard: question.answers.map(a => [
          {
            text: a.label,
            callback_data: a.isCorrect
              ? "Wow! You're absolutely right."
              : "Hm, your answer was wrong 😱"
          }
        ])
      }
    });
  }

  private async fallback(chatId: string) {
    return this.telegramClient.sendMessage({
      chat_id: chatId,
      text:
        "Hm, looks like I don't understand your message 😞 Do you want to have a /new question?"
    });
  }
}
