import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import app from "./firebase_init.js"
const username = document.getElementById("username");
const password = document.getElementById("password");
const form = document.getElementById("admin_form");
const signoutBtn = document.getElementById("signout_btn");
const toast = document.getElementById("toast");
const loginBtn = document.getElementById("login_btn");
import showToast from "../js/toast.js"

const auth = getAuth(app);
let errorText;

const displayToast = () => {
    toast.innerHTML = `<p>${errorText}</p>`;
}

const loginAdmin = (e) =>{
    e.preventDefault();
    console.log(username.value, password.value);
    // if(username.value === "") alert("Empty")
   loginBtn.innerHTML = "Logging in...";
   loginBtn.disabled = true;
 
    signInWithEmailAndPassword(auth, username.value, password.value)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log(user);
        localStorage.setItem("user", JSON.stringify({email: user.email}));
        window.location.pathname = "../admin/index.html"
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        loginBtn.innerHTML = "Login";
        loginBtn.disabled = false;
      showToast({type: "error", text: errorCode})
        // ..
      });
}



const logoutAdmin = (e) => {
  signOut(auth).then(() => {
    localStorage.removeItem("user");
    window.location.href = "/index.html";
  })
}

signoutBtn && signoutBtn.addEventListener("click", logoutAdmin)
console.log(username)
form && form.addEventListener("submit", loginAdmin); 