import fetch from "node-fetch";

export interface Update {
  update_id: string;
  message: {
    message_id: string;
    text?: string;
    chat: {
      id: string;
    };
  };
}

export interface SendMessageOptions {
  chatId: string;
  text: string;
}

export class TelegramClient {
  private url: string;

  constructor(token: string) {
    this.url = `https://api.telegram.org/bot${token}`;
  }

  sendMessage(options: SendMessageOptions) {
    console.log(this.url);

    return fetch(`${this.url}/sendMessage`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: options.chatId,
        text: options.text
      })
    });
  }
}
