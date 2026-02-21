import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let map;
let userLat, userLng;
let markers = [];

map = L.map("map").setView([23.8103, 90.4125], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

// distance calculation (km)
function distance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

window.getMyLocation = () => {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    userLat = pos.coords.latitude;
    userLng = pos.coords.longitude;

    map.setView([userLat, userLng], 14);

    L.marker([userLat, userLng])
      .addTo(map)
      .bindPopup("📍 আপনি এখানে")
      .openPopup();

    loadNearbyPoints();
  });
};

async function loadNearbyPoints() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  const q = query(
    collection(db, "points"),
    where("approved", "==", true)
  );

  const snap = await getDocs(q);

  snap.forEach((doc) => {
    const d = doc.data();
    const km = distance(userLat, userLng, d.lat, d.lng);

    if (km <= 5) {
      const m = L.marker([d.lat, d.lng])
        .addTo(map)
        .bindPopup(`🍛 ${d.name}<br>${d.address}<br>${km.toFixed(2)} km`);

      markers.push(m);

      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <b>${d.name}</b><br>
        ${d.address}<br>
        📏 ${km.toFixed(2)} km দূরে
      `;
      list.appendChild(div);
    }
  });
}
