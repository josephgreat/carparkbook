import {
  doc,
  getDoc,
  updateDoc,
  getFirestore,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import app from "./firebase_init.js";
import { uploadImageToFirebaseStorage } from "./uploadImage.js";
import showToast from "../js/toast.js";

const parkingSpaceNameEdit = document.getElementById("parking_space_name");
const parkingSpaceDescriptionEdit = document.getElementById(
  "parking_space_description"
);
const parkingSpaceSlotsEdit = document.getElementById("parking_space_slots");
const parkingSpaceImageEdit = document.getElementById("fileInput");
const parkingSpaceFormEdit = document.getElementById("parking_space_form");
const parkingSpaceImagePreviewEdit = document.getElementById(
  "parking_space_image_preview"
);
const editParkingSpaceBtn = document.getElementById("edit_parking_space_btn");
const uploadEditProgress = document.getElementById("upload_progress");

const db = getFirestore(app);
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const parkingSpaceRef = doc(db, "parking_space", id);
let initialData = {};
const getParkingSpace = async () => {
  const parkingSpace = await getDoc(parkingSpaceRef);
  initialData = parkingSpace.data();
  let { name, description, no_of_slots, image } = parkingSpace.data();

  parkingSpaceDescriptionEdit.value = description;
  parkingSpaceImagePreviewEdit.style.background = `url("${image}") no-repeat center center`;
  parkingSpaceImagePreviewEdit.style.backgroundSize = `contain`;
  parkingSpaceSlotsEdit.value = no_of_slots;
  parkingSpaceNameEdit.value = name;
};

let imageFile;
const getImage = (e) => {
  imageFile = e.target.files[0];
  console.log(imageFile);
  if (imageFile) {
    const reader = new FileReader();
    reader.onload = (e) => {
      parkingSpaceImagePreviewEdit.style.background = `url("${e.target.result}") no-repeat center center`;
      parkingSpaceImagePreviewEdit.style.backgroundSize = `contain`;
    };
    reader.readAsDataURL(imageFile);
  }
};

const compareValues = (oldValue, newValue) => {
  if (oldValue !== newValue) return true;
  return false;
};

const submitEditedForm = async (e) => {
  e.preventDefault();
  editParkingSpaceBtn.innerHTML = "Editing parking space...";
  editParkingSpaceBtn.disabled = true;

  let editedData = {};
  if (compareValues(initialData.name, parkingSpaceNameEdit.value)) {
    editedData.name = parkingSpaceNameEdit.value;
  }

  if (
    compareValues(initialData.description, parkingSpaceDescriptionEdit.value)
  ) {
    editedData.description = parkingSpaceDescriptionEdit.value;
  }

  if (
    compareValues(
      Number(initialData.no_of_slots),
      Number(parkingSpaceSlotsEdit.value)
    )
  ) {
    editedData.no_of_slots = parkingSpaceSlotsEdit.value;
  }
  if (imageFile)
    editedData.image = uploadImageToFirebaseStorage(uploadEditProgress, imageFile);

  await updateDoc(parkingSpaceRef, editedData);

  showToast({
    type: "success",
    text: `You have successfully edited ${editedData.name || initialData.name} parking space`,
  });

  setTimeout(() => {
    location.pathname = "/admin/parkings.html";
  }, 3000);
};

parkingSpaceImageEdit.addEventListener("change", getImage);
parkingSpaceFormEdit.addEventListener("submit", submitEditedForm);

getParkingSpace();
