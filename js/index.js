// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCEf9If3R9r8F_JSXaxmtx0liqrMIODebo",
  authDomain: "office-of-student-affairs.firebaseapp.com",
  databaseURL: "https://office-of-student-affairs-default-rtdb.firebaseio.com/",
  projectId: "office-of-student-affairs",
  storageBucket: "office-of-student-affairs.appspot.com",
  messagingSenderId: "807502412285",
  appId: "1:807502412285:web:9dd217701e71750249c194"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// QR Scanner
const html5QrCode = new Html5Qrcode("reader");

function onScanSuccess(decodedText, decodedResult) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerText = `✅ Scanned: ${decodedText}`;
  html5QrCode.stop();

  // Extract TUPC ID
  const match = decodedText.match(/TUPC ID:\s*(\d+)/);
  if (!match) {
    resultDiv.innerText += "\n❌ Invalid QR Code format. TUPC ID not found.";
    return;
  }

  const tupcId = match[1];

  // Find and delete matching record in Firebase
  const qrcodesRef = db.ref("qrcodes");
  qrcodesRef.orderByChild("tupcId").equalTo(tupcId).once("value", snapshot => {
    if (snapshot.exists()) {
      snapshot.forEach(childSnap => {
        qrcodesRef.child(childSnap.key).remove()
          .then(() => {
            resultDiv.innerText += `\n✅ Deleted record with TUPC ID: ${tupcId}`;
          })
          .catch(error => {
            resultDiv.innerText += `\n❌ Error deleting: ${error.message}`;
          });
      });
    } else {
      resultDiv.innerText += `\n❌ No record found for TUPC ID: ${tupcId}`;
    }
  });
}

// Start the scanner
Html5Qrcode.getCameras().then(cameras => {
  if (cameras && cameras.length) {
    html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      },
      onScanSuccess
    ).catch(err => {
      document.getElementById("result").innerText = `Camera error: ${err}`;
    });
  } else {
    document.getElementById("result").innerText = "❌ No cameras found.";
  }
}).catch(err => {
  document.getElementById("result").innerText = `Camera init error: ${err}`;
});
