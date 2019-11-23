import fetch from "node-fetch";
import {
  TelegramClientInterface,
  SendMessageOptions
} from "./TelegramClientInterface";

export class TelegramClient implements TelegramClientInterface {
  private url: string;

  constructor(token: string) {
    this.url = `https://api.telegram.org/bot${token}`;
  }

  async sendMessage(options: SendMessageOptions) {
    await fetch(`${this.url}/sendMessage`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(options)
    });
  }
}
