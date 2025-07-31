document.addEventListener("DOMContentLoaded", function() {
    const projectForm = document.getElementById("project-form");
    if (!projectForm) return;

    const formStatus = document.getElementById("form-status");
    const submitButton = document.getElementById("submit-button");
    const apiUrl = "https://2epzqj8fz6.execute-api.eu-west-3.amazonaws.com/default/RMSSubmitProjectForm";

    projectForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Envoi...';

        const needs = [];
        if (document.getElementById("need-energy").checked) needs.push("Énergie");
        if (document.getElementById("need-water").checked) needs.push("Eau");
        if (document.getElementById("need-internet").checked) needs.push("Internet");

        const formData = {
            proposerName: document.getElementById("proposer-name").value,
            proposerEmail: document.getElementById("proposer-email").value,
            proposerOrg: document.getElementById("proposer-org").value,
            villageName: document.getElementById("village-name").value,
            villageRegion: document.getElementById("village-region").value,
            villagePopulation: document.getElementById("village-population").value,
            needs: needs,
            projectDescription: document.getElementById("project-description").value,
        };

        fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            formStatus.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
            projectForm.reset();
        })
        .catch(error => {
            console.error("Error:", error);
            formStatus.innerHTML = `<div class="alert alert-danger">Une erreur est survenue.</div>`;
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        });
    });
});