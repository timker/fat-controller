"use strict";

import { https } from "firebase-functions";

import { dialogflow } from "actions-on-google";
import { google, sheets_v4 } from "googleapis";

// what does  debug: true mean?
const app = dialogflow({ debug: true });

app.intent("Check Weight", async (conversation, {}) => {
  //ask|response|close

  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });
  const sheetsAPI = google.sheets({ version: "v4", auth });
  let currentWeight = await GetWeight(sheetsAPI);

  return conversation.close(
    `Your latest weight is ${currentWeight}kg`
    //`Your latest weight is <say-as interpret-as="measure">${currentWeight}kg</say-as>`
  );
});

async function GetWeight(sheetsApi: sheets_v4.Sheets) {
  let response = await sheetsApi.spreadsheets.values.get({
    spreadsheetId,
    range: "Configuration!B1"
  });

  console.log(response);

  // todo: dodgy !
  return response.data.values![0][0];
}

// todo find definition of
app.intent("Add Weight", async (conversation, input: { weight: number }) => {
  //console.log(input);
  console.log("weightzzzz");
  console.log(typeof input.weight);
  //console.log(input.weight + 5);
  await AddWeight(input.weight);
  return conversation.close(`let's round it up to ${input.weight + 2}`);
});

async function AddWeight(weight: number): Promise<any> {
  // https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append
  const utcDate = new Date()
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "");
  const row = [utcDate, weight];

  // online documentation is a bit confused between resource and requestBody
  var resource = {
    majorDimension: "ROWS",
    values: [row]
  };

  const request: sheets_v4.Params$Resource$Spreadsheets$Values$Append = {
    spreadsheetId,
    range: "Data!A:B", // this is the sheet name
    valueInputOption: "USER_ENTERED", //  this will format the date correctly https://developers.google.com/sheets/api/reference/rest/v4/ValueInputOption
    insertDataOption: "INSERT_ROWS",
    requestBody: resource

    //responseDateTimeRenderOption:"FORMATTED_STRING"
  };

  const sheets = await AuthenticateSheets();

  return sheets.spreadsheets.values.append(request);
}

async function AuthenticateSheets(): Promise<sheets_v4.Sheets> {
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });
  return google.sheets({ version: "v4", auth });
}

// how does Dialogflow/actions platform know to call dialogflowFirebaseFulfillment
exports.dialogflowFirebaseFulfillment = https.onRequest(app);

export const helloWorld = https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

