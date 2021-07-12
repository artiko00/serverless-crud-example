import type { AWS } from "@serverless/typescript";

import createItem from "@functions/createItem";
import getItem from "@functions/getItem";
import listItems from "@functions/listItems";
import editItem from "@functions/editItem";
import deleteItem from "@functions/deleteItem";

const serverlessConfiguration: AWS = {
  service: "api-jest",
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  plugins: ["serverless-webpack"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "us-west-2",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      DYNAMODB_TABLE: "${self:service}-${opt:stage, self:provider.stage}",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["dynamodb:*"],
        Resource:
          "arn:aws:dynamodb:${opt:region,self:provider.region}:*:table/${self:provider.environment.DYNAMODB_TABLE}",
      },
    ],
    lambdaHashingVersion: "20201221",
  },
  // import the function via paths
  functions: { createItem, getItem, listItems, editItem, deleteItem },
  resources: {
    Resources: {
      ApiJestTable: {
        Type: "AWS::DynamoDB::Table",
        DeletionPolicy: "Retain",
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
          TableName: "${self:provider.environment.DYNAMODB_TABLE}",
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
