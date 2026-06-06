import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBa4TLmRRDbGe9yqg7507FgZwwZXNu8TgU',
  authDomain: 'waaw-66f26.firebaseapp.com',
  projectId: 'waaw-66f26',
  storageBucket: 'waaw-66f26.firebasestorage.app',
  messagingSenderId: '968581623760',
  appId: '1:968581623760:web:20a7d3d95bdd35ed9893d5',
  measurementId: 'G-C6HV8YRP9Q',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
