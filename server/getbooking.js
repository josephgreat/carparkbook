import {
  collection,
  getDocs,
  getFirestore,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import app from "./firebase_init.js";
import showToast from "../js/toast.js";

// DOM elements
const bookedSpaceTable = document.querySelector(".booked_spaces");
const usersTable = document.querySelector(".users_table");
const table = document.querySelector(".table");
const loadingNode = document.querySelector(".loading_container");

// Firestore setup
const db = getFirestore(app);
let all_booked_space = [];

// Functions to fetch and update UI
const getAllBookedSpace = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "booked_space"));
    querySnapshot.forEach((booked_space) => {
      all_booked_space.push(booked_space.data());
    });
  } catch (error) {
    console.log(error);
    showToast({ type: "error", text: error.message });
  }

  updateUI();
};

const parkingStatus = (start_date, end_date) => {
  console.log(new Date());
  if (new Date() - new Date(start_date) >= 0) return "Activated";
  else if (new Date() - new Date(start_date) < 0) return "Pending";
  else if (new Date() - new Date(end_date) > 0) return "Deactivated";
};

const updateUI = () => {
  bookedSpaceTable && updateBookedSpaceUI();
  usersTable && updateUsersUI();
};

const updateBookedSpaceUI = () => {
  if (all_booked_space.length === 0) {
    table.style.minHeight = "20rem";
    bookedSpaceTable.innerHTML =
      "<p class='no_space_text'>No parking space available</p>";
  } else {
    bookedSpaceTable.innerHTML = "";
    table.style.minHeight = "unset";
    all_booked_space.forEach((data) => {
      const {
        selected_parking_space,
        customer_name,
        customer_phone_number,
        parking_start_date,
        parking_end_date,
        parking_time,
        parking_slot_number,
        order_number,
      } = data;

      bookedSpaceTable.insertAdjacentHTML(
        "beforeend",
        `<tr>
              <td scope="col">${order_number}</td>
              <td scope="col" class="status_${parkingStatus(
                parking_start_date,
                parking_end_date
              ).toLowerCase()}">${parkingStatus(
          parking_start_date,
          parking_end_date
        )}</td>
              <td scope="col">${customer_name}</th>
              <td scope="col">${selected_parking_space}</td>
              <td scope="col">SPACE DETAILS</td>
              <td scope="col">${parking_time}</td>
              <td scope="col">${parking_start_date}</td>
              <td scope="col">${parking_end_date}</td>
          </tr>`
      );
    });
    loadingNode.style.display = "none";
  }
};

const updateUsersUI = () => {
  if (all_booked_space.length === 0) {
    table.style.minHeight = "20rem";
    usersTable.innerHTML =
      "<p class='no_space_text'>No parking space available</p>";
  } else {
    usersTable.innerHTML = "";
    table.style.minHeight = "unset";

    const uniqueUsers = all_booked_space.filter(
      (obj, index, self) =>
        index === self.findIndex((o) => o.customer_name === obj.customer_name)
    );

    uniqueUsers.forEach((data, index) => {
      const { customer_name, customer_phone_number } = data;
      const customer_full_name = customer_name.split(" ");

      usersTable.insertAdjacentHTML(
        "beforeend",
        `<tr>
              <td scope="col">${index + 1}</td>
              <td scope="col">${customer_full_name[0]}</td>
              <td scope="col">${customer_full_name[1] ?? "-"}</td>
              <td scope="col">${customer_phone_number}</td>
            </tr>`
      );
    });
    loadingNode.style.display = "none";
  }
};

// Initialize
getAllBookedSpace();
