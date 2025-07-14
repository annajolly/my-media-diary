import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'my-media-diary-auth.firebaseapp.com',
  projectId: 'my-media-diary-auth',
  storageBucket: 'my-media-diary-auth.firebasestorage.app',
  messagingSenderId: '786847608119',
  appId: '1:786847608119:web:0e8a679e87c3002ebf7eb2',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const createUserWithEmailAndPassword = (email, password) => {
  return firebaseCreateUserWithEmailAndPassword(auth, email, password);
};

const signInWithEmailAndPassword = (email, password) => {
  return firebaseSignInWithEmailAndPassword(auth, email, password);
};

const onAuthStateChanged = (callback) => {
  return firebaseOnAuthStateChanged(auth, callback);
};

const signout = () => {
  return firebaseSignOut(auth);
};

const getUserBooks = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const booksRef = collection(db, `users/${user.uid}/books`);
  const querySnapshot = await getDocs(booksRef);

  const books = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return books;
};

const addBookToUser = async (bookData) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const booksRef = collection(db, 'users', user.uid, 'books');
  await addDoc(booksRef, bookData);
};

const deleteUserBook = async (bookId) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const bookRef = doc(db, `users/${user.uid}/books/${bookId}`);
  await deleteDoc(bookRef);
};

const addMovieToUser = async (movieData) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const moviesRef = collection(db, 'users', user.uid, 'movies');
  await addDoc(moviesRef, movieData)
    .then((docRef) => {
      console.log('Document written with ID: ', docRef.id);
    })
    .catch((error) => {
      console.error('Error adding document: ', error);
    });
};

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signout,
  getUserBooks,
  addBookToUser,
  deleteUserBook,
  addMovieToUser,
};
