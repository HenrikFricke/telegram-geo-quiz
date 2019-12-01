# Telegram Geo Quiz

## Dependencies

- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-reference.html#serverless-sam-cli)
- AWS CLI
- NodeJS
- Yarn
- Docker

## Development

The setup is very test-driven: In theory, you could start a local environment with Sam, but it's not very helpful as the communication to Telegram is not working locally. The recommended approach is to implement new features with unit tests and then create a bot instance to test it directly in Telegram.

```shell
# Local dev environment
$ > make start

# Run unit tests
$ > make test

# Build TypeScript
$ > make build
```

## Setup bot instance

1. Use [Telegram's BotFather](https://core.telegram.org/bots#6-botfather) to create a bot.
2. Take the generated token of the new bot and create a `.env` file:

```
TELEGRAM_BOT_TOKEN=
ENVIRONMENT=staging
```

3. Make sure you have AWS credentials in your environment
4. Create a S3 bucket for your Cloudformation stack: `make create-bucket`
5. Deploy the stack: `make deploy`
6. After the deployment, you should receive a URL in the terminal. Copy it.
7. Set the webhook to integrate the stack with Telegram:

```shell
curl -X POST https://api.telegram.org/bot{{ TELEGRAM_BOT_TOKEN }}/setWebhook\?url\={{ encoded url }
```

8. Upload locations to the DynamoDB table: `make upload-dynamodb-data`
9. Now you should be able to interact with the bot. Send some messages to the bot in Telegram.

Next time, you just need to execute `make deploy` to update your tech stack.

## Resources

- [Tool to manage AWS credentials](https://github.com/Luzifer/awsenv)
