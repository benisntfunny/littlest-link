/** @format */

import { ApiHandler } from "sst/node/api";
import { readItemFromDynamoDB, writeToDynamoDB } from "./lib/aws";

function generateRandomString(len: number) {
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";

  for (let i = 0; i < len; i++) {
    let randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  return randomString;
}

function authorized(_evt: any) {
  console.log(
    !_evt?.headers?.apikey || _evt?.headers?.apikey !== process.env.apiKey
  );
  return (
    !_evt?.headers?.apikey ||
    _evt?.headers?.apikey !== (process.env.apiKey || "nokey")
  );
}

export const generate = ApiHandler(async (_evt) => {
  //console.log(_evt);
  if (authorized(_evt)) {
    console.log("unauthorized", authorized(_evt));
    return {
      statusCode: 401,
      body: "Unauthorized",
    };
  }
  try {
    const { url } = JSON.parse(_evt.body || "{}");

    if (!url) {
      return {
        statusCode: 500,
        body: "No URL Provided",
      };
    }

    //check if exists
    const existing = await readItemFromDynamoDB(
      process.env.ORIGINAL_LINKS_TABLE || "",
      { url }
    );
    if (!existing) {
      let notUnique = true;
      while (notUnique) {
        let shortLink = generateRandomString(10);
        const existing = await readItemFromDynamoDB(
          process.env.SHORT_LINKS_TABLE || "",
          { urlKey: shortLink }
        );
        if (!existing) {
          await writeToDynamoDB(process.env.SHORT_LINKS_TABLE || "", {
            urlKey: shortLink,
            url,
          });
          await writeToDynamoDB(process.env.ORIGINAL_LINKS_TABLE || "", {
            url,
            urlKey: shortLink,
          });
          return {
            statusCode: 200,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: shortLink }),
          };
          notUnique = false;
        }
      }
    } else {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: existing.urlKey }),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: "Internal Error",
    };
  }
});

export async function go(_evt: any) {
  try {
    const urlKey = _evt.pathParameters?.shortLink;

    if (!urlKey) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "text/html",
        },
        body: `<html><head><meta http-equiv="refresh" content="0; url=https://littlest.link/" /></head><body><h1>littlest.link</h1><p>Download source <a href="https://github.com/benisntfunny/littlest-link" target="_blank">here</a>.</p></body></html>`,
      };
    }

    //check if exists
    const existing = await readItemFromDynamoDB(
      process.env.SHORT_LINKS_TABLE || "",
      { urlKey }
    );
    if (existing) {
      return {
        statusCode: 301,
        headers: {
          Location: existing.url,
        },
      };
    } else {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "text/html",
        },
        body:
          '<html><head><meta http-equiv="refresh" content="0; url=https://littlest.link/' +
          urlKey +
          '" /></head><body><h1>' +
          urlKey +
          " not found</body></html>",
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: "Internal Error",
    };
  }
}
