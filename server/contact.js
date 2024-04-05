const contactForm = document.getElementById("contact_form");
const senderName = document.getElementById("sender_name");
const senderMessage = document.getElementById("sender_message");
const senderEmail = document.getElementById("sender_email");
const senderPhoneNumber = document.getElementById("sender_phone_number");
const contactSubmitBtn = document.getElementById("contact_submit_btn");

let _publicKey = "lkukCGPQyVrynpq50";
let _serviceID = "service_9cngala";
let _templateID = "template_fjv5lg9";

emailjs.init(_publicKey);

contactForm.addEventListener("submit", e => {
    e.preventDefault();

    contactSubmitBtn.innerHTML = "Just A Momonet...";
    contactSubmitBtn.disabled = true;

    let inputFields = {
        name: senderName.value,
        email: senderEmail.value,
        message: senderMessage.value,
        number: senderPhoneNumber.value,
    }

    emailjs.send(_serviceID, _templateID, inputFields).then(() => {
        contactSubmitBtn.innerHTML = "Message sent";
        senderName.value = "";
        senderMessage.value = "";
        senderEmail.value = "";
        senderPhoneNumber.value = "";
    contactSubmitBtn.disabled = false;

    }), (error) => {
    contactSubmitBtn.disabled = false;

        contactSubmitBtn.innerHTML = "Something went wrong";
    }
})

