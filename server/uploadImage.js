import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-storage.js";
  import app from "./firebase_init.js";

const storage = getStorage(app);


const uploadImageToFirebaseStorage = (progress_element, imageFile) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, "images/" + imageFile.name);
  
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get the progress percentage
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  
          progress_element.style.width = progress + "%";
          // You can update the progress UI here if needed
        },
        (error) => {
          console.error("Error uploading file:", error);
          reject(error);
        },
        () => {
          // Upload completed successfully, get download URL
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              resolve(downloadURL);
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
              reject(error);
            });
        }
      );
    });
  };

export {uploadImageToFirebaseStorage}
