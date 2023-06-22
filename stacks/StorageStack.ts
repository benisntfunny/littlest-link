/** @format */

import { Table, Bucket } from "sst/constructs";

export function StorageStack({ stack, app }) {
  const shortLinks = new Table(stack, "short-links", {
    fields: { urlKey: "string" },
    primaryIndex: { partitionKey: "urlKey" },
  });
  const originalLinks = new Table(stack, "original-links", {
    fields: { url: "string" },
    primaryIndex: { partitionKey: "url" },
  });

  return { shortLinks, originalLinks };
}
