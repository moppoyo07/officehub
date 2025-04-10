// Firebase SDK v9 モジュラー構文
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyBnpCj87JaFn71iDSsM8NDO2WhoXFc9wFY",
  authDomain: "officehub-cb84d.firebaseapp.com",
  projectId: "officehub-cb84d",
  storageBucket: "officehub-cb84d.appspot.com",
  messagingSenderId: "741568053402",
  appId: "1:741568053402:web:a3ad61eb4d31f3dbaf5f23"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOMが読み込まれてからイベント登録
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("attendanceForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("username").value;
    const type = "出勤"; // 今は出勤のみ想定（将来的に「退勤」などにも対応可）

    if (!name) {
      alert("名前を選択してください");
      return;
    }

    try {
      await addDoc(collection(db, "attendances"), {
        name,
        type,
        timestamp: serverTimestamp()
      });

      alert(`${name} さんの出勤を記録しました`);
      form.reset();
    } catch (error) {
      console.error("出勤記録エラー:", error);
      alert("出勤記録に失敗しました");
    }
  });
});
