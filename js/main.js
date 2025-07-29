document.addEventListener("DOMContentLoaded", function() {
    const lang = document.documentElement.lang;
    
    // CHEMINS CORRIGÉS AVEC LE '/' AU DÉBUT
    const headerPath = `/partials/header${lang === 'en' ? '_en' : ''}.html`;
    const footerPath = `/partials/footer${lang === 'en' ? '_en' : ''}.html`;

    const loadPartial = (elementId, filePath) => {
        fetch(filePath)
            .then(response => response.ok ? response.text() : Promise.reject(`Could not load ${filePath}`))
            .then(data => { document.getElementById(elementId).innerHTML = data; })
            .catch(error => console.error('Error loading partial:', error));
    };

    loadPartial('main-header', headerPath);
    loadPartial('main-footer', footerPath);
});