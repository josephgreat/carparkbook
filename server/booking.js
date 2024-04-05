import {
  collection,
  getDocs,
  getFirestore,
  addDoc,
  updateDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
// import * as qrcode from 'https://cdn.jsdelivr.net/npm/qrcode@1.4.4';

import app from "./firebase_init.js";
import showToast from "../js/toast.js";

const parkingSpace = document.querySelector("#parking_space");
const customerName = document.querySelector("#customer_name");
const customerPhoneNumber = document.querySelector("#customer_phone_number");
const parkingStartDate = document.querySelector("#parking_start_date");
const parkingEndDate = document.querySelector("#parking_end_date");
const parkingTime = document.querySelector("#parking_time");
const bookingForm = document.querySelector("#booking_form");
const submitBookingBtn = document.querySelector("#submit_booking_btn");
const closeBtn = document.querySelector(".close_btn");
const qrcodeContainer = document.querySelector(".qr-code-container");
const qrcodeElement = document.querySelector(".qr-code");

const db = getFirestore(app);
let available_parking_space = [];

let booking_data = {
  selected_parking_space: "",
  customer_name: "",
  customer_phone_number: "",
  parking_start_date: "",
  parking_end_date: "",
  parking_time: "",
  parking_slot_number: 0,
  order_number: "",
};

const getAvailableParkingSpace = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "parking_space"));
    querySnapshot.forEach((parking_space) => {
      let { no_of_slots, no_of_taken_slots, name } = parking_space.data();
      if (no_of_slots - no_of_taken_slots > 0) {
        available_parking_space.push({
          name,
          no_of_slots,
          no_of_taken_slots,
          id: parking_space.id,
        });
        let optionNode = document.createElement("option");
        optionNode.setAttribute("value", name);
        optionNode.innerHTML = name;
        parkingSpace.appendChild(optionNode);
      }
    });
  } catch (error) {
    console.log(error);
    showToast({ type: "error", text: error.message });
  }
};

getAvailableParkingSpace();

const dateIsValid = () => {
    console.log(parkingStartDate.value)
  if (new Date() - new Date(parkingStartDate.value) > 0) {
    console.log("Start date must be greater than or equal to the current date");
    showToast({
      type: "error",
      text: "Start date must be greater than or equal to the current date",
    });
    return false;
  } else if (
    new Date(parkingEndDate.value) - new Date(parkingStartDate.value) <
    0
  ) {
    showToast({
      type: "error",
      text: "End date must be greater than or equal to the start date",
    });
    return false;
  }
  return true;
};

function addLeadingZeros(number, length) {
  let strNumber = String(number);
  while (strNumber.length < length) {
    strNumber = "0" + strNumber;
  }
  return strNumber;
}

const getParkingSlot = () => {
  let parking_slot_number = 0;
  let order_number = "";
  let parking_space_id;
  available_parking_space.map(({ name, id, no_of_taken_slots }) => {
    if (name === parkingSpace.value) {
      parking_slot_number = no_of_taken_slots + 1;
      if (name.includes(" ")) {
        let splitted_name = name.split(" ");
        order_number =
          splitted_name[0].substr(0,2).toUpperCase() +
          splitted_name[1].substr(0,3).toUpperCase() + "-" +
          addLeadingZeros(parking_slot_number, 2);
      } else {
        order_number =
          name.substr(0,3).toUpperCase() + "-"
          addLeadingZeros(parking_slot_number, 2);
      }

      parking_space_id = id;
    }
  });
  return { parking_slot_number, order_number, parking_space_id };
};

const generateQRCode = async (data) => {
  // Create QR code image element
  let qrcodeImg = document.createElement("img");
  qrcodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    JSON.stringify(data)
  )}`;
  qrcodeElement.appendChild(qrcodeImg);

  // Fetch the image and create download link
  let response = await fetch(qrcodeImg.src);
  let blob = await response.blob();
  let tUrl = URL.createObjectURL(blob);
  let extension = extFn(qrcodeImg.src);
  let download_link = document.createElement("a");
  download_link.setAttribute("download", `qr_code.${extension}`);
  download_link.setAttribute("href", tUrl);
  download_link.innerText = "Download";

  // Append download link
  qrcodeElement.appendChild(download_link);
  qrcodeContainer.style.visibility = "visible";
};

// Function to extract file extension from URL
function extFn(url) {
  const match = url.match(/\.[0-9a-z]+$/i);
  return match ? match[0].slice(1) : "";
}

const uploadBooking = async () => {
  if (dateIsValid()) {
    submitBookingBtn.innerHTML = "Submitting...";
    submitBookingBtn.disabled = true;

    booking_data = {
      selected_parking_space: parkingSpace.value,
      customer_name: customerName.value,
      customer_phone_number: customerPhoneNumber.value,
      parking_end_date: parkingEndDate.value,
      parking_start_date: parkingStartDate.value,
      parking_time: parkingTime.value,
      parking_slot_number: getParkingSlot().parking_slot_number,
      order_number: getParkingSlot().order_number,
    };

    let parking_space_id = getParkingSlot().parking_space_id;
    const parkingSpaceRef = doc(db, "parking_space", parking_space_id);
    await updateDoc(parkingSpaceRef, {
      no_of_taken_slots: getParkingSlot().parking_slot_number,
    });

    const docRef = await addDoc(collection(db, "booked_space"), booking_data);
    generateQRCode(booking_data);

    submitBookingBtn.innerHTML = "Submitted";
    submitBookingBtn.style.backgroundColor = "green";
    showToast({
      type: "success",
      text: `You have successfully booked a slot in ${parkingSpace.value}`,
    });
    setTimeout(() => {
      submitBookingBtn.style.backgroundColor = "#fe4801";
      submitBookingBtn.innerHTML = "Submit";
      submitBookingBtn.disabled = false;
      resetData();
    }, 3000);
  }
};

bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  uploadBooking();
});

closeBtn.addEventListener("click", () => {
  qrcodeContainer.style.visibility = "hidden";
  setTimeout(() => {
    qrcodeElement.innerHTML = "";
  }, 2000);
});

const resetData = () => {
  booking_data = {
    selected_parking_space: "",
    customer_name: "",
    customer_phone_number: "",
    parking_start_date: "",
    parking_end_date: "",
    parking_time: "",
    parking_slot_number: 0,
    order_number: "",
  };
  parkingEndDate.value = "";
  parkingSpace.value = "";
  parkingTime.value = "";
  parkingStartDate.value = "";
  customerName.value = "";
  customerPhoneNumber.value = "";
};
