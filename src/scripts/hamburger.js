// Menú hamburguesa - Header y página de auth

// Hacemos la función global para poder llamarla también desde xLuIncludeFile
function initHamburgerMenu() {
    // ----- HEADER GENERAL -----
    const hamburger = document.getElementById('hamburger-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburger && mobileMenu && !hamburger._hamburgerBound) {
        hamburger._hamburgerBound = true;

        hamburger.addEventListener('click', function (e) {
            e.stopPropagation();
            mobileMenu.classList.toggle('active');
        });

        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function () {
                mobileMenu.classList.remove('active');
            });
        });

        document.addEventListener('click', function (e) {
            if (!e.target.closest('.hamburger') && !e.target.closest('.mobile-menu')) {
                mobileMenu.classList.remove('active');
            }
        });
    }

    // ----- PÁGINA DE AUTH (sign-in) -----
    const hamburgerAuth = document.getElementById('hamburger-toggle-auth');
    const mobileMenuAuth = document.getElementById('mobile-menu-auth');

    if (hamburgerAuth && mobileMenuAuth && !hamburgerAuth._hamburgerBound) {
        hamburgerAuth._hamburgerBound = true;

        hamburgerAuth.addEventListener('click', function (e) {
            e.stopPropagation();
            mobileMenuAuth.classList.toggle('active');
        });

        const menuLinksAuth = mobileMenuAuth.querySelectorAll('a');
        menuLinksAuth.forEach(link => {
            link.addEventListener('click', function () {
                mobileMenuAuth.classList.remove('active');
            });
        });

        document.addEventListener('click', function (e) {
            if (!e.target.closest('.hamburger-mobile') && !e.target.closest('.mobile-menu-auth')) {
                mobileMenuAuth.classList.remove('active');
            }
        });
    }
}

// Intento inicial al cargar el DOM (por si ya está todo en la página)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        initHamburgerMenu();
        // Segundo intento unos ms después por los includes asíncronos
        setTimeout(initHamburgerMenu, 100);
    });
} else {
    initHamburgerMenu();
    setTimeout(initHamburgerMenu, 100);
}


