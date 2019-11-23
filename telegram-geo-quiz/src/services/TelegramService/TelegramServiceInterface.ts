export interface TelegramUpdateCallbackQuery {
  data: string;
  message: {
    chat: {
      id: string;
    };
  };
}

export interface TelegramUpdateMessage {
  message_id: string;
  text?: string;
  chat: {
    id: string;
  };
}

export interface TelegramWebhookUpdate {
  update_id: string;
  message?: TelegramUpdateMessage;
  callback_query?: TelegramUpdateCallbackQuery;
}

export interface TelegramServiceInterface {
  handle(update: TelegramWebhookUpdate): Promise<void>;
}
