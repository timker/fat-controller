"use strict";

let spreadsheetId = "replace Values";
const { dialogflow } = require("actions-on-google");
const functions = require("firebase-functions");
const { google } = require("googleapis");

// what does  debug: true mean?
const app = dialogflow({ debug: true });

app.intent("Check Weight", async (conv, {}) => {
  //ask|response|close

  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });
  const sheetsAPI = google.sheets({ version: "v4", auth });
  let currentWeight = await GetWeight(sheetsAPI);

  return conv.close(`Your latest weight is ${currentWeight} k gees`);
});

async function GetWeight(sheetsApi) {
  let response = await sheetsApi.spreadsheets.values.get({
    spreadsheetId,
    range: "Configuration!B1"
  });
  console.log(response);
  return response.data.values[0][0];
}

app.intent("Add Weight", (conv, { weight }) => {
  console.log("zzzzzzzzzzzzzzzz");
  console.log(weight);
  return conv.close(`let's round it up to ${weight.amount + 1}, fatass`);
});

//how does Dialogflow/actions platform know to call dialogflowFirebaseFulfillment
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
