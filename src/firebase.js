import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


//main wallet wise
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const mapBoxToken = 'pk.eyJ1Ijoic3BlY2NjY2MiLCJhIjoiY2xuYWNmdTYxMDIycjJpcDF3cGRya3NmZSJ9.mAXVfy5YizpJb3o_3eqqMQ';

export { auth, db, storage, collection, getDocs, mapBoxToken  };