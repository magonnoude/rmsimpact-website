document.addEventListener("DOMContentLoaded", function() {
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");
    const submitButton = document.getElementById("submit-button");

    // REMPLACEZ CETTE URL PAR L'URL DE VOTRE API GATEWAY
    const apiUrl = "https://mnkf082iie.execute-api.eu-west-3.amazonaws.com/default/RMSImpactContactForm";

    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Envoi...';

        const formData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            subject: document.getElementById("subject").value,
            message: document.getElementById("message").value,
        };

        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            formStatus.innerHTML = `<div class="alert alert-success" role="alert">${data.message}</div>`;
            contactForm.reset();
        })
        .catch(error => {
            console.error("Error:", error);
            formStatus.innerHTML = `<div class="alert alert-danger" role="alert">Une erreur est survenue. Veuillez réessayer.</div>`;
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        });
    });
});