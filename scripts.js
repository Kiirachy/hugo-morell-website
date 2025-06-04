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

document.querySelectorAll('.contact-logo[data-copy]').forEach(function(icon) {
    icon.style.cursor = "pointer";
    icon.addEventListener('click', function() {
        const text = icon.getAttribute('data-copy');
        copyContact(text);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const section = document.querySelector('.skill-section');
    const modules = Array.from(document.querySelectorAll('.skill-module'));
    const dots = Array.from(document.querySelectorAll('.skill-dots .dot'));

    function updateDots() {
        // Trouve le module le plus centré dans la fenêtre
        let minDiff = Infinity, activeIdx = 0;
        modules.forEach((mod, i) => {
            const rect = mod.getBoundingClientRect();
            const diff = Math.abs(rect.left + rect.width/2 - window.innerWidth/2);
            if (diff < minDiff) {
                minDiff = diff;
                activeIdx = i;
            }
        });
        dots.forEach(dot => dot.classList.remove('active'));
        dots[activeIdx].classList.add('active');
    }

    section.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateDots);
    });
    updateDots();
});