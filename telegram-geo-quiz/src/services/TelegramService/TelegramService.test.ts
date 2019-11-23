import test from "ava";
import sinon from "sinon";
import { TelegramService } from "./TelegramService";
import { TelegramWebhookUpdate } from "./TelegramServiceInterface";
import { TelegramClient } from "../../clients/TelegramClient/TelegramClient";
import { QuizService } from "../QuizService/QuizService";
import { LocationRepository } from "../../repositories/LocationRepository/LocationRepository";

test("init message", async t => {
  const telegramClient = new TelegramClient("");
  const sendMessageFake = sinon.fake();
  sinon.replace(telegramClient, "sendMessage", sendMessageFake);

  const quizService = new QuizService(new LocationRepository());
  const telegramService = new TelegramService(quizService, telegramClient);

  const startUpdate: TelegramWebhookUpdate = {
    update_id: "1",
    message: {
      message_id: "1",
      text: "/start",
      chat: {
        id: "1"
      }
    }
  };

  await telegramService.handle(startUpdate);

  t.true(
    sendMessageFake.calledWith({
      chat_id: "1",
      text: "Welcom to Geo Quizzz 👋"
    })
  );
});
