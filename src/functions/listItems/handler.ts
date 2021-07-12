import "source-map-support/register";

import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

import { DynamoDB } from 'aws-sdk'

const docClient = new DynamoDB.DocumentClient()

const getItems = async (event) => {

  const params = {
    TableName: process.env.DYNAMODB_TABLE
  }
  const result = await docClient.scan(params).promise()
  console.log(result)
  return formatJSONResponse({
    message: `Result: ${JSON.stringify(result)}`
  });
};

export const main = middyfy(getItems);
