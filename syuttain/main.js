// Firebase SDK 読み込み
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Firebase 初期化
const firebaseConfig = {
  apiKey: "AIzaSyAdmlzzWz8m9Z3nqsAyQ2wx0wsbYZs8wKo",
  authDomain: "officehub-c6c1b.firebaseapp.com",
  projectId: "officehub-c6c1b",
  storageBucket: "officehub-c6c1b.firebasestorage.app",
  messagingSenderId: "281713006483",
  appId: "1:281713006483:web:dc517b215d2b54a37e7a66"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ユーザー一覧（仮）
const users = ["山田 太郎", "佐藤 花子", "鈴木 次郎"];

const nameSelect = document.getElementById("nameSelect");
const qrImage = document.getElementById("qrImage");
const actionTitle = document.getElementById("actionTitle");

// ページ読み込み時に名前リストを追加
window.addEventListener("DOMContentLoaded", () => {
  users.forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    nameSelect.appendChild(option);
  });
});

// 出勤 or 退勤ボタン押下時
window.handleAction = async function (type) {
  const name = nameSelect.value;
  if (!name) {
    alert("名前を選択してください。");
    return;
  }

  const timestamp = new Date().toISOString();
  const payload = {
    name,
    type, // "checkin" or "checkout"
    timestamp
  };

  // Firestoreへ書き込み
  await addDoc(collection(db, "attendance_logs"), {
    name: name,
    status: type === "checkin" ? "出勤" : "退勤",
    timestamp: timestamp
  });

  // LINE QR用リンク生成
  const encoded = encodeURIComponent(JSON.stringify(payload));
  const lineLink = `https://line.me/R/msg/text/?${encoded}`;
  actionTitle.textContent = type === "checkin" ? "✅ 出勤打刻QRコード" : "🕓 退勤打刻QRコード";
  const qrApi = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(lineLink)}&size=300x300`;
  qrImage.src = qrApi;
  qrImage.classList.remove("hidden");
};
