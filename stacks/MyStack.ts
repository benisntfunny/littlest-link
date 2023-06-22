/** @format */

import { StackContext, Api, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";
export function ApiStack({ stack }: StackContext) {
  const { shortLinks, originalLinks } = use(StorageStack);

  const api = new Api(stack, "api", {
    customDomain: process.env.DOMAIN_NAME || "",
    defaults: {
      function: {
        timeout: 30,
        memorySize: 128,
        bind: [shortLinks, originalLinks],
        permissions: ["dynamodb:*", "s3:*"],
        environment: {
          SHORT_LINKS_TABLE: shortLinks.tableName,
          ORIGINAL_LINKS_TABLE: originalLinks.tableName,
          apiKey: process.env.API_KEY || "nokey",
        },
      },
    },
    routes: {
      "GET /{shortLink}": "packages/functions/src/links.go",
      "POST /": "packages/functions/src/links.generate",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
  return { api };
}
