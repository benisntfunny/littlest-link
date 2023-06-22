/** @format */

import { SSTConfig } from "sst";
import { ApiStack } from "./stacks/MyStack";
import { StorageStack } from "./stacks/StorageStack";

export default {
  config(_input) {
    return {
      name: "littlest-link",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(StorageStack).stack(ApiStack);
  },
} satisfies SSTConfig;
