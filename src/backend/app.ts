import * as admin from 'firebase-admin';
import { config } from 'aws-sdk'
import AWSComprehend from "./services/comprehend";

config.update({ region: 'eu-west-1' }); // Whatever region for now.

const serviceAccount = "key.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dev-sentiminder.firebaseio.com",
});

const db = admin.firestore();

Promise.resolve()
  .then(async () => {
    const data = await db.collection('channels').get();
    data.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
    });
  });
