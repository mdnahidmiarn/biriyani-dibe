// js/map.js

import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ================= MAP INIT =================
let map = L.map("map").setView([23.8103, 90.4125], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

let userMarker = null;

// ================= USER LOCATION =================
window.getMyLocation = function () {
  if (!navigator.geolocation) {
    alert("Geolocation সাপোর্ট করে না");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      if (userMarker) map.removeLayer(userMarker);

      userMarker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup("📍 আপনি এখানে আছেন")
        .openPopup();

      map.setView([lat, lng], 15);
    },
    () => alert("লোকেশন পাওয়া যায়নি")
  );
};

// ================= LOAD BIRIYANI POINTS =================
async function loadPoints() {
  const snap = await getDocs(collection(db, "points"));

  snap.forEach((doc) => {
    const data = doc.data();

    const marker = L.marker([data.lat, data.lng]).addTo(map);

    marker.bindPopup(`
      <b>🍛 ${data.name}</b><br>
      এলাকা: ${data.area}<br><br>
      <button onclick="reportPoint('${doc.id}')">
        🚩 Report
      </button>
    `);
  });
}

loadPoints();

// ================= REPORT FUNCTION =================
window.reportPoint = async function (pointId) {
  const reason = prompt("রিপোর্ট কারণ লিখুন:");

  if (!reason) return;

  await addDoc(collection(db, "reports"), {
    pointId: pointId,
    reason: reason,
    time: serverTimestamp()
  });

  alert("✅ রিপোর্ট পাঠানো হয়েছে");
};
