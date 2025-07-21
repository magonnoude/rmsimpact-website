document.addEventListener("DOMContentLoaded", function() {
    // Détecter la langue de la page actuelle (fr ou en)
    const lang = document.documentElement.lang;
    const headerPath = `partials/header${lang === 'en' ? '_en' : ''}.html`;
    const footerPath = `partials/footer${lang === 'en' ? '_en' : ''}.html`;

    // Fonction pour charger les partiels (header/footer)
    const loadPartial = (elementId, filePath) => {
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Could not load ${filePath}`);
                }
                return response.text();
            })
            .then(data => {
                document.getElementById(elementId).innerHTML = data;
            })
            .catch(error => console.error('Error loading partial:', error));
    };

    // Charger le header et le footer
    loadPartial('main-header', headerPath);
    loadPartial('main-footer', footerPath);
});