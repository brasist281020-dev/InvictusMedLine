// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    // Desktop icons
    const sunIcon = document.getElementById('theme-icon-light');
    const moonIcon = document.getElementById('theme-icon-dark');
    // Mobile icons
    const sunIconMobile = document.getElementById('theme-icon-light-mobile');
    const moonIconMobile = document.getElementById('theme-icon-dark-mobile');

    if (theme === 'dark') {
        if (sunIcon) sunIcon.classList.remove('hidden');
        if (moonIcon) moonIcon.classList.add('hidden');
        if (sunIconMobile) sunIconMobile.classList.remove('hidden');
        if (moonIconMobile) moonIconMobile.classList.add('hidden');
    } else {
        if (sunIcon) sunIcon.classList.add('hidden');
        if (moonIcon) moonIcon.classList.remove('hidden');
        if (sunIconMobile) sunIconMobile.classList.add('hidden');
        if (moonIconMobile) moonIconMobile.classList.remove('hidden');
    }

    // specific to news.html older implementation (if still there)
    const newsSun = document.getElementById('sun-icon');
    const newsMoon = document.getElementById('moon-icon');
    if (newsSun && newsMoon) {
        if (theme === 'dark') {
            newsSun.classList.remove('scale-0', 'opacity-0');
            newsSun.classList.add('scale-100', 'opacity-100');
            newsMoon.classList.remove('scale-100', 'opacity-100');
            newsMoon.classList.add('scale-0', 'opacity-0');
        } else {
            newsSun.classList.remove('scale-100', 'opacity-100');
            newsSun.classList.add('scale-0', 'opacity-0');
            newsMoon.classList.remove('scale-0', 'opacity-0');
            newsMoon.classList.add('scale-100', 'opacity-100');
        }
    }
}

// Mobile Menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('mobile-menu-overlay');
    if (!menu || !overlay) return;

    if (menu.classList.contains('translate-x-full')) {
        menu.classList.remove('hidden');
        overlay.classList.remove('hidden');
        // Force reflow
        void menu.offsetWidth;
        menu.classList.remove('translate-x-full');
        menu.classList.add('translate-x-0');
        overlay.classList.remove('opacity-0');
        overlay.classList.add('opacity-100');
        document.body.style.overflow = 'hidden';
    } else {
        menu.classList.remove('translate-x-0');
        menu.classList.add('translate-x-full');
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0');
        document.body.style.overflow = '';
        setTimeout(() => {
            menu.classList.add('hidden');
            overlay.classList.add('hidden');
        }, 500); // match transition duration
    }
}

// View switching (for home.html)
function switchView(viewId) {
    if (viewId === 'view-krok') {
        const viewS = document.getElementById('view-specialty');
        if(viewS) {
            viewS.classList.add('hidden');
            viewS.classList.remove('animate-in', 'fade-in');
        }
        
        const viewK = document.getElementById('view-krok');
        if(viewK) {
            viewK.classList.remove('hidden');
            // Force reflow
            void viewK.offsetWidth;
            viewK.classList.add('animate-in', 'fade-in');
        }
    } else if (viewId === 'view-specialty') {
        const viewK = document.getElementById('view-krok');
        if(viewK) {
            viewK.classList.add('hidden');
            viewK.classList.remove('animate-in', 'fade-in');
        }

        const viewS = document.getElementById('view-specialty');
        if(viewS) {
            viewS.classList.remove('hidden');
            // Force reflow
            void viewS.offsetWidth;
            viewS.classList.add('animate-in', 'fade-in');
        }
    }
}

function handleKrokClick(step) {
    if (step === 3) {
        switchView('view-specialty');
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadFavorites();
});


// Author Toggle
function toggleAuthor(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('author-dropdown');
    if (dropdown) dropdown.classList.toggle('active');
}
document.addEventListener('click', function (e) {
    const dropdown = document.getElementById('author-dropdown');
    if (dropdown && dropdown.classList.contains('active') && !e.target.closest('.author-container')) {
        dropdown.classList.remove('active');
    }
});

// Favorites System
function loadFavorites() {
    const favs = JSON.parse(localStorage.getItem('invictus_favorite_pages') || '[]');
    const section = document.getElementById('favorites-section');
    const container = document.getElementById('favorites-container');

    if (favs.length === 0) {
        if (section) section.classList.add('hidden');
        return;
    }

    if (section) section.classList.remove('hidden');
    if (container) {
        container.innerHTML = '';
        favs.forEach(fav => {
            container.innerHTML += `
                <a href="${fav.url}" class="glass-card p-4 rounded-[1.2rem] flex flex-col justify-center items-center group relative overflow-hidden h-[80px] border transition-all hover:-translate-y-1 hover:shadow-xl" style="border-color: var(--border-color);">
                    <div class="absolute inset-0 bg-gradient-to-br from-[var(--accent-color)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <h3 class="font-fredoka text-sm text-center relative z-10 transition-colors drop-shadow-sm" style="color: var(--text-main);">${fav.title}</h3>
                    <button onclick="removeFavorite(event, '${fav.url}')" class="absolute top-2 right-2 text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity z-20" style="color: var(--text-dim);">&times;</button>
                </a>
            `;
        });
    }
}

function removeFavorite(event, url) {
    event.preventDefault();
    event.stopPropagation();
    let favs = JSON.parse(localStorage.getItem('invictus_favorite_pages') || '[]');
    favs = favs.filter(f => f.url !== url);
    localStorage.setItem('invictus_favorite_pages', JSON.stringify(favs));
    loadFavorites();
}

function toggleFavoritePage(url, title) {
    let favs = JSON.parse(localStorage.getItem('invictus_favorite_pages') || '[]');
    const exists = favs.find(f => f.url === url);
    if (exists) {
        favs = favs.filter(f => f.url !== url);
    } else {
        if (favs.length >= 10) { alert('Максимум 10 віджетів!'); return; }
        favs.push({ url, title });
    }
    localStorage.setItem('invictus_favorite_pages', JSON.stringify(favs));
    updateFavoriteStar(url);
}

function updateFavoriteStar(url) {
    let favs = JSON.parse(localStorage.getItem('invictus_favorite_pages') || '[]');
    const btn = document.getElementById('btn-favorite-page');
    if (!btn) return;
    if (favs.find(f => f.url === url)) {
        btn.innerText = '★'; btn.style.color = 'var(--accent-color)';
        btn.classList.add('pulse-correct'); setTimeout(() => btn.classList.remove('pulse-correct'), 1000);
    } else {
        btn.innerText = '☆'; btn.style.color = 'var(--text-dim)';
    }
}

// Ensure loadFavorites is called
const origDOMContentLoaded = "document.addEventListener('DOMContentLoaded', () => {\n    initTheme();\n});";
const newDOMContentLoaded = "document.addEventListener('DOMContentLoaded', () => {\n    initTheme();\n    loadFavorites();\n});";
