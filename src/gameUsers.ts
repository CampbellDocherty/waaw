import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  runTransaction,
} from 'firebase/firestore';
import { db } from './firebase';

export type GameUser = {
  id: string;
  name: string;
  length: number;
  colour: string;
  score?: number;
  points: number;
};

export type StoredGameUser = GameUser & {
  firebaseId: string;
  score: number;
};

export const saveUser = async (user: GameUser) => {
  const userRef = doc(db, 'users', user.id);

  await runTransaction(db, async (transaction) => {
    const existingUser = await transaction.get(userRef);
    const existingScore = existingUser.exists()
      ? (existingUser.data().score as number | undefined) ?? 0
      : 0;
    const score = Math.max(existingScore, user.score ?? 0);

    transaction.set(userRef, {
      id: user.id,
      name: user.name,
      length: user.length,
      colour: user.colour,
      score,
      points: user.points,
    });
  });
};

export const getUsers = async (): Promise<StoredGameUser[]> => {
  const usersQuery = query(collection(db, 'users'), orderBy('score', 'desc'));
  const snapshot = await getDocs(usersQuery);

  return snapshot.docs.map((doc) => {
    const data = doc.data() as GameUser;

    return {
      firebaseId: doc.id,
      ...data,
      score: data.score ?? 0,
    };
  });
};
