// Menú hamburguesa + autenticación/sesión/roles

const AUTH_STORAGE_KEY = 'casacAuthSession';
const USERS_STORAGE_KEY = 'casacUsers';
const USERS_SYNCED_STORAGE_KEY = 'casacUsersSeededFromJson';
const ORDERS_STORAGE_KEY = 'orders';

const PROTECTED_USER_PAGES = new Set([
    'profile.html',
    'security.html',
    'addresses.html',
    'order-history.html'
]);

let usersInitPromise = null;

function isAdminSection() {
    return window.location.pathname.includes('/pages/admin/');
}

function toUserPageHref(fileName) {
    return isAdminSection() ? `../user/${fileName}` : fileName;
}

function toAdminPageHref(fileName) {
    return isAdminSection() ? fileName : `../admin/${fileName}`;
}

function currentPageName() {
    const segments = window.location.pathname.split('/').filter(Boolean);
    return segments[segments.length - 1] || '';
}

function getStoredUsers() {
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY));
    return Array.isArray(users) ? users : [];
}

function saveUsers(users) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
}

function normalizeUser(user, fallbackId = Date.now()) {
    return {
        id: Number(user?.id) || fallbackId,
        email: normalizeEmail(user?.email),
        password: String(user?.password || '').trim(),
        name: String(user?.name || 'Usuario CASAC').trim(),
        role: String(user?.role || 'customer').trim().toLowerCase()
    };
}

function mergeUsers(baseUsers, incomingUsers) {
    const byEmail = new Map();

    baseUsers.forEach((user, index) => {
        const normalized = normalizeUser(user, index + 1);
        if (normalized.email) {
            byEmail.set(normalized.email, normalized);
        }
    });

    incomingUsers.forEach((user, index) => {
        const normalized = normalizeUser(user, Date.now() + index);
        if (normalized.email) {
            byEmail.set(normalized.email, normalized);
        }
    });

    return [...byEmail.values()];
}

async function fetchUsersSeed() {
    const endpoints = [
        'http://localhost:3000/users',
        '/database/db.json',
        '../../../database/db.json'
    ];

    for (const endpoint of endpoints) {
        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                continue;
            }

            const payload = await response.json();
            if (Array.isArray(payload)) {
                return payload;
            }

            if (Array.isArray(payload?.users)) {
                return payload.users;
            }
        } catch (error) {
            // Probamos siguiente endpoint
        }
    }

    return [];
}

async function ensureUsersReady() {
    if (!usersInitPromise) {
        usersInitPromise = (async () => {
            const localUsers = getStoredUsers();
            const wasSeeded = localStorage.getItem(USERS_SYNCED_STORAGE_KEY) === 'true';

            if (localUsers.length > 0 && wasSeeded) {
                return localUsers;
            }

            const seedUsers = await fetchUsersSeed();
            const merged = mergeUsers(localUsers, seedUsers);

            if (merged.length > 0) {
                saveUsers(merged);
                localStorage.setItem(USERS_SYNCED_STORAGE_KEY, 'true');
                return merged;
            }

            if (localUsers.length > 0) {
                return localUsers;
            }

            const fallbackUsers = [
                normalizeUser({
                    id: 1,
                    email: 'demo@casac.com',
                    password: 'casac123',
                    name: 'Usuario de prueba',
                    role: 'customer'
                }),
                normalizeUser({
                    id: 2,
                    email: 'admin@casac.com',
                    password: 'admin123',
                    name: 'Administrador CASAC',
                    role: 'admin'
                })
            ];

            saveUsers(fallbackUsers);
            return fallbackUsers;
        })();
    }

    return usersInitPromise;
}

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
    const localAuthData = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
    if (localAuthData?.loggedIn) {
        return localAuthData;
    }

    const sessionAuthData = JSON.parse(sessionStorage.getItem(AUTH_STORAGE_KEY));
    if (sessionAuthData?.loggedIn) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionAuthData));
        return sessionAuthData;
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

function isAdminLoggedIn() {
    const auth = getAuthSession();
    return Boolean(auth?.loggedIn && auth?.role === 'admin');
}

function updateAuthLinks() {
    const session = getAuthSession();
    const loggedIn = Boolean(session);
    const authLinks = document.querySelectorAll('[data-auth-link]');
    const logoutLinks = document.querySelectorAll('[data-logout-link]');
    const adminLinks = document.querySelectorAll('[data-admin-link]');

    authLinks.forEach((link) => {
        link.textContent = loggedIn ? 'Perfil' : 'Iniciar sesión';
        link.setAttribute('href', loggedIn ? toUserPageHref('profile.html') : toUserPageHref('sign-in.html'));
    });

    logoutLinks.forEach((link) => {
        link.hidden = !loggedIn;
        link.style.display = loggedIn ? '' : 'none';
    });

    const showAdmin = Boolean(session?.role === 'admin');
    adminLinks.forEach((link) => {
        link.hidden = !showAdmin;
        link.style.display = showAdmin ? '' : 'none';
        link.setAttribute('href', toAdminPageHref('admin-shop.html'));
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

            window.location.href = toUserPageHref('sign-in.html');
        });
    });
}

function findUserByCredentials(email, password) {
    const users = getStoredUsers();
    const normalizedEmail = normalizeEmail(email);
    const normalizedPassword = String(password || '').trim();

    return users.find((user) => {
        return normalizeEmail(user.email) === normalizedEmail && String(user.password).trim() === normalizedPassword;
    }) || null;
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

function handleSuccessfulLogin(user) {
    const session = {
        loggedIn: true,
        userId: user.id,
        email: normalizeEmail(user.email),
        name: String(user.name || 'Usuario CASAC').trim(),
        role: String(user.role || 'customer').trim().toLowerCase(),
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

    if (session.role === 'admin') {
        window.location.href = toAdminPageHref('admin-shop.html');
        return;
    }

    window.location.href = toUserPageHref('profile.html');
}

function createSessionFromUser(user) {
    return {
        loggedIn: true,
        userId: Number(user?.id) || Date.now(),
        email: normalizeEmail(user?.email),
        name: String(user?.name || 'Usuario CASAC').trim(),
        role: String(user?.role || 'customer').trim().toLowerCase(),
        loginAt: new Date().toISOString()
    };
}

function handleSuccessfulRegister(user) {
    const session = createSessionFromUser(user);
    setAuthSession(session);
    updateAuthLinks();
    window.location.href = toUserPageHref('profile.html');
}

function nextUserId() {
    const users = getStoredUsers();
    return users.reduce((maxId, user) => Math.max(maxId, Number(user.id) || 0), 0) + 1;
}

function emailAlreadyUsed(email) {
    const target = normalizeEmail(email);
    return getStoredUsers().some((user) => normalizeEmail(user.email) === target);
}

function initLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm || loginForm._loginBound) {
        return;
    }

    loginForm._loginBound = true;
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        await ensureUsersReady();

        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        const email = emailInput?.value;
        const password = passwordInput?.value;

        const user = findUserByCredentials(email, password);
        if (user) {
            handleSuccessfulLogin(user);
            return;
        }

        showLoginFeedback('Credenciales incorrectas. Revisa email y contraseña.', true);
    });

    const googleButton = document.querySelector('.google-btn');
    if (googleButton && !googleButton._googleBound) {
        googleButton._googleBound = true;
        googleButton.addEventListener('click', async function () {
            await ensureUsersReady();
            const users = getStoredUsers();
            if (users.length === 0) {
                showLoginFeedback('No se han encontrado usuarios disponibles.', true);
                return;
            }

            handleSuccessfulLogin(users[0]);
        });
    }
}

function bindRegisterForm(formId, emailId, nameId, role = 'customer') {
    const form = document.getElementById(formId);
    if (!form || form._registerBound) {
        return;
    }

    form._registerBound = true;
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        await ensureUsersReady();

        const email = document.getElementById(emailId)?.value;
        const name = document.getElementById(nameId)?.value;
        const normalizedEmail = normalizeEmail(email);

        if (!normalizedEmail) {
            return;
        }

        if (emailAlreadyUsed(normalizedEmail)) {
            window.alert('Ese correo ya está registrado. Prueba a iniciar sesión.');
            return;
        }

        const password = document.getElementById('password')?.value;
        const newUser = normalizeUser({
            id: nextUserId(),
            email: normalizedEmail,
            password,
            name,
            role
        });

        const users = getStoredUsers();
        users.push(newUser);
        saveUsers(users);

        handleSuccessfulRegister(newUser);
    });
}

function initRegisterForms() {
    bindRegisterForm('register-form', 'email', 'fullname', 'customer');
    bindRegisterForm('company-register-form', 'email', 'company-name', 'company');
}

function showAuthRequiredPopupIfNeeded() {
    if (!window.location.pathname.endsWith('/sign-in.html')) {
        return;
    }

    if (isUserLoggedIn()) {
        return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('reason') !== 'auth-required') {
        return;
    }

    window.alert('Debes iniciar sesion para continuar con la compra.');

    searchParams.delete('reason');
    const nextQuery = searchParams.toString();
    const cleanUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}`;
    window.history.replaceState({}, '', cleanUrl);
}

function isProtectedUserPage() {
    if (isAdminSection()) {
        return false;
    }

    return PROTECTED_USER_PAGES.has(currentPageName());
}

function redirectToSignInWithNext(reason = 'auth-required') {
    const next = `${window.location.pathname}${window.location.search || ''}`;
    const params = new URLSearchParams();
    params.set('reason', reason);
    params.set('next', next);
    window.location.href = `${toUserPageHref('sign-in.html')}?${params.toString()}`;
}

function enforceRouteGuards() {
    const loggedIn = isUserLoggedIn();

    if (isProtectedUserPage() && !loggedIn) {
        redirectToSignInWithNext('auth-required');
        return false;
    }

    if (isAdminSection()) {
        if (!loggedIn) {
            redirectToSignInWithNext('auth-required');
            return false;
        }

        if (!isAdminLoggedIn()) {
            window.location.href = toUserPageHref('home.html');
            return false;
        }
    }

    return true;
}

// Hacemos la función global para poder llamarla también desde xLuIncludeFile
async function initHamburgerMenu() {
    await ensureUsersReady();

    if (!enforceRouteGuards()) {
        return;
    }

    updateCartBadge();
    updateAuthLinks();
    bindLogoutActions();
    initLoginForm();
    initRegisterForms();
    showAuthRequiredPopupIfNeeded();

    if (window.location.pathname.endsWith('/sign-in.html') && isUserLoggedIn()) {
        if (isAdminLoggedIn()) {
            window.location.href = toAdminPageHref('admin-shop.html');
            return;
        }

        window.location.href = toUserPageHref('profile.html');
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

    if (event.key === USERS_STORAGE_KEY) {
        updateAuthLinks();
    }
});


