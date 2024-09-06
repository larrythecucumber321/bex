function initDarkMode() {
    console.log('Dark mode initialized');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;

    // Check for saved theme preference or use system preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
        console.log('Dark mode applied on initialization');
    } else {
        htmlElement.classList.remove('dark');
        console.log('Light mode applied on initialization');
    }

    // Toggle dark mode
    darkModeToggle.addEventListener('click', () => {
        console.log('Dark mode toggle clicked');
        htmlElement.classList.toggle('dark');
        
        // Save theme preference
        if (htmlElement.classList.contains('dark')) {
            localStorage.theme = 'dark';
            console.log('Dark mode activated and saved');
        } else {
            localStorage.theme = 'light';
            console.log('Light mode activated and saved');
        }
    });
}

document.addEventListener('DOMContentLoaded', initDarkMode);
