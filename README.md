# Telegram Geo Quiz

## Dependencies

- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-reference.html#serverless-sam-cli)
- AWS CLI
- NodeJS
- Yarn
- Docker

## Development

Make sure to have AWS credentials in your environment to process the deployment.

```shell
# Install Yarn dependencies
$ > make dependencies

# Local dev environment
$ > make start

# Create S3 bucket for Cloudformation
# (only necessary once per environment)
$ > make create-bucket

# Transpile TS files, upload package to S3 bucket and deploy Cloudformation stack
$ > make deploy
```

## Resources

- [Tool to manage AWS credentials](https://github.com/Luzifer/awsenv)
