import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
  import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

  // Firebase Config
  const firebaseConfig = {
    apiKey: "AIzaSyCEf9If3R9r8F_JSXaxmtx0liqrMIODebo",
    authDomain: "office-of-student-affairs.firebaseapp.com",
    databaseURL: "https://office-of-student-affairs-default-rtdb.firebaseio.com/",
    projectId: "office-of-student-affairs",
    storageBucket: "office-of-student-affairs.appspot.com",
    messagingSenderId: "807502412285",
    appId: "1:807502412285:web:9dd217701e71750249c194",
    measurementId: "G-BZ02GD7C2Y"
  };

  // Init Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const auth = getAuth(app);

  // QR Code generation
  document.getElementById('generateBtn').addEventListener('click', () => {
    const name = document.getElementById('nameInput').value.trim();
    const id = document.getElementById('idInput').value.trim();
    const qrContainer = document.getElementById('qrcode');

    if (!name || !id) {
      alert("Please enter both Name and TUPC ID.");
      return;
    }

    const qrContent = `Name: ${name}\nTUPC ID: ${id}`;
    qrContainer.innerHTML = "";

    try {
      new QRCode(qrContainer, {
        text: qrContent,
        width: 200,
        height: 200,
        correctLevel: QRCode.CorrectLevel.H
      });
    } catch (error) {
      alert("QR Code generation failed: " + error.message);
      console.error(error);
    }
  });

  // Save to Firebase
  document.getElementById('saveBtn').addEventListener('click', () => {
    const name = document.getElementById('nameInput').value.trim();
    const id = document.getElementById('idInput').value.trim();

    if (!name || !id) {
      alert("Please enter both Name and TUPC ID.");
      return;
    }

    const qrcodeRef = ref(db, "qrcodes");
    const newEntryRef = push(qrcodeRef);

    set(newEntryRef, {
      name: name,
      tupcId: id,
      timestamp: new Date().toISOString()
    })
    .then(() => {
      alert("Successfully saved to Firebase!");
    })
    .catch((error) => {
      alert("Failed to save: " + error.message);
      console.error(error);
    });
  });