# prerequisite's

- nodejs

- typescript

- firebase tools

```
npm install -g firebase-tools
```

# set up

- Create firebase project (production and staging are set up in npm run scripts)

- Create Environments to Project configuration

```
firebase use --add
```

-set project configuration
set config

```
firebase functions:config:set spreadsheet.id="mysheetid"
```

- Give sheet access the service account email

# commands

- Note! Working folder is /functions

- `npm run build`
- `npm run serve`
- `npm run deploy:production`
- `npm run deploy:staging`
- `firebase projects:list`
- `firebase use --add`
- `firebase use {environmentName}`

# deploy

- cli: `firebase deploy --only functions`

- manual: copy ./functions/lib/index.js to fulfillment text area, and insure ./functions/package.json is up to date

# run locally

```
 firebase serve --only functions
```

# test

Deploy and find function in gcp
add example payload in /tests/payloads/\*.json to the testing function

