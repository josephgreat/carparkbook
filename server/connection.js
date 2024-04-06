// import { getFirestore, onSnapshots } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
// import app from "./firebase_init.js";
// import {showToast} from "../js/toast.js";

// const db = getFirestore(app);

// const connectionListener = onSnapshots(db, (snapshots) => {
//     if (snapshots.docs.length === 0) {
//         // Firestore client is offline or has no data
//         showToast({type: "error", text: "You are offline"});
//         // Handle the error or update UI accordingly
//     } 
// });

// connectionListener();
// // Don't forget to unsubscribe when the component unmounts or is no longer needed
// // connectionListener(); // Call this function to unsubscribe
