// Ouvrir tous les projets au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.group-projects').forEach(function(projects) {
        projects.classList.remove('collapsed');
    });
    document.querySelectorAll('.toggle-group-projects').forEach(function(btn) {
        btn.classList.remove('collapsed');
    });
});

function showCopyMessage(message) {
    let notif = document.createElement('div');
    notif.textContent = message;
    notif.style.position = 'fixed';
    notif.style.top = '2rem';
    notif.style.left = '50%';
    notif.style.transform = 'translateX(-50%)';
    notif.style.background = '#74876c';
    notif.style.color = '#fff';
    notif.style.padding = '0.7em 1.5em';
    notif.style.borderRadius = '8px';
    notif.style.fontSize = '1rem';
    notif.style.zIndex = 9999;
    notif.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    document.body.appendChild(notif);
    setTimeout(() => {
        notif.remove();
    }, 1500);
}

function copyContact(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() {
            showCopyMessage('Copié !');
        });
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showCopyMessage('Copié !');
    }
}

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// CONTACT ICONS
document.querySelectorAll('.contact-logo[data-copy]').forEach(function(icon) {
    icon.style.cursor = "pointer";
    icon.addEventListener('click', function() {
        const text = icon.getAttribute('data-copy');
        if (isMobile()) {
            if (text.match(/^[\d\s+]+$/)) {
                // Numéro de téléphone
                window.location.href = 'tel:' + text.replace(/\s+/g, '');
            } else if (text.includes('@')) {
                // Email
                window.location.href = 'mailto:' + text;
            } else {
                copyContact(text);
            }
        } else {
            copyContact(text);
        }
    });
});

//CONTACT LINKEDIN ICON
document.querySelectorAll('.contact-logo[data-linkedin]').forEach(function(icon) {
    icon.style.cursor = "pointer";
    icon.addEventListener('click', function(e) {
        if (isMobile()) {
            e.preventDefault();
            const username = icon.getAttribute('data-linkedin');
            // Tente d’ouvrir l’app LinkedIn, sinon ouvre le site web
            window.location.href = "linkedin://in/" + username;
            setTimeout(function() {
                window.location.href = "https://www.linkedin.com/in/" + username + "/";
            }, 500);
        }
        // Sur desktop, comportement normal (ouvre le lien dans un nouvel onglet)
    });
});
document.querySelectorAll('.contact-logo[data-copy]').forEach(function(icon) {
    icon.style.cursor = "pointer";
    icon.addEventListener('click', function() {
        const text = icon.getAttribute('data-copy');
        copyContact(text);
    });
});

// EXPERTISE FILTER
window.activeFilters = new Set();

document.querySelectorAll('.project-pipeline, .project-software, .project-skill').forEach(function(expertiseEl) {
    expertiseEl.style.cursor = "pointer";
    expertiseEl.addEventListener('click', function() {
        const expertise = expertiseEl.textContent.trim();

        // Ajoute ou retire l'expertise du Set
        if (window.activeFilters.has(expertise)) {
            window.activeFilters.delete(expertise);
        } else {
            window.activeFilters.add(expertise);
        }

        // Si aucun filtre actif, tout afficher
        if (window.activeFilters.size === 0) {
            document.querySelectorAll('.project').forEach(function(project) {
                project.style.display = '';
            });
        } else {
            // Afficher les projets qui contiennent TOUTES les expertises sélectionnées
            document.querySelectorAll('.project').forEach(function(project) {
                const projectExpertises = Array.from(project.querySelectorAll('.project-pipeline, .project-software, .project-skill'))
                    .map(el => el.textContent.trim());
                const hasAll = Array.from(window.activeFilters).every(f => projectExpertises.includes(f));
                project.style.display = hasAll ? '' : 'none';
            });
        }

        // Met à jour la classe active sur les boutons
        document.querySelectorAll('.project-pipeline, .project-software, .project-skill').forEach(el => {
            if (window.activeFilters.has(el.textContent.trim())) {
                el.classList.add('active-filter');
            } else {
                el.classList.remove('active-filter');
            }
        });
    });
});

//TOGGLE PROJECTS
document.querySelectorAll('.toggle-group-projects').forEach(function(btn) {
    btn.addEventListener('click', function() {
        const groupProjects = btn.closest('.group-container').nextElementSibling;
        if (groupProjects && groupProjects.classList.contains('group-projects')) {
            groupProjects.classList.toggle('collapsed');
            btn.classList.toggle('collapsed', groupProjects.classList.contains('collapsed'));
        }
    });
});

document.querySelectorAll('.group-info').forEach(function(info) {
    info.style.cursor = "pointer";
    info.addEventListener('click', function() {
        // Trouve le parent .group
        const group = info.closest('.group');
        if (!group) return;

        // Trouve le .group-projects dans ce .group
        const groupProjects = group.querySelector('.group-projects');
        // Trouve le bouton flèche dans ce .group
        const toggleBtn = group.querySelector('.toggle-group-projects');

        if (groupProjects) {
            groupProjects.classList.toggle('collapsed');
            if (toggleBtn) {
                toggleBtn.classList.toggle('collapsed', groupProjects.classList.contains('collapsed'));
            }
        }
    });
});

// EFFET DE SCROLL SUR LE HEADER
window.addEventListener('scroll', function() {
    // HEADER SCROLL EFFECT
    const header = document.querySelector('.header');
    const photo = document.querySelector('.photo');
    if (window.innerWidth >= 1250 && window.scrollY > 50) {
        header.classList.add('scrolled');
        if (photo) photo.src = 'images/photo_banner.png';
    } else {
        header.classList.remove('scrolled');
        if (photo) photo.src = 'animation/1.png'; // Utilise la première image de l'animation au lieu de photo.png
    }
});