AWS_REGION=eu-west-1
AWS_DEFAULT_REGION=eu-west-1
SOURCE_DIR=telegram-geo-quiz
BUCKET_NAME=telegram-geo-quiz-$(AWS_REGION)

export AWS_REGION
export AWS_DEFAULT_REGION

$(shell touch .env)
include .env

node_modules/.yarn-integrity: yarn.lock
	yarn
	@touch $@

$(SOURCE_DIR)/node_modules/.yarn-integrity: $(SOURCE_DIR)/yarn.lock
	yarn --cwd $(SOURCE_DIR)
	@touch $@

dependencies: node_modules/.yarn-integrity $(SOURCE_DIR)/node_modules/.yarn-integrity

start: dependencies
	yarn --cwd $(SOURCE_DIR) tsc --watch & sam local start-api

build: dependencies
	yarn --cwd $(SOURCE_DIR) build

test: dependencies
	@ if [ "${CI}" = "true" ]; then \
			yarn --cwd $(SOURCE_DIR) test; \
	else \
		yarn --cwd $(SOURCE_DIR) test --watch; \
	fi

create-bucket:
	@aws s3 mb s3://$(BUCKET_NAME)

deploy: guard-TELEGRAM_BOT_TOKEN build
	@sam package --output-template-file packaged.yaml --s3-bucket $(BUCKET_NAME)
	@sam deploy \
		--template-file packaged.yaml \
		--stack-name telegram-geo-quiz \
		--capabilities CAPABILITY_IAM \
		--parameter-overrides TelegramBotToken=${TELEGRAM_BOT_TOKEN}
	@aws cloudformation describe-stacks \
		--stack-name telegram-geo-quiz \
		--query 'Stacks[].Outputs' \
		--output table

upload-dynamodb-data:
	@TABLE_NAME=$(shell make table-name) node --experimental-modules scripts/upload-dynamodb-data.mjs

table-name:
	@aws cloudformation describe-stacks \
		--stack-name telegram-geo-quiz \
		--query 'Stacks[].Outputs[?OutputKey==`LocationTableName`].OutputValue' \
		--output text

guard-%:
	@ if [ "${${*}}" = "" ]; then \
			echo "Environment variable $* not set"; \
			exit 1; \
	fi
