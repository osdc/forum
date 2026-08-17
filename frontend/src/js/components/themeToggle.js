class ThemeToggle extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <select class="theme-toggle" style="padding: 5px; border-radius: 5px; border: 1px solid #ccc;">
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
                <option value="system">System</option>
            </select>
        `;

        const select = this.querySelector('.theme-toggle'); // fixed: class selector, not tag selector

        const applyTheme = (theme) => {
            if (theme === 'system') {
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.setAttribute('data-theme', systemDark ? 'dark' : 'light');
            } else {
                document.documentElement.setAttribute('data-theme', theme);
            }
        };

        const getSavedTheme = () => {
            try {
                return localStorage.getItem('theme') || 'system';
            } catch {
                return 'system'; // localStorage unavailable (e.g. private browsing)
            }
        };

        const setSavedTheme = (theme) => {
            try {
                localStorage.setItem('theme', theme);
            } catch {
                // ignore — theme just won't persist this session
            }
        };

        const savedTheme = getSavedTheme();
        applyTheme(savedTheme);
        select.value = savedTheme; // now guaranteed to match an <option>, since 'system' exists

        select.addEventListener('change', (event) => { // fixed: was undefined `selectEL`
            const changeTheme = event.target.value;
            setSavedTheme(changeTheme);
            applyTheme(changeTheme);
        });

        this._mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this._mediaListener = (event) => {
            if (getSavedTheme() === 'system') { // fixed: 'theme' not 'Theme'
                applyTheme(event.matches ? 'dark' : 'light');
            }
        };
        this._mediaQuery.addEventListener('change', this._mediaListener);
    }

    disconnectedCallback() {
        // fixed: avoid leaking/duplicating listeners if reconnected
        this._mediaQuery?.removeEventListener('change', this._mediaListener);
    }
}

customElements.define('theme-toggle', ThemeToggle);