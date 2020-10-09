import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDBrYvzqm6oABVj1ygc7qM4XCH01iyca7s",
  authDomain: "pipay-cd3f3.firebaseapp.com",
  databaseURL: "https://pipay-cd3f3.firebaseio.com",
  projectId: "pipay-cd3f3",
  storageBucket: "pipay-cd3f3.appspot.com",
  messagingSenderId: "1022513402751",
  appId: "1:1022513402751:web:165730d8b61dea740c004a",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const login = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password);
};

export const register = (email, password) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
};

export const sendEmailVerification = () => {
  return getCurrentUser().sendEmailVerification();
};

export const getCurrentUser = () => {
  return firebase.auth().currentUser;
};

export const updateUserProfile = (profile) => {
  let user = getCurrentUser();
  user.updateProfile({ ...profile });
};

export const logout = () => {
  return firebase.auth().signOut();
};

export const isUserLoggedIn = () => {
  return Boolean(getCurrentUser());
};

export const onAuthStateChanged = (f) => {
  return firebase.auth().onAuthStateChanged(f);
};

export const getUserToken = () => {
  const user = firebase.auth().currentUser;
  if (!user) {
    return;
  }
  return user.getIdToken(false);
};

export const uploadImage = async (image) => {
  let imageRef = firebase
    .storage()
    .ref()
    .child(`kumunas/thumbnails/${new Date()}`);
  return imageRef.putString(image.base64);
};
