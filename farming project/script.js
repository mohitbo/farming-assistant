// --- START OF JAVASCRIPT ---


// --- UTILITY FUNCTIONS ---
function createElements(container, className, count, callback) {
    if (!container) return;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.className = className;
        if (callback) callback(el, i);
        fragment.appendChild(el);
    }
    container.appendChild(fragment);
}

function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
}

// --- ANIMATIONS ---
function createLeaves() {
    const container = document.getElementById('leafContainer');
    createElements(container, 'leaf', 30, leaf => {
        leaf.style.left = Math.random() * 100 + '%';
        leaf.style.animationDelay = Math.random() * 10 + 's';
        leaf.style.animationDuration = (Math.random() * 5 + 15) + 's';
    });
}

function createGrass() {
    const container = document.getElementById('grassContainer');
    createElements(container, 'grass-blade', 100, (grass, i) => {
        grass.style.left = Math.random() * 100 + '%';
        grass.style.animationDelay = (i * 0.1) + 's';
        grass.style.animationDuration = (Math.random() * 5 + 15) + 's';
    });
}

function createRainDrops() {
    let container = document.getElementById('rainDrops');
    if (!container) {
        container = document.createElement('div');
        container.id = 'rainDrops';
        container.className = 'rain-drops';
        document.body.appendChild(container);
    }
    container.innerHTML = '';
    createElements(container, 'rain-drop', 80, drop => {
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDelay = Math.random() * 2 + 's';
        drop.style.animationDuration = (Math.random() * 0.8 + 1) + 's';
    });
}

// --- DAY/NIGHT CYCLE ---
let isDay = true;
let dayNightInterval;

function toggleDayNight() {
    const body = document.body;
    const sun = document.getElementById('sun');
    const moon = document.getElementById('moon');
    const rain = document.getElementById('rainDrops');
    const toggleBtn = document.getElementById('dayNightToggle');

    if (isDay) {
        body.classList.replace('day', 'night');
        sun.style.opacity = 0;
        moon.style.opacity = 1;
        toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';

        if (Math.random() > 0.5 && rain) rain.classList.add('active');
        else if (rain) rain.classList.remove('active');

        showToast("Night 🌙");
    } else {
        body.classList.replace('night', 'day');
        sun.style.opacity = 1;
        moon.style.opacity = 0;
        toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        if (rain) rain.classList.remove('active');
        showToast("Day ☀️");
    }
    isDay = !isDay;
}

function startAutomaticDayNightCycle(interval = 30000) {
    if (dayNightInterval) clearInterval(dayNightInterval);
    dayNightInterval = setInterval(toggleDayNight, interval);
    showToast(`Auto day/night started (${interval / 1000}s)`);
}

function stopAutomaticDayNightCycle() {
    if (dayNightInterval) {
        clearInterval(dayNightInterval);
        dayNightInterval = null;
        showToast('Auto day/night stopped');
    }
}

// --- PAGE NAVIGATION ---
let currentPage = 'login';
const pageHistory = [];

function showPage(pageId) {
    const oldPage = document.getElementById(currentPage + '-page');
    if (oldPage) oldPage.classList.remove('active');

    if (currentPage !== pageId) pageHistory.push(currentPage);

    const newPage = document.getElementById(pageId + '-page');
    if (newPage) newPage.classList.add('active');

    currentPage = pageId;

    const backBtn = document.getElementById('backButton');
    const toggleBtn = document.getElementById('dayNightToggle');
    const isLogin = pageId === 'login';
    if (backBtn) backBtn.style.display = isLogin ? 'none' : 'flex';
    if (toggleBtn) toggleBtn.style.display = isLogin ? 'none' : 'flex';
}

function goBack() {
    if (pageHistory.length > 0) showPage(pageHistory.pop());
}

// --- MOCK LOGIN & PROFILE ---
function submitPhone() {
    const phone = document.getElementById('phone-input')?.value;
    if (phone && phone.length === 10) {
        showToast(`OTP sent to ${phone}`);
        setTimeout(() => showPage('otp'), 500);
    } else showToast('Enter valid 10-digit number');
}

function verifyOTP() {
    const otp = document.getElementById('otp-input')?.value;
    if (otp && otp.length === 6) {
        showToast('OTP verified!');
        setTimeout(() => showPage('profile'), 500);
    } else showToast('Enter valid 6-digit OTP');
}

function submitProfile() {
    const name = document.getElementById('farmer-name')?.value;
    const location = document.getElementById('farm-location')?.value;
    if (name && location) {
        showToast('Profile saved!');
        document.getElementById('farmer-name-display').textContent = name;
        document.getElementById('farm-location-display').textContent = location;
        localStorage.setItem('farmerName', name);
        localStorage.setItem('farmLocation', location);
        setTimeout(() => showPage('home'), 500);
    } else showToast('Fill all fields');
}

// --- CHAT ---
function sendMessage() {
    const input = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');
    const text = input?.value.trim();
    if (!text) return;

    const userMsg = document.createElement('div');
    userMsg.className = 'message user-message';
    userMsg.innerHTML = `
        <div class="message-avatar"><i class="fas fa-user"></i></div>
        <div class="message-content"><p>${text}</p></div>
        <div class="message-time">Just now</div>`;
    messages.appendChild(userMsg);

    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'message bot-message';
        botMsg.innerHTML = `
            <div class="message-avatar"><i class="fas fa-robot"></i></div>
            <div class="message-content"><p>Thanks for asking about "${text}". I’ll assist you!</p></div>
            <div class="message-time">Just now</div>`;
        messages.appendChild(botMsg);
        messages.scrollTop = messages.scrollHeight;
    }, 1000);

    input.value = '';
    messages.scrollTop = messages.scrollHeight;
}

function startVoiceInput() {
    showToast('Voice input coming soon!');
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Sun & Moon
    ['sun', 'moon'].forEach(id => {
        const el = document.createElement('div');
        el.id = id;
        el.className = id;
        el.style.opacity = id === 'sun' ? 1 : 0;
        document.body.appendChild(el);
    });

    // Day/Night toggle button
    const toggleBtn = document.createElement('div');
    toggleBtn.id = 'dayNightToggle';
    toggleBtn.className = 'back-button';
    toggleBtn.style.right = '90px';
    toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    toggleBtn.onclick = toggleDayNight;
    toggleBtn.style.display = 'none';
    document.body.appendChild(toggleBtn);

    // Initialize animations
    createLeaves();
    createGrass();
    createRainDrops();

    // Chat input enter
    document.getElementById('chatInput')?.addEventListener('keypress', e => {
        if (e.key === 'Enter') sendMessage();
    });

    // Restore profile
    const storedName = localStorage.getItem('farmerName');
    const storedLocation = localStorage.getItem('farmLocation');
    if (storedName && storedLocation) {
        document.getElementById('farmer-name-display').textContent = storedName;
        document.getElementById('farm-location-display').textContent = storedLocation;
    }

    // Start automatic day/night cycle
    startAutomaticDayNightCycle(30000);
});

// --- PAGE SHORTCUTS ---
const showPhonePage = () => showPage('phone');
const showHomePage = () => showPage('home');
const showChatPage = () => showPage('chat');
const showWeatherPage = () => showToast('Weather coming soon!');
const showActivityPage = () => showToast('Activity logs coming soon!');
const showInsightsPage = () => showToast('AI insights coming soon!');
const showSoilPage = () => showToast('Soil analysis coming soon!');
const showIrrigationPage = () => showToast('Irrigation management coming soon!');
const showRemindersPage = () => showToast('Reminders coming soon!');
const showYieldPredictionPage = () => showToast('Yield prediction coming soon!');
