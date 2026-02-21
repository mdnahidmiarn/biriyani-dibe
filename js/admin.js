import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ---------- AUTH ----------
const loginBox = document.getElementById("loginBox");
const panel = document.getElementById("panel");
const reportsDiv = document.getElementById("reports");

window.login = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch {
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
    loadReports();
  } else {
    loginBox.style.display = "block";
    panel.style.display = "none";
  }
});

// ---------- REPORTS ----------
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
      <button onclick="approvePoint('${d.pointId}', '${r.id}')">✅ Approve (Hide Point)</button>
      <button onclick="deleteReport('${r.id}')">🗑 Delete Report</button>
    `;
    reportsDiv.appendChild(div);
  });
}

window.deleteReport = async (reportId) => {
  if (!confirm("Delete this report?")) return;
  await deleteDoc(doc(db, "reports", reportId));
  loadReports();
};

window.approvePoint = async (pointId, reportId) => {
  if (!confirm("এই point টা hide করবেন?")) return;

  // Hide point
  await updateDoc(doc(db, "points", pointId), {
    approved: false
  });

  // Remove report
  await deleteDoc(doc(db, "reports", reportId));

  alert("✅ Point hidden & report resolved");
  loadReports();
};
