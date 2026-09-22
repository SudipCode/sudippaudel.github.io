
const dayNightMenu = document.querySelector('#menu-bars');
const dayNightHeader = document.querySelector('header');

if (dayNightMenu && dayNightHeader) {
    dayNightMenu.onclick = () =>{
        dayNightMenu.classList.toggle('fa-times');
        dayNightHeader.classList.toggle('active');
    };
}

window.onscroll = () =>{
    if (dayNightMenu && dayNightHeader) {
        dayNightMenu.classList.remove('fa-times');
        dayNightHeader.classList.remove('active');
    }
}

const themePanel = document.querySelector('#theme-panel');
const themeToggler = document.querySelector('#theme-toggler');
const dayNightToggle = document.querySelector('#day-night-toggle');
const themeButtons = document.querySelectorAll('.theme-option');

const setTheme = (themeName) => {
    document.body.classList.remove('theme-red', 'theme-yellow', 'theme-green', 'theme-teal');
    document.body.classList.add(`theme-${themeName}`);
    localStorage.setItem('siteTheme', themeName);
    themeButtons.forEach((button) => {
        const isActive = button.dataset.theme === themeName;
        button.classList.toggle('active', isActive);
    });

    if (window.updateParticleTheme) {
        window.updateParticleTheme();
    }
};

const savedTheme = localStorage.getItem('siteTheme') || 'teal';
setTheme(savedTheme);

if (themeToggler) {
    themeToggler.onclick = () => {
        themePanel.classList.toggle('open');
    };
}

if (dayNightToggle) {
    const updateDayNightIcon = () => {
        const isNight = document.body.classList.contains('active');
        dayNightToggle.innerHTML = isNight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    };

    const savedMode = localStorage.getItem('siteMode');
    if (savedMode === 'night') {
        document.body.classList.add('active');
    }
    updateDayNightIcon();

    dayNightToggle.onclick = () => {
        document.body.classList.toggle('active');
        const isNight = document.body.classList.contains('active');
        localStorage.setItem('siteMode', isNight ? 'night' : 'day');
        updateDayNightIcon();
    };
}

themeButtons.forEach((button) => {
    button.onclick = () => {
        setTheme(button.dataset.theme);
        themePanel.classList.remove('open');
    };
});