class ThemeToggle extends HTMLElement {
    connectedCallback() {
        // HTML component for theme toggle dropdown
        this.innerHTML = `
            <select class= "theme-toggle" style="padding: 5px; border-radius: 5px; border: 1px solid #ccc;">
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
            </select>
        `;
        const select = this.querySelector('theme-toggle');

        // Swapping themes
        const applyTheme = (theme) => {
            if (theme === 'system') {
                const systemdark = window.matchMedia('(prefers-color-scheme: dark)').matches; // Gets system theme
                document.documentElement.setAttribute('data-theme', systemdark ? 'dark' : 'light'); // Puts systhem theme
            } else {
                document.documentElement.setAttribute('data-theme', theme); // If no system theme, puts selected theme
            }
        }

        // Getting previously saved theme from LocalStorage and putting it to default theme
        const savedTheme = localStorage.getItem('theme') || 'system'; // Gets saved theme locally or defaults to system theme
        applyTheme(savedTheme);
        select.value = savedTheme; // Puts saved theme to the dropdown in UI

        // Listening for any change in the theme
        selectEL.addEventListener('change', (event) => {
            const changeTheme = event.target.value; // Gets the selected theme from the dropdown
            localStorage.setItem('theme', changeTheme);
            applyTheme(changeTheme);
        });

        // Listening for system theme changes instantaneously
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
            const savedTheme = localStorage.getItem('Theme') || 'system';
            if (savedTheme === 'system') {
                applyTheme(event.matches ? 'dark' : 'light');
            }
        });
    }
}