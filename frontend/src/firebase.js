import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTKtB-wFGtBd9cowwWQrprR4D6JKAmjok",
  authDomain: "crm-total-4a4d5.firebaseapp.com",
  databaseURL: "https://crm-total-4a4d5-default-rtdb.firebaseio.com",
  projectId: "crm-total-4a4d5",
  storageBucket: "crm-total-4a4d5.firebasestorage.app",
  messagingSenderId: "1090960597680",
  appId: "1:1090960597680:web:88fe7096c0aa5e0ba05175"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export default app;
