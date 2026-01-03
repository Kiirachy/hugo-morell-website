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

// BACK TO TOP BUTTON
// Affiche le bouton quand on scrolle vers le bas
window.addEventListener('scroll', function() {
    const btn = document.getElementById('back-to-top');
    if (window.scrollY > 300) {
        btn.style.display = 'flex';
    } else {
        btn.style.display = 'none';
    }

    // HEADER SCROLL EFFECT
    const header = document.querySelector('.header');
    const photo = document.querySelector('.photo');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
        if (photo) photo.src = 'images/photo_banner.png';
    } else {
        header.classList.remove('scrolled');
        if (photo) photo.src = 'animation/1.png'; // Utilise la première image de l'animation au lieu de photo.png
    }
});
// Scroll doux vers le haut au clic
document.getElementById('back-to-top').addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ANIMATION IMAGE PAR IMAGE POUR LA PHOTO DE PROFIL
// Ce code gère l'animation de la photo de profil : figée sur la première image par défaut,
// et joue en boucle lors du mouseover.

document.addEventListener('DOMContentLoaded', function() {
    const photo = document.querySelector('.photo');
    if (!photo) return;

    // Tableau des images de l'animation (de 1.png à 18.png dans le dossier animation)
    const animationFrames = [];
    for (let i = 1; i <= 18; i++) {
        animationFrames.push('animation/' + i + '.png');
    }

    let animationInterval; // Variable pour stocker l'intervalle de l'animation
    let currentFrame = 0; // Index de l'image actuelle

    // Fonction pour jouer l'animation en boucle
    function playAnimation() {
        // Ne joue l'animation que si non scrolled
        if (window.scrollY > 50) return;
        animationInterval = setInterval(() => {
            currentFrame = (currentFrame + 1) % animationFrames.length; // Passe à l'image suivante, boucle à 0
            photo.src = animationFrames[currentFrame];
        }, 100); // Change d'image toutes les 100ms (ajustable pour la vitesse)
    }

    // Fonction pour arrêter l'animation et revenir à la bonne image selon l'état scrolled
    function stopAnimation() {
        clearInterval(animationInterval);
        if (window.scrollY > 50) {
            photo.src = 'images/photo_banner.png'; // Si scrolled, force photo_banner
        } else {
            currentFrame = 0;
            photo.src = animationFrames[0]; // Sinon, remet la première image de l'animation
        }
    }

    // Événements mouseover et mouseout sur la photo
    photo.addEventListener('mouseover', playAnimation);
    photo.addEventListener('mouseout', stopAnimation);

    // Initialise la photo sur la première image au chargement
    photo.src = animationFrames[0];
});