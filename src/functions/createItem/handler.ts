import "source-map-support/register";

import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

import { DynamoDB } from 'aws-sdk'

const docClient = new DynamoDB.DocumentClient()

import { v4 as uuidv4 } from 'uuid';
import CreateItemInterface from "src/commons/dtos/create-item.dto";

const createItem = async (event) => {

  const Item:CreateItemInterface = event.body
  
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {...Item,
    id: uuidv4()}
  }
  const result = await docClient.put(params).promise()

  return formatJSONResponse({
    message: `Result: ${JSON.stringify(result)}`
  });
};

export const main = middyfy(createItem);
