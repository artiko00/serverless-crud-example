import "source-map-support/register";

import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

import { DynamoDB } from 'aws-sdk'

const docClient = new DynamoDB.DocumentClient()

const getItem = async (event) => {

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key:{
      id: event.pathParameters.id
    }
  }
  const result = await docClient.get(params).promise()
  return formatJSONResponse({
    message: `Item: ${JSON.stringify(result)}`
  });
};

export const main = middyfy(getItem);
