
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

const initNepaliClock = () => {
    const existingClock = document.getElementById('nepali-time-widget');
    if (existingClock) {
        return;
    }

    const clock = document.createElement('div');
    clock.id = 'nepali-time-widget';
    clock.innerHTML = `
        <div class="nepali-clock-meta">
            <span class="nepali-clock-label">नेपाल समय</span>
            <button class="nepali-calendar-toggle" type="button" aria-expanded="false">Nepali Calendar</button>
        </div>
        <div class="nepali-clock-value" aria-live="polite">Loading...</div>
        <div class="nepali-calendar-panel" hidden></div>
    `;
    document.body.appendChild(clock);

    const valueNode = clock.querySelector('.nepali-clock-value');
    const calendarToggle = clock.querySelector('.nepali-calendar-toggle');
    const calendarPanel = clock.querySelector('.nepali-calendar-panel');

    const updateCalendar = () => {
        const nepalDate = new Intl.DateTimeFormat('en-US-u-ca-nepali', {
            timeZone: 'Asia/Kathmandu',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date());

        if (calendarPanel) {
            calendarPanel.textContent = nepalDate;
        }
    };

    const updateClock = () => {
        const formatter = new Intl.DateTimeFormat('en-NP', {
            timeZone: 'Asia/Kathmandu',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        if (valueNode) {
            valueNode.textContent = formatter.format(new Date());
        }

        updateCalendar();
    };

    if (calendarToggle && calendarPanel) {
        calendarToggle.onclick = () => {
            const isHidden = calendarPanel.hasAttribute('hidden');
            calendarPanel.toggleAttribute('hidden', !isHidden);
            calendarToggle.setAttribute('aria-expanded', String(isHidden));
            calendarToggle.classList.toggle('active', isHidden);
        };
    }

    updateClock();
    setInterval(updateClock, 1000);
};

initNepaliClock();

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