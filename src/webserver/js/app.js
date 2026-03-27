import { ROUTES, DEFAULT_ROUTE } from '/js/routes.js';
import { loadPartial, loadView } from '/js/modules.js';

const navSlot = document.getElementById('nav-slot');
const footerSlot = document.getElementById('footer-slot');
const viewSlot = document.getElementById('view-slot');
const dynamicViewStyle = document.getElementById('dynamic-view-style');

function initLoginView() {
    const loginForm = viewSlot.querySelector('form');

    if (!loginForm) {
        return;
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        // Demo-Verhalten: Jede Eingabe wird akzeptiert und in die App weitergeleitet.
        window.location.hash = 'customer-list-view';
    });
}

function getCurrentRouteName() {
    const hash = window.location.hash.replace('#', '').trim();

    if (!hash) {
        return DEFAULT_ROUTE;
    }

    return hash;
}

function setActiveNavLink(routeName) {
    const links = navSlot.querySelectorAll('[data-route]');

    links.forEach((link) => {
        link.classList.toggle('is-active', link.dataset.route === routeName);
    });
}

function setRouteCss(routeName) {
    dynamicViewStyle.setAttribute('href', `/css/views/${routeName}.css`);
    dynamicViewStyle.onerror = () => {
        dynamicViewStyle.setAttribute('href', '/css/views/_default.css');
    };
}

async function renderShell(showShell, routeName) {
    if (!showShell) {
        navSlot.innerHTML = '';
        footerSlot.innerHTML = '';
        document.body.classList.add('is-login-view');
        return;
    }

    document.body.classList.remove('is-login-view');
    navSlot.innerHTML = await loadPartial('/html/modules/_nav.html');
    footerSlot.innerHTML = await loadPartial('/html/modules/_footer.html');
    setActiveNavLink(routeName);
}

async function renderRoute() {
    const routeName = getCurrentRouteName();
    const route = ROUTES[routeName] || ROUTES['404-not-found-view'];

    setRouteCss(routeName in ROUTES ? routeName : '404-not-found-view');

    try {
        await renderShell(route.showShell, routeName);
        const viewHtml = await loadView(`/html/views/${route.viewFile}`);
        viewSlot.innerHTML = viewHtml;
        if ((routeName in ROUTES ? routeName : '404-not-found-view') === 'login-view') {
            initLoginView();
        }
        document.title = `${route.title} | SPA Demo`;
    } catch (error) {
        viewSlot.innerHTML = `
            <section class="view-card">
                <h1>Ladefehler</h1>
                <p>Die angeforderte Ansicht konnte nicht geladen werden.</p>
                <p>${error.message}</p>
            </section>
        `;
    }
}

window.addEventListener('hashchange', renderRoute);
window.addEventListener('DOMContentLoaded', async () => {
    if (!window.location.hash) {
        window.location.hash = DEFAULT_ROUTE;
        return;
    }

    await renderRoute();
});
