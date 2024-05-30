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
const parkingSpaceImageContainer = document.querySelector(
  ".parking_space_image_container"
);

const db = getFirestore(app);
let all_parking_space = [];
let parking_space_to_be_edited = {};

const getAllParkingSpace = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "parking_space"));
    querySnapshot.forEach((parking_space) => {
      all_parking_space.push({
        id: parking_space.id,
        data: parking_space.data(),
      });
    });
  } catch (error) {
    console.log(error);
    showToast({ type: "error", text: error.message });
  }

  parkingSpaceTable && updateParkingSpaceUI();
  parkingSpaceImageContainer && updateDashboardUI();
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

const editParkingSpace = (index) => {
  const id = encodeURIComponent(all_parking_space[index].id);
  location.href = `/admin/edit-parking.html?id=${id}`;
};

const updateParkingSpaceUI = () => {
  if (all_parking_space.length === 0) {
    table.style.minHeight = "20rem";

    parkingSpaceTable.innerHTML =
      "<p class='no_space_text'>No parking space available</p>";
  } else {
    parkingSpaceTable.innerHTML = "";
    table.style.minHeight = "unset";
    all_parking_space.forEach(({ data }) => {
      let slot_difference = data.no_of_slots - data.no_of_taken_slots;
      parkingSpaceTable.insertAdjacentHTML(
        "beforeend",
        `<tr class="parking_space_row">
          <td class="tm-product-name col-4">${data.name}</td>
          <td class="col-3">${data.no_of_slots}</td>
          <td class="col-3">${slot_difference}</td>
          <td class="col-3">${slot_difference > 0 ? "Yes" : "No"}</td>
          <td class="col-1 icons">
            <i class="far fa-edit tm-product-edit-icon edit_icon"></i>
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

    const editIcons = document.querySelectorAll(".edit_icon");
    editIcons.forEach((editIcon, index) =>
      editIcon.addEventListener("click", () => editParkingSpace(index))
    );
  }

  loadingNode.style.display = "none";
};

const updateDashboardUI = () => {
  console.log("Dashboard");
  all_parking_space.map(({ data }) => {
    // <img src="${data.image}" alt="${data.name}" class="img-responsive parking_space_img">x
    parkingSpaceImageContainer.insertAdjacentHTML(
      "afterbegin",
      `
    <div class="col-lg-3 col-md-5 col-sm-8 parking_space_card">
    <div class="parking_space_img" style="background-image: url('${data.image}')"></div>
    <div class="parking_space_details">
      <h4 class="parking_space_title">${data.name}</h4>
      <p class="parking_space_description">${data.description}</p>
    </div>
    </div>`
    );
  });
  loadingNode.style.display = "none";
};

getAllParkingSpace();
