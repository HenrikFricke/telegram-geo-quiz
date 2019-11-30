import fs from "fs";
import path from "path";
import csv from "async-csv";
import AWS from "aws-sdk";

(async () => {
  const data = fs.readFileSync(path.resolve("data/locations.csv"));
  const rows = await csv.parse(data);

  const tableName = process.env.TABLE_NAME;

  if (!tableName) {
    throw new Error("process.env.TABLE_NAME is missing");
  }

  const client = new AWS.DynamoDB.DocumentClient();
  const putRequests = rows
    .filter((r, i) => i !== 0)
    .map(row => ({
      PutRequest: {
        Item: {
          id: row[[0]],
          location: row[1],
          isCapital: row[2] === "true"
        }
      }
    }));

  const chunks = putRequests.reduce((all, one, i) => {
    const ch = Math.floor(i / 25);
    all[ch] = [].concat(all[ch] || [], one);
    return all;
  }, []);

  await Promise.all(
    chunks.map(chunk =>
      client
        .batchWrite({
          RequestItems: {
            [tableName]: chunk
          }
        })
        .promise()
    )
  );

  console.log("Done.");
})();
