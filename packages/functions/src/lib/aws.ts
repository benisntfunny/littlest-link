/** @format */

import { DynamoDB } from "aws-sdk";
const dynamoDb = new DynamoDB.DocumentClient();

export async function readItemFromDynamoDB(TableName: string, Key: any) {
  let params: any = {
    TableName,
    Key,
  };
  let result = await dynamoDb.get(params).promise();
  return result.Item;
}
export async function writeToDynamoDB(TableName: string, Item: any) {
  let params: any = {
    TableName,
    Item,
  };
  await dynamoDb.put(params).promise();
  return params.Item;
}
