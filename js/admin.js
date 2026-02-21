import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form = document.getElementById("addForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const address = document.getElementById("address").value.trim();
  const lat = parseFloat(document.getElementById("lat").value);
  const lng = parseFloat(document.getElementById("lng").value);

  if (!name || !address || isNaN(lat) || isNaN(lng)) {
    alert("সব তথ্য সঠিকভাবে দিন");
    return;
  }

  try {
    await addDoc(collection(db, "points"), {
      name,
      address,
      lat,
      lng,
      approved: true,
      createdAt: serverTimestamp()
    });

    alert("✅ Biriyani point যোগ হয়েছে");
    form.reset();
  } catch (err) {
    alert("❌ Error: " + err.message);
  }
});
