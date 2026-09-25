
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
        <div class="nepali-widget-top">
            <div class="nepali-drag-handle" aria-label="Drag widget"><i class="fas fa-grip-lines"></i></div>
            <button class="nepali-close-toggle" type="button" aria-label="Close Nepal date and time">×</button>
        </div>
        <div class="nepali-clock-meta">
            <span class="nepali-clock-label">नेपाल समय</span>
            <div class="nepali-widget-actions">
                <button class="nepali-calendar-toggle" type="button" aria-expanded="false">english calendar</button>
                <button class="nepali-hide-toggle" type="button" aria-label="Hide Nepal date and time">Hide</button>
            </div>
        </div>
        <div class="nepali-clock-value" aria-live="polite">Loading...</div>
        <div class="nepali-calendar-panel" hidden></div>
    `;
    document.body.appendChild(clock);

    const dragHandle = clock.querySelector('.nepali-drag-handle');
    const valueNode = clock.querySelector('.nepali-clock-value');
    const calendarToggle = clock.querySelector('.nepali-calendar-toggle');
    const calendarPanel = clock.querySelector('.nepali-calendar-panel');
    const hideToggle = clock.querySelector('.nepali-hide-toggle');
    const closeToggle = clock.querySelector('.nepali-close-toggle');

    const updateCalendar = () => {
        const currentDate = new Date();
        const englishDate = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Kathmandu',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(currentDate);

        if (calendarPanel) {
            calendarPanel.textContent = englishDate;
        }
    };

    const updateClock = () => {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Kathmandu',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        const nepaliTime = formatter.format(new Date());

        if (valueNode) {
            valueNode.textContent = nepaliTime;
        }

        updateCalendar();
    };

    const setCollapsed = (collapsed) => {
        clock.classList.toggle('collapsed', collapsed);
        if (hideToggle) {
            hideToggle.textContent = collapsed ? 'Show' : 'Hide';
            hideToggle.setAttribute('aria-label', collapsed ? 'Show Nepal date and time' : 'Hide Nepal date and time');
        }
    };

    if (calendarToggle && calendarPanel) {
        calendarToggle.onclick = () => {
            const isHidden = calendarPanel.hasAttribute('hidden');
            calendarPanel.toggleAttribute('hidden', !isHidden);
            calendarToggle.setAttribute('aria-expanded', String(isHidden));
            calendarToggle.classList.toggle('active', isHidden);
        };
    }

    if (hideToggle) {
        hideToggle.onclick = () => {
            const isCollapsed = clock.classList.contains('collapsed');
            setCollapsed(!isCollapsed);
        };
    }

    if (closeToggle) {
        closeToggle.onclick = () => {
            clock.style.display = 'none';

            let reopenButton = document.getElementById('nepali-time-reopen');
            if (!reopenButton) {
                reopenButton = document.createElement('button');
                reopenButton.id = 'nepali-time-reopen';
                reopenButton.type = 'button';
                reopenButton.innerHTML = '<i class="fas fa-clock"></i>';
                reopenButton.setAttribute('aria-label', 'Show Nepal date and time');
                document.body.appendChild(reopenButton);

                reopenButton.onclick = () => {
                    clock.style.display = 'flex';
                    reopenButton.remove();
                };
            }
        };
    }

    const initDrag = () => {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        const move = (clientX, clientY) => {
            const maxX = window.innerWidth - clock.offsetWidth;
            const maxY = window.innerHeight - clock.offsetHeight;
            const nextX = Math.min(Math.max(clientX - offsetX, 10), Math.max(maxX, 10));
            const nextY = Math.min(Math.max(clientY - offsetY, 10), Math.max(maxY, 10));
            clock.style.left = `${nextX}px`;
            clock.style.top = `${nextY}px`;
            clock.style.right = 'auto';
            clock.style.bottom = 'auto';
        };

        const startDrag = (event) => {
            if (event.target.closest('button')) return;
            isDragging = true;
            const rect = clock.getBoundingClientRect();
            const pointX = event.clientX ?? event.touches?.[0]?.clientX ?? rect.left;
            const pointY = event.clientY ?? event.touches?.[0]?.clientY ?? rect.top;
            offsetX = pointX - rect.left;
            offsetY = pointY - rect.top;
            clock.style.transition = 'none';
        };

        const endDrag = () => {
            isDragging = false;
            clock.style.transition = '';
        };

        const onMove = (event) => {
            if (!isDragging) return;
            const pointX = event.clientX ?? event.touches?.[0]?.clientX;
            const pointY = event.clientY ?? event.touches?.[0]?.clientY;
            if (typeof pointX === 'number' && typeof pointY === 'number') {
                move(pointX, pointY);
            }
        };

        dragHandle?.addEventListener('pointerdown', startDrag);
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', endDrag);
        window.addEventListener('pointercancel', endDrag);
        window.addEventListener('touchmove', onMove, { passive: true });
        window.addEventListener('touchend', endDrag, { passive: true });
    };

    initDrag();
    setCollapsed(false);
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