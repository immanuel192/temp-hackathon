Frontend guys: please dont touch this folder. Treat it as in separated project

# Setup
- Copy the secret key credential file to root of your project and name it as key.json
- Run the app using the command line below

```bash
# install ts-node if you need
npm install ts-node -g 
# run from your root folder
ts-node -r ts-node/register/transpile-only src/backend/app.ts
```
