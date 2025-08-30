// ------------------- Show Main App Page -------------------
function showAppPage() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('phone-page').style.display = 'none';
    document.getElementById('otp-page').style.display = 'none';
    document.getElementById('profile-page').style.display = 'none';
    document.getElementById('app-page').style.display = 'block';
    document.querySelector('.container').classList.add('white-bg');

    // Load profile if exists
    const savedProfile = JSON.parse(localStorage.getItem('farmerProfile'));
    if (savedProfile) {
        document.querySelector('.profile-name').textContent = savedProfile.name || "Farmer";
        document.querySelector('.detail-value:nth-child(2)').textContent = savedProfile.location;
        document.querySelector('.detail-value:nth-child(4)').textContent = savedProfile.crop;
        document.querySelector('.detail-value:nth-child(6)').textContent = savedProfile.soil;
    }
}

// ------------------- Login Functions -------------------
function login() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('phone-page').style.display = 'block';
}

function submitPhone() {
    const phoneNumber = document.getElementById('phone-input').value;
    if (phoneNumber && phoneNumber.length === 10) {
        alert("OTP has been sent to your phone number");
        document.getElementById('phone-page').style.display = 'none';
        document.getElementById('otp-page').style.display = 'block';
    } else {
        alert("Please enter a valid 10-digit phone number");
    }
}

function verifyOTP() {
    const otp = document.getElementById('otp-input').value;
    if (otp && otp.length === 6) {
        // Hide OTP page and show Profile page
        document.getElementById('otp-page').style.display = 'none';
        document.getElementById('profile-page').style.display = 'block';
    } else {
        alert("Please enter a valid 6-digit OTP");
    }
}

function submitProfile() {
    const profile = {
        name: document.getElementById('farmer-name').value,
        location: document.getElementById('farm-location').value,
        landSize: document.getElementById('land-size').value,
        crop: document.getElementById('crop-type').value,
        soil: document.getElementById('soil-type').value,
        irrigation: document.getElementById('irrigation-type').value
    };

    if (!profile.location || !profile.landSize || !profile.crop || !profile.soil || !profile.irrigation) {
        alert("Please fill all fields");
        return;
    }

    localStorage.setItem('farmerProfile', JSON.stringify(profile));

    alert("Profile saved! Welcome " + profile.name);

    // Hide profile page and show app page
    document.getElementById('profile-page').style.display = 'none';
    showAppPage();
}

// ------------------- Guest Mode -------------------
function enterGuestMode() {
    showAppPage();
}

// ------------------- Navigation -------------------
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        this.classList.add('active');

        // Change header text based on navigation
        const pageTitle = this.querySelector('div:last-child').textContent;
        document.querySelector('.header').textContent = pageTitle;
    });
});

// ------------------- Share Button -------------------
document.querySelector('.share-btn').addEventListener('click', function() {
    alert('Sharing farming assistant app with others!');
});

// ------------------- Menu Item Clicks -------------------
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function() {
        const menuText = this.querySelector('div:last-child').textContent;
        alert(`Opening: ${menuText}`);
    });
});

// ----------------- Voice Input -----------------
function startVoiceInput() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'hi-IN'; // Hindi, change to 'ml-IN' for Malayalam
    recognition.start();

    recognition.onresult = function(event) {
        const speechResult = event.results[0][0].transcript;
        document.getElementById('chat-input').value = speechResult;
        sendMessage();
    };

    recognition.onerror = function(event) {
        alert("Voice recognition error: " + event.error);
    };
}

// ----------------- Send Message to GPT in Chat Section -----------------
async function sendMessage() {
    const inputField = document.getElementById('chat-input');
    const userMessage = inputField.value.trim();
    if (!userMessage) return;

    const chatOutput = document.getElementById('chat-output');
    chatOutput.innerHTML += `<div><b>You:</b> ${userMessage}</div>`;
    inputField.value = '';
    chatOutput.scrollTop = chatOutput.scrollHeight;

    // Call OpenAI GPT-3.5 API
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userMessage }]
            })
        });

        const data = await response.json();
        const aiMessage = data.choices[0].message.content;

        chatOutput.innerHTML += `<div><b>Assistant:</b> ${aiMessage}</div>`;
        chatOutput.scrollTop = chatOutput.scrollHeight;

        const utterance = new SpeechSynthesisUtterance(aiMessage);
        utterance.lang = 'hi-IN';
        window.speechSynthesis.speak(utterance);

    } catch (error) {
        console.error(error);
        chatOutput.innerHTML += `<div><b>Assistant:</b> Sorry, something went wrong.</div>`;
    }
}

// ------------------- Bottom Nav Page Switching -------------------
document.querySelectorAll(".bottom-nav .nav-item").forEach((item, index) => {
    item.addEventListener("click", () => {
        document.querySelectorAll(".bottom-nav .nav-item").forEach(nav => nav.classList.remove("active"));
        item.classList.add("active");

        // Hide all sections
        document.querySelectorAll(".weather-bar, .profile-section, .menu-section, .chatbot-section").forEach(s => s.style.display = "none");

        // Show only the selected section
        if(index === 0) { // Home
            document.querySelector(".weather-bar").style.display = "flex";
            document.querySelector(".profile-section").style.display = "block";
            document.querySelector(".menu-section").style.display = "block";
        } else if(index === 1) { // Chat
            document.querySelector(".chatbot-section").style.display = "block";
        } else if(index === 2) { // Activities
            alert("Open My Activities section"); 
        } else if(index === 3) { // Alerts
            alert("Open Alerts & Reminders section"); 
        } else if(index === 4) { // Knowledge
            alert("Open Knowledge Hub section"); 
        }
    });
});



