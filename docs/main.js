import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reportForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const place = document.getElementById("place").value;
    const notes = document.getElementById("notes").value;
    const file = document.getElementById("image").files[0];

    let imageUrl = "";
    if (file) {
      const storageRef = ref(storage, `reports/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, "reports"), {
      place,
      notes,
      imageUrl,
      timestamp: serverTimestamp()
    });

    alert("営業報告が送信されました");
    form.reset();
  });
});
