import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-storage.js";
import app from "./firebase_init.js";

const parkingSpaceName = document.getElementById("parking_space_name");
const parkingSpaceDescription = document.getElementById(
  "parking_space_description"
);
const parkingSpaceSlots = document.getElementById("parking_space_slots");
const parkingSpaceImage = document.getElementById("fileInput");
const parkingSpaceForm = document.getElementById("parking_space_form");

const storage = getStorage(app);

let parking_space_data = {
  name: "",
  description: "",
  no_of_slots: 0,
  image: null,
};

const uploadImage = async () => {
    const file = parkingSpaceImage.files[0];
    console.log(file);
    const storageRef = ref(storage, "images/" + file.name);
  

// 'file' comes from the Blob or File API
uploadBytes(storageRef, file).then((snapshot) => {
  console.log('Uploaded a blob or file!');
  snapshot.ref.getDownloadURL().then((downloadURL) => {
    console.log("File available at", downloadURL);
    parking_space_data.image = downloadURL;
    // You can use the download URL to display the image or store it in a database
  });
});
    // Upload the file to Firebase Storage
    // const uploadTask = storageRef.put(file);
  
    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    // uploadTask.on(
    //   "state_changed",
    //   (snapshot) => {
    //     // Observe state change events such as progress, pause, and resume
    //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //     console.log("Upload is " + progress + "% done");
    //   },
    //   (error) => {
    //     // Handle unsuccessful uploads
    //     console.error("Error uploading image:", error);
    //   },
    //   () => {
    //     // Handle successful uploads on complete
    //     uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
    //       console.log("File available at", downloadURL);
    //       parking_space_data.image = downloadURL;
    //       // You can use the download URL to display the image or store it in a database
    //     });
    //   }
    // );
  };
  

parkingSpaceForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  parking_space_data = {
    name: parkingSpaceName.value,
    description: parkingSpaceDescription.value,
    no_of_slots: Number(parkingSpaceSlots.value),
  };
await uploadImage();
  console.log(parking_space_data);
});
