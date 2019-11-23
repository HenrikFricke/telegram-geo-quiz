export interface SendMessageOptions {
  chat_id: string;
  text: string;
  reply_markup?: {
    inline_keyboard?: {
      text: string;
      callback_data: string;
    }[][];
  };
}

export interface TelegramClientInterface {
  sendMessage(options: SendMessageOptions): Promise<void>;
}
