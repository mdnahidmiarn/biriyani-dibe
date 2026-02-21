import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const loginBox = document.getElementById("loginBox");
const panel = document.getElementById("panel");

window.login = async () => {
  const email = email.value;
  const password = password.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    alert("❌ Login failed");
  }
};

window.logout = async () => {
  await signOut(auth);
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBox.style.display = "none";
    panel.style.display = "block";
  } else {
    loginBox.style.display = "block";
    panel.style.display = "none";
  }
});

window.addPoint = async () => {
  await addDoc(collection(db, "points"), {
    name: name.value,
    address: address.value,
    lat: parseFloat(lat.value),
    lng: parseFloat(lng.value),
    approved: true,
    createdAt: serverTimestamp()
  });

  alert("✅ Biriyani Point Added");
};
