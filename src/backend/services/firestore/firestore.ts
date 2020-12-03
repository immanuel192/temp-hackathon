import * as admin from 'firebase-admin';
import { Firestore } from '@google-cloud/firestore';

import { IFireStore } from './interface';

const serviceAccount = "key.json";

export class FireStore implements IFireStore {
  private db: Firestore

  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://dev-sentiminder.firebaseio.com",
    });

    this.db = admin.firestore();
  }
}

// Promise.resolve()
//   .then(async () => {
//     const data = await db.collection('channels').get();
//     data.forEach((doc) => {
//       console.log(doc.id, '=>', doc.data());
//     });
//   });
