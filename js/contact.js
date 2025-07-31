document.addEventListener("DOMContentLoaded", function() {
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");
    const submitButton = document.getElementById("submit-button");

    // VOS INFORMATIONS À REMPLACER
    const apiUrl = "https://mnkf082iie.execute-api.eu-west-3.amazonaws.com/default/RMSImpactContactForm";
    const recaptchaSiteKey = "6LdbWpMrAAAAAKAL9UQr0s4axirthDkTVEbbYEHV";

    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Vérification...';

        grecaptcha.ready(function() {
            grecaptcha.execute(recaptchaSiteKey, {action: 'contact'}).then(function(token) {
                
                submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Envoi...';

                const formData = {
                    name: document.getElementById("name").value,
                    email: document.getElementById("email").value,
                    subject: document.getElementById("subject").value,
                    message: document.getElementById("message").value,
                    recaptchaToken: token // On ajoute le jeton reCAPTCHA
                };

                fetch(apiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message.includes("succès") || data.message.includes("Success")) {
                        formStatus.innerHTML = `<div class="alert alert-success" role="alert">${data.message}</div>`;
                        contactForm.reset();
                    } else {
                        formStatus.innerHTML = `<div class="alert alert-danger" role="alert">${data.message}</div>`;
                    }
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
    });
});