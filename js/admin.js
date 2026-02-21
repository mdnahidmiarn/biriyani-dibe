import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const reportsDiv = document.getElementById("reports");

async function loadReports() {
  reportsDiv.innerHTML = "Loading...";

  const q = query(
    collection(db, "reports"),
    orderBy("time", "desc")
  );

  const snap = await getDocs(q);
  reportsDiv.innerHTML = "";

  snap.forEach((r) => {
    const d = r.data();

    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <b>Point ID:</b> ${d.pointId}<br>
      <b>Reason:</b> ${d.reason}<br><br>
      <button onclick="deleteReport('${r.id}')">🗑 Delete</button>
    `;
    reportsDiv.appendChild(div);
  });
}

window.deleteReport = async function (id) {
  if (!confirm("Delete report?")) return;
  await deleteDoc(doc(db, "reports", id));
  loadReports();
};

loadReports();
