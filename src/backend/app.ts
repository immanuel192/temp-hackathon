import * as admin from 'firebase-admin';

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
