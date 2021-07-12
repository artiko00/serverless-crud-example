import "source-map-support/register";

import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

import { DynamoDB } from 'aws-sdk'

const docClient = new DynamoDB.DocumentClient()

const deleteItem = async (event) => {

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key:{
      id: event.pathParameters.id
    }
  }
  const result = await docClient.delete(params).promise()
  console.log(result)
  return formatJSONResponse({
    message: `Result: ${JSON.stringify(result)}`
  });
};

export const main = middyfy(deleteItem);
