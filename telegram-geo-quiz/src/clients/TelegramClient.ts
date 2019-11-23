import fetch from "node-fetch";

export interface Update {
  update_id: string;
  message?: {
    message_id: string;
    text?: string;
    chat: {
      id: string;
    };
  };
  callback_query?: {
    data: string;
    message: {
      chat: {
        id: string;
      };
    };
  };
}

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

export class TelegramClient {
  private url: string;

  constructor(token: string) {
    this.url = `https://api.telegram.org/bot${token}`;
  }

  sendMessage(options: SendMessageOptions) {
    return fetch(`${this.url}/sendMessage`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(options)
    });
  }
}
