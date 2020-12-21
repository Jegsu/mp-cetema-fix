import * as firebase from "firebase";
import * as geofirestore from "geofirestore";
import 'firebase/firestore';

var firebaseConfig = {
    apiKey: "AIzaSyCplGGD84zSO856fyNda_BbcHW234cL7-0",
    authDomain: "boatapp-fa13e.firebaseapp.com",
    projectId: "boatapp-fa13e",
    storageBucket: "boatapp-fa13e.appspot.com",
    messagingSenderId: "595854987749",
    appId: "1:595854987749:web:07aae110e9ebd86e2e1f0c"
  }
  
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const firestore = firebase.firestore()

  export const GeoFirestore = geofirestore.initializeApp(firestore);
  