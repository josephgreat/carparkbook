import {
  collection,
  addDoc,
  getFirestore,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import app from "./firebase_init.js";
import showToast from "../js/toast.js";
import { uploadImageToFirebaseStorage } from "./uploadImage.js";

const parkingSpaceName = document.getElementById("parking_space_name");
const parkingSpaceDescription = document.getElementById(
  "parking_space_description"
);
const parkingSpaceSlots = document.getElementById("parking_space_slots");
const parkingSpaceImage = document.getElementById("fileInput");
const parkingSpaceForm = document.getElementById("parking_space_form");
const parkingSpaceImagePreview = document.getElementById(
  "parking_space_image_preview"
);
const addParkingSpaceBtn = document.getElementById("add_parking_space_btn");
const uploadProgress = document.getElementById("upload_progress");

const db = getFirestore(app);

let parking_space_data = {
  name: "",
  description: "",
  no_of_slots: 0,
  no_of_taken_slots: 0,
  image: null,
};

let imageFile;
const getImage = (e) => {
  imageFile = e.target.files[0];
  console.log(imageFile);
  if (imageFile) {
    const reader = new FileReader();
    reader.onload = (e) => {
      parkingSpaceImagePreview.style.background = `url("${e.target.result}") no-repeat center center`;
      parkingSpaceImagePreview.style.backgroundSize = `contain`;
    };
    reader.readAsDataURL(imageFile);
  }
};



parkingSpaceImage.addEventListener("change", getImage);

parkingSpaceForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  addParkingSpaceBtn.innerHTML = "Adding parking space...";
  addParkingSpaceBtn.disabled = true;
  try {
    const imageUrl = await uploadImageToFirebaseStorage(uploadProgress, imageFile);
    parking_space_data = {
      ...parking_space_data,
      name: parkingSpaceName.value,
      description: parkingSpaceDescription.value,
      no_of_slots: Number(parkingSpaceSlots.value),
      image: imageUrl,
    };

    const docRef = await addDoc(
      collection(db, "parking_space"),
      parking_space_data
    );

    if (docRef) {
      showToast({ type: "success", text: "New Parking Space Added" });

      setTimeout(() => {
        location.pathname = "/admin/parkings.html";
      }, 3000);
    }
 
  } catch (error) {
    console.error("Error:", error);
    addParkingSpaceBtn.disabled = true;
  }
});
