SOURCE_DIR=telegram-geo-quiz
BUCKET_NAME=telegram-geo-quiz

dependencies:
	yarn --cwd $(SOURCE_DIR)

start:
	yarn --cwd $(SOURCE_DIR) tsc --watch & sam local start-api

build: 
	yarn --cwd $(SOURCE_DIR) build 

create-bucket: 
	aws s3 mb s3://$(BUCKET_NAME)

deploy: build	
	sam package --output-template-file packaged.yaml --s3-bucket $(BUCKET_NAME)
	sam deploy --template-file packaged.yaml --stack-name telegram-geo-quiz --capabilities CAPABILITY_IAM
	aws cloudformation describe-stacks --stack-name telegram-geo-quiz --query 'Stacks[].Outputs[?OutputKey==`TelegramGeoQuizApi`]' --output table