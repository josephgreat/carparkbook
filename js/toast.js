const toastContainer = document.querySelector(".toast_container");
const toastText = document.querySelector(".toast_text");
const toastIcon = document.querySelector(".toast_icon");

const showToast = ({type: type, text: text}) => {
    toastText.innerHTML = text;
    if(type === "success"){
        toastIcon.classList.remove("fa-exclamation-triangle");
        toastContainer.classList.remove("error");
        toastIcon.classList.add("fa-check");
        toastContainer.classList.add("success","show");
    } else {
        toastIcon.classList.remove("fa-check");
        toastContainer.classList.remove("success");
        toastIcon.classList.add("fa-exclamation-triangle");
        toastContainer.classList.add("error", "show");
    }
}

export default showToast;