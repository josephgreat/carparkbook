import {
  collection,
  getDocs,
  getFirestore,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import app from "./firebase_init.js";
import showToast from "../js/toast.js";

const parkingSpaceTable = document.getElementById("parking_space_table");
const table = document.querySelector(".table");
const loadingNode = document.querySelector(".loading_container");

const db = getFirestore(app);
let all_parking_space = [];

const getAllParkingSpace = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "parking_space"));
    querySnapshot.forEach((parking_space) => {
      let { no_of_slots, name } = parking_space.data();
      all_parking_space.push({
        id: parking_space.id,
        data: parking_space.data(),
      });
    });
  } catch (error) {
    console.log(error);
    showToast({ type: "error", text: error.message });
  }

  updateParkingSpaceUI();
};

const deleteParkingSpace = async (index) => {
  try {
    await deleteDoc(doc(db, "parking_space", all_parking_space[index].id));
    let deletedSpace = all_parking_space.splice(index, 1);
    updateParkingSpaceUI();
    showToast({
      type: "success",
      text: `${deletedSpace[0].data.name} parking space has been deleted`,
    });
  } catch (error) {
    console.error("Error deleting parking space:", error);
    showToast({ type: "error", text: "Error deleting parking space" });
  }
};

const updateParkingSpaceUI = () => {
  if (all_parking_space.length === 0) {
    parkingSpaceTable.innerHTML = "<p class='no_parking_space_text'>No parking space available</p>";
  } else {
    parkingSpaceTable.innerHTML = "";
    table.style.minHeight = "unset";
    all_parking_space.forEach(({ data }) => {
      let slot_difference = data.no_of_slots - data.no_of_taken_slots;
      parkingSpaceTable.insertAdjacentHTML(
        "beforeend",
        `<tr>
          <td class="tm-product-name col-5">${data.name}</td>
          <td class="col-3">${slot_difference}</td>
          <td class="col-3">${slot_difference > 0 ? "Yes" : "No"}</td>
          <td class="col-1">
            <i class="far fa-trash-alt tm-product-delete-icon delete_icon"></i>
          </td>
        </tr>`
      );
    });

    // Add event listener to each delete icon
    const deleteIcons = document.querySelectorAll(".delete_icon");
    deleteIcons.forEach((deleteIcon, index) => {
      deleteIcon.addEventListener("click", () => deleteParkingSpace(index));
    });
  }

  loadingNode.style.display = "none";
};

getAllParkingSpace();