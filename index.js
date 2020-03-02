"use strict";
const { dialogflow } = require("actions-on-google");
const functions = require("firebase-functions");

const app = dialogflow({ debug: true });

app.intent("Check Weight", (conv, {}) => {
  //ask|reponse|close
  return conv.close("if you have to ask your too fat");
});

app.intent("Add Weight", (conv, { weight }) => {
  console.log("zzzzzzzzzzzzzzzz");
  console.log(weight);
  return conv.close(`let's round it up to ${weight.amount + 1}, fatass`);
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
