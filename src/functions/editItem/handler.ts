import "source-map-support/register";

import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

import { DynamoDB } from 'aws-sdk'
import { UpdateItemInput } from "aws-sdk/clients/dynamodb";

const docClient = new DynamoDB.DocumentClient()

const editItem = async (event) => {

  const params:UpdateItemInput = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    UpdateExpression: 'SET #z = :x, #v = :y',
    ExpressionAttributeNames: {
      "#z": "name",
      "#v": "description",
  },
    ExpressionAttributeValues: {
      ':x': event.body.name,
      ':y': event.body.description
    },
    ReturnValues: 'ALL_NEW',
  };
  
  const result = await docClient.update(params).promise()
  console.log(result)
  return formatJSONResponse({
    message: `Result: ${JSON.stringify(result)}`
  });
};

export const main = middyfy(editItem);
