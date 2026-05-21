
                        const specialties = [
                            "╨Т╨╜╤Г╤В╤А╤Ц╤И╨╜╤Ц ╤Е╨▓╨╛╤А╨╛╨▒╨╕", "╨Р╨║╤Г╤И╨╡╤А╤Б╤В╨▓╨╛ ╤В╨░ ╨│╤Ц╨╜╨╡╨║╨╛╨╗╨╛╨│╤Ц╤П", "╨е╤Ц╤А╤Г╤А╨│╤Ц╤П",
                            "╨Р╨╜╨╡╤Б╤В╨╡╨╖╤Ц╨╛╨╗╨╛╨│╤Ц╤П ╤В╨░ ╤Ц╨╜╤В╨╡╨╜╤Б╨╕╨▓╨╜╨░ ╤В╨╡╤А╨░╨┐╤Ц╤П", "╨Ь╨╡╨┤╨╕╤Ж╨╕╨╜╨░ ╨╜╨╡╨▓╤Ц╨┤╨║╨╗╨░╨┤╨╜╨╕╤Е ╤Б╤В╨░╨╜╤Ц╨▓",
                            "╨Я╤Б╨╕╤Е╤Ц╨░╤В╤А╤Ц╤П", "╨Э╨╡╨▓╤А╨╛╨╗╨╛╨│╤Ц╤П", "╨Ж╨╜╤Д╨╡╨║╤Ж╤Ц╨╣╨╜╤Ц ╤Е╨▓╨╛╤А╨╛╨▒╨╕", "╨Ю╤А╤В╨╛╨┐╨╡╨┤╤Ц╤П ╤Ц ╤В╤А╨░╨▓╨╝╨░╤В╨╛╨╗╨╛╨│╤Ц╤П",
                            "╨Ю╤В╨╛╨╗╨░╤А╨╕╨╜╨│╨╛╨╗╨╛╨│╤Ц╤П", "╨Ф╨╡╤А╨╝╨░╤В╨╛╨▓╨╡╨╜╨╡╤А╨╛╨╗╨╛╨│╤Ц╤П", "╨а╨░╨┤╤Ц╨╛╨╗╨╛╨│╤Ц╤П",
                            "╨Ф╨╕╤В╤П╤З╨░ ╤Е╤Ц╤А╤Г╤А╨│╤Ц╤П", "╨Х╨┐╤Ц╨┤╨╡╨╝╤Ц╨╛╨╗╨╛╨│╤Ц╤П", "╨Ь╨╡╨┤╨╕╤З╨╜╨░ ╨┐╤Б╨╕╤Е╨╛╨╗╨╛╨│╤Ц╤П", "╨Я╨░╤В╨╛╨╗╨╛╨│╤Ц╤З╨╜╨░ ╨░╨╜╨░╤В╨╛╨╝╤Ц╤П",
                            "╨д╤Ц╨╖╨╕╤З╨╜╨░ ╤В╨░ ╤А╨╡╨░╨▒╤Ц╨╗╤Ц╤В╨░╤Ж╤Ц╨╣╨╜╨░ ╨╝╨╡╨┤╨╕╤Ж╨╕╨╜╨░", "╨б╤В╨╛╨╝╨░╤В╨╛╨╗╨╛╨│╤Ц╤П",
                            "╨Ы╨░╨▒╨╛╤А╨░╤В╨╛╤А╨╜╨░ ╨┤╤Ц╨░╨│╨╜╨╛╤Б╤В╨╕╨║╨░, ╨▓╤Ц╤А╤Г╤Б╨╛╨╗╨╛╨│╤Ц╤П, ╨╝╤Ц╨║╤А╨╛╨▒╤Ц╨╛╨╗╨╛╨│╤Ц╤П"
                        ];

                        specialties.forEach(spec => {
                            document.write(`
                                <div class="module-card p-5 rounded-2xl opacity-60 flex flex-col justify-between h-[120px] relative overflow-hidden">
                                    <div class="relative z-10 pr-6">
                                        <p class="text-[8px] font-black uppercase tracking-widest mb-1" style="color: var(--text-dim);">╨Ю╤З╤Ц╨║╤Г╤Ф╤В╤М╤Б╤П</p>
                                        <h3 class="text-sm font-bold leading-tight" style="color: var(--text-dim);">${spec}</h3>
                                    </div>
                                    <div class="ribbon-wrapper opacity-50 filter grayscale"><div class="ribbon">╨Т ╤А╨╛╨╖╤А╨╛╨▒╤Ж╤Ц</div></div>
                                </div>
                            `);
                        });
                    

        // ╨Ж╨╜╤Ц╤Ж╤Ц╨░╨╗╤Ц╨╖╨░╤Ж╤Ц╤П ╤В╨╡╨╝╨╕
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
            const lightIcon = document.getElementById('theme-icon-light');
            const darkIcon = document.getElementById('theme-icon-dark');
            const lightIconMobile = document.getElementById('theme-icon-light-mobile');
            const darkIconMobile = document.getElementById('theme-icon-dark-mobile');

            if (lightIcon && darkIcon) {
                if (theme === 'dark') {
                    lightIcon.classList.remove('hidden');
                    darkIcon.classList.add('hidden');
                    if (lightIconMobile) lightIconMobile.classList.remove('hidden');
                    if (darkIconMobile) darkIconMobile.classList.add('hidden');
                } else {
                    lightIcon.classList.add('hidden');
                    darkIcon.classList.remove('hidden');
                    if (lightIconMobile) lightIconMobile.classList.add('hidden');
                    if (darkIconMobile) darkIconMobile.classList.remove('hidden');
                }
            }
        }

        function toggleMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            const overlay = document.getElementById('mobile-menu-overlay');
            if (menu.classList.contains('hidden')) {
                menu.classList.remove('hidden');
                overlay.classList.remove('hidden');
                setTimeout(() => {
                    menu.classList.remove('translate-x-full');
                    menu.classList.add('translate-x-0');
                    overlay.classList.remove('opacity-0');
                    overlay.classList.add('opacity-100');
                }, 10);
            } else {
                menu.classList.remove('translate-x-0');
                menu.classList.add('translate-x-full');
                overlay.classList.remove('opacity-100');
                overlay.classList.add('opacity-0');
                setTimeout(() => {
                    menu.classList.add('hidden');
                    overlay.classList.add('hidden');
                }, 500);
            }
        }

        // ╨Ч╨░╨┐╤Г╤Б╨║ ╨┐╤А╨╕ ╨╖╨░╨▓╨░╨╜╤В╨░╨╢╨╡╨╜╤Б╤В╤Ц
        document.addEventListener('DOMContentLoaded', initTheme);
        // ╨Ч╨░╨┐╤Г╤Б╨║╨░╤Ф╨╝╨╛ ╨▓╤Ц╨┤╤А╨░╨╖╤Г, ╤Й╨╛╨▒ ╤Г╨╜╨╕╨║╨╜╤Г╤В╨╕ ╨▒╨╗╨╕╨╝╨░╨╜╨╜╤П
        initTheme();

        // ╨д╤Г╨╜╨║╤Ж╤Ц╤П ╨┤╨╗╤П ╨╝╨╛╨▒╤Ц╨╗╤М╨╜╨╛╨│╨╛ ╨║╨╗╤Ц╨║╤Г ╨┐╨╛ ╨░╨▓╤В╨╛╤А╤Г
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

        // ╨Ы╨Ю╨У╨Ж╨Ъ╨Р ╨г╨Ы╨о╨С╨Ы╨Х╨Э╨Ю╨У╨Ю (╨Т╨Ж╨Ф╨Ц╨Х╨в╨Ш)
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

        // ╨Ч╨░╨┐╤Г╤Б╨║ ╨┐╤А╨╕ ╨╖╨░╨▓╨░╨╜╤В╨░╨╢╨╡╨╜╤Б╤В╤Ц
        document.addEventListener('DOMContentLoaded', () => {
            initTheme();
            loadFavorites();
        });

        function switchView(viewId) {
            document.getElementById('view-krok').classList.add('hidden');
            document.getElementById('view-specialty').classList.add('hidden');
            const target = document.getElementById(viewId);
            if (target) {
                target.classList.remove('hidden');
            }
        }

        let selectedKrokTarget = null;

        function handleKrokClick(krokLevel) {
            selectedKrokTarget = krokLevel;
            const hasAccepted = localStorage.getItem('disclaimerAccepted');

            if (!hasAccepted) {
                showDisclaimer();
            } else {
                proceedToKrok();
            }
        }

        function showDisclaimer() {
            const modal = document.getElementById('disclaimer-modal');
            const content = document.getElementById('disclaimer-content');
            modal.classList.remove('hidden');
            modal.classList.add('flex');

            setTimeout(() => {
                content.classList.remove('scale-95', 'opacity-0');
                content.classList.add('scale-100', 'opacity-100');
            }, 10);
        }

        function acceptDisclaimer() {
            localStorage.setItem('disclaimerAccepted', 'true');
            const modal = document.getElementById('disclaimer-modal');
            const content = document.getElementById('disclaimer-content');

            content.classList.remove('scale-100', 'opacity-100');
            content.classList.add('scale-95', 'opacity-0');

            setTimeout(() => {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
                proceedToKrok();
            }, 300);
        }

        function proceedToKrok() {
            if (selectedKrokTarget === 3) {
                switchView('view-specialty');
            } else {
                alert(`╨Т╨╕╨▒╨░╤З╤В╨╡, ╤А╨╛╨╖╨┤╤Ц╨╗ "╨Ъ╤А╨╛╨║ ${selectedKrokTarget}" ╤Й╨╡ ╨╖╨╜╨░╤Е╨╛╨┤╨╕╤В╤М╤Б╤П ╨▓ ╤А╨╛╨╖╤А╨╛╨▒╤Ж╤Ц!`);
            }
        }
    