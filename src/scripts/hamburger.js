// Menú hamburguesa - Header y página de auth

const AUTH_STORAGE_KEY = 'casacAuthSession';
const DEMO_ACCOUNT = {
    email: 'demo@casac.com',
    password: 'casac123',
    name: 'Usuario de prueba'
};

function getCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems'));
    if (!Array.isArray(cartItems)) {
        return 0;
    }

    return cartItems.reduce((total, item) => {
        const quantity = Number(item?.quantity) || 0;
        return total + quantity;
    }, 0);
}

function updateCartBadge(animate = false) {
    const count = getCartCount();
    const badges = document.querySelectorAll('[data-cart-badge]');

    badges.forEach((badge) => {
        badge.textContent = String(count);
        badge.classList.toggle('visible', count > 0);

        if (animate && count > 0) {
            badge.classList.remove('bump');
            // Forzamos reflow para reiniciar la animación cuando se añade más de una vez
            void badge.offsetWidth;
            badge.classList.add('bump');
        }
    });
}

function getAuthSession() {
    const authData = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
    if (authData?.loggedIn) {
        return authData;
    }

    return null;
}

function setAuthSession(session) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

function clearAuthSession() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

function isUserLoggedIn() {
    return Boolean(getAuthSession());
}

function updateAuthLinks() {
    const loggedIn = isUserLoggedIn();
    const authLinks = document.querySelectorAll('[data-auth-link]');
    const logoutLinks = document.querySelectorAll('[data-logout-link]');

    authLinks.forEach((link) => {
        link.textContent = loggedIn ? 'Perfil' : 'Iniciar sesión';
        link.setAttribute('href', loggedIn ? 'profile.html' : 'sign-in.html');
    });

    logoutLinks.forEach((link) => {
        link.hidden = !loggedIn;
    });
}

function bindLogoutActions() {
    const logoutLinks = document.querySelectorAll('[data-logout-link]');

    logoutLinks.forEach((link) => {
        if (link._logoutBound) {
            return;
        }

        link._logoutBound = true;
        link.addEventListener('click', function (event) {
            event.preventDefault();

            clearAuthSession();
            updateAuthLinks();

            const mobileMenu = document.getElementById('mobile-menu');
            const mobileMenuAuth = document.getElementById('mobile-menu-auth');
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
            }
            if (mobileMenuAuth) {
                mobileMenuAuth.classList.remove('active');
            }

            window.location.href = 'sign-in.html';
        });
    });
}

function validateDemoCredentials(email, password) {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedPassword = String(password || '').trim();

    return normalizedEmail === DEMO_ACCOUNT.email && normalizedPassword === DEMO_ACCOUNT.password;
}

function showLoginFeedback(message, isError = false) {
    const form = document.getElementById('login-form');
    if (!form) {
        return;
    }

    let feedback = document.getElementById('login-feedback');
    if (!feedback) {
        feedback = document.createElement('p');
        feedback.id = 'login-feedback';
        feedback.className = 'small';
        form.insertAdjacentElement('afterend', feedback);
    }

    feedback.textContent = message;
    feedback.style.color = isError ? '#b42318' : '#0a7d34';
}

function handleSuccessfulLogin() {
    const session = {
        loggedIn: true,
        email: DEMO_ACCOUNT.email,
        name: DEMO_ACCOUNT.name,
        loginAt: new Date().toISOString()
    };

    setAuthSession(session);
    updateAuthLinks();
    showLoginFeedback('Sesion iniciada correctamente. Redirigiendo...');

    const searchParams = new URLSearchParams(window.location.search);
    const next = (searchParams.get('next') || '').trim();

    if (next && !next.startsWith('http')) {
        window.location.href = next;
        return;
    }

    window.location.href = 'profile.html';
}

function initLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm || loginForm._loginBound) {
        return;
    }

    loginForm._loginBound = true;
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        const email = emailInput?.value;
        const password = passwordInput?.value;

        if (validateDemoCredentials(email, password)) {
            handleSuccessfulLogin();
            return;
        }

        showLoginFeedback('Credenciales incorrectas. Usa la cuenta de prueba.', true);
    });

    const googleButton = document.querySelector('.google-btn');
    if (googleButton && !googleButton._googleBound) {
        googleButton._googleBound = true;
        googleButton.addEventListener('click', function () {
            handleSuccessfulLogin();
        });
    }
}

// Hacemos la función global para poder llamarla también desde xLuIncludeFile
function initHamburgerMenu() {
    updateCartBadge();
    updateAuthLinks();
    bindLogoutActions();
    initLoginForm();

    if (window.location.pathname.endsWith('/sign-in.html') && isUserLoggedIn()) {
        window.location.href = 'profile.html';
        return;
    }

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
        updateCartBadge();
        // Segundo intento unos ms después por los includes asíncronos
        setTimeout(initHamburgerMenu, 100);
        setTimeout(updateCartBadge, 100);
    });
} else {
    initHamburgerMenu();
    updateCartBadge();
    setTimeout(initHamburgerMenu, 100);
    setTimeout(updateCartBadge, 100);
}

window.addEventListener('storage', function (event) {
    if (event.key === 'cartItems') {
        updateCartBadge();
    }

    if (event.key === AUTH_STORAGE_KEY) {
        updateAuthLinks();
    }
});


