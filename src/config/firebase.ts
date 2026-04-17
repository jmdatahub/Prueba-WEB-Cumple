import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAXCxr22MWhfW4GB6kXaEnALE26fUzcMJU",
  authDomain: "cumple-jorge-kahoot.firebaseapp.com",
  projectId: "cumple-jorge-kahoot",
  storageBucket: "cumple-jorge-kahoot.firebasestorage.app",
  messagingSenderId: "245109758550",
  appId: "1:245109758550:web:0dc8f84e06ec74c09639f7",
  // ⚠️  Copia aquí la URL de tu Realtime Database.
  // La encuentras en Firebase Console > Realtime Database > datos
  // Formato: https://cumple-jorge-kahoot-default-rtdb.europe-west1.firebasedatabase.app
  databaseURL: "https://cumple-jorge-kahoot-default-rtdb.europe-west1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
