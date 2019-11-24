import anyTest, { TestInterface } from "ava";
import sinon from "sinon";
import { TelegramService } from "./TelegramService";
import {
  TelegramWebhookUpdate,
  TelegramServiceInterface
} from "./TelegramServiceInterface";
import { TelegramClient } from "../../clients/TelegramClient/TelegramClient";
import { QuizService } from "../QuizService/QuizService";
import { LocationRepository } from "../../repositories/LocationRepository/LocationRepository";
import { TelegramClientInterface } from "../../clients/TelegramClient/TelegramClientInterface";
import { QuizServiceInterface } from "../QuizService/QuizServiceInterface";
import { Question } from "../QuizService/QuizServiceInterface";

const test = anyTest as TestInterface<{
  telegramClient: TelegramClientInterface;
  quizService: QuizServiceInterface;
  telegramService: TelegramServiceInterface;
  sendMessageFake: sinon.SinonSpy;
}>;

const fakeQuestion: Question = {
  question: "What is the capital city of Italy?",
  expectedAnswer: {
    label: "Rome",
    isCorrect: true
  },
  answers: [
    {
      label: "Rome",
      isCorrect: true
    },
    {
      label: "Madrid",
      isCorrect: false
    }
  ]
};

const replyMarkup = {
  inline_keyboard: [
    [
      {
        text: fakeQuestion.answers[0].label,
        callback_data: "Top 👍"
      }
    ],
    [
      {
        text: fakeQuestion.answers[1].label,
        callback_data: "Hm 😳 The right answer is Rome."
      }
    ]
  ]
};

test.beforeEach(t => {
  t.context.telegramClient = new TelegramClient("");
  t.context.sendMessageFake = sinon.fake();
  sinon.replace(
    t.context.telegramClient,
    "sendMessage",
    t.context.sendMessageFake
  );

  t.context.quizService = new QuizService(new LocationRepository());
  sinon.replace(
    t.context.quizService,
    "newQuestion",
    sinon.fake.resolves({ question: fakeQuestion })
  );

  t.context.telegramService = new TelegramService(
    t.context.quizService,
    t.context.telegramClient
  );
});

test("/start", async t => {
  const chatId = "chat id";

  const startUpdate: TelegramWebhookUpdate = {
    update_id: "1",
    message: {
      message_id: "1",
      text: "/start",
      chat: {
        id: chatId
      }
    }
  };

  await t.context.telegramService.handle(startUpdate);

  t.deepEqual(t.context.sendMessageFake.firstCall.args, [
    {
      chat_id: chatId,
      text: "Welcom to Geo Quizzz 👋"
    }
  ]);
});

test("/new", async t => {
  const chatId = "chat id";

  const startUpdate: TelegramWebhookUpdate = {
    update_id: "1",
    message: {
      message_id: "1",
      text: "/new",
      chat: {
        id: chatId
      }
    }
  };

  await t.context.telegramService.handle(startUpdate);

  t.deepEqual(t.context.sendMessageFake.firstCall.args, [
    {
      chat_id: chatId,
      text: fakeQuestion.question,
      reply_markup: replyMarkup
    }
  ]);
});

test("callback query", async t => {
  const chatId = "chat id";
  const data = "Hello world";

  const startUpdate: TelegramWebhookUpdate = {
    update_id: "1",
    callback_query: {
      data: data,
      message: {
        chat: {
          id: chatId
        }
      }
    }
  };

  await t.context.telegramService.handle(startUpdate);

  t.deepEqual(t.context.sendMessageFake.firstCall.args, [
    {
      chat_id: chatId,
      text: data
    }
  ]);

  t.deepEqual(t.context.sendMessageFake.secondCall.args, [
    {
      chat_id: chatId,
      text: fakeQuestion.question,
      reply_markup: replyMarkup
    }
  ]);
});

test("unknown message", async t => {
  const chatId = "chat id";

  const startUpdate: TelegramWebhookUpdate = {
    update_id: "1",
    message: {
      message_id: "1",
      text: "Hello lovely bot",
      chat: {
        id: chatId
      }
    }
  };

  await t.context.telegramService.handle(startUpdate);

  t.deepEqual(t.context.sendMessageFake.firstCall.args, [
    {
      chat_id: chatId,
      text:
        "Hm, looks like I don't understand your message 😞 Do you want to have a /new question?"
    }
  ]);
});
