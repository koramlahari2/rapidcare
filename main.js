// --- STATE MANAGEMENT ---
let isArmed = false;
let triggerCount = 0;
let recognition = null;

window.closeAuth = function() {
    console.log("Global closeAuth triggered");
    // Look for any element that might be the 'Auth' screen
    const modal = document.querySelector('.auth-modal') || 
                  document.getElementById('auth-modal') || 
                  document.querySelector('[id*="auth"]');
    
    if (modal) {
        modal.style.display = 'none';
        modal.style.visibility = 'hidden';
    } else {
        console.error("Could not find the Auth element to close!");
    }
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    renderContactDisplay();
    loadSettings();
    setupVoice();
});
// --- AUTHENTICATION & UI ---
function handleSignup() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('user-emergency-phone').value;

    if (!name || !email || !phone) {
        alert("Please fill in all fields!");
        return;
    }

    localStorage.setItem('rc_userName', name);
    localStorage.setItem('rc_userEmail', email);
    localStorage.setItem('rc_emergencyPhone', phone);

    addLog(`Account created for ${name}.`);
    document.getElementById('auth-overlay').style.display = "none";
}

function toggleAuth() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    loginForm.style.display = loginForm.style.display === "none" ? "block" : "none";
    signupForm.style.display = signupForm.style.display === "none" ? "block" : "none";
}

function closeAuth() {
    const authModal = document.getElementById('auth-modal'); // or whatever your ID is
    if (authModal) {
        authModal.style.display = 'none';
        console.log("Auth modal closed.");
    }
}
// --- CONTACT & SETTINGS MANAGEMENT ---
function renderContactDisplay() {
    // Make sure these keys match EXACTLY what you use in updateContactDetails
    document.getElementById('display-phone').innerText = localStorage.getItem('rc_emergencyPhone') || "Not set";
    document.getElementById('display-email').innerText = localStorage.getItem('rc_emergencyEmail') || "Not set";
}
function updateContactDetails() {
    const newPhone = document.getElementById('update-phone').value;
    const newEmail = document.getElementById('update-email').value;
    
    if (newPhone) localStorage.setItem('rc_emergencyPhone', newPhone);
    if (newEmail) localStorage.setItem('rc_emergencyEmail', newEmail);
    
    renderContactDisplay();
    addLog("Emergency Circle updated.");
}

function saveSettings() {
    const word = document.getElementById('code-word').value.toLowerCase();
    const msg = document.getElementById('custom-msg').value;
    localStorage.setItem('rc_codeWord', word);
    localStorage.setItem('rc_message', msg);
    addLog(`Settings updated: Word set to "${word}"`);
}

function loadSettings() {
    document.getElementById('code-word').value = localStorage.getItem('rc_codeWord') || "";
    document.getElementById('custom-msg').value = localStorage.getItem('rc_message') || "";
}




function setupVoice() {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!window.SpeechRecognition) {
        addLog("CRITICAL: Browser does not support Speech Recognition.");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
        const savedWord = localStorage.getItem('rc_codeWord');

        addLog(`Heard: "${transcript}"`);
        if (savedWord && transcript.includes(savedWord)) {
            handleTrigger();
        }
    };

    recognition.onend = () => { if (isArmed) recognition.start(); };
}

// --- SYSTEM TOGGLE ---
function toggleSystem() {
    const btn = document.getElementById('master-toggle');
    const indicator = document.getElementById('listening-indicator');
    isArmed = !isArmed;

    if (isArmed) {
        indicator.className = 'status-pill listening';
        indicator.querySelector('.status-text').innerText = "LISTENING";
        btn.innerText = "STOP MONITORING";
        btn.classList.add('active');
        announceStatus("Rapid Care is now armed.");
        recognition.start();
    } else {
        indicator.className = 'status-pill offline';
        indicator.querySelector('.status-text').innerText = "OFFLINE";
        btn.innerText = "ACTIVATE SYSTEM";
        btn.classList.remove('active');
        announceStatus("System disarmed.");
        recognition.stop();
    }
}

// --- THE REAL TRIGGER (API INTERACTION) ---
window.handleTrigger = function() {
    // 1. Grab the email directly from the UI span you just showed me
    const userEmail = document.getElementById('display-email').innerText;
    const userMsg = localStorage.getItem('rc_message') || "Emergency detected!";

    // Safety check: if it's "Not set", don't send
    if (!userEmail || userEmail === "Not set") {
        addLog("⚠️ Cannot send: No emergency email address found.");
        return;
    }

    addLog("🚨 Alert Triggered! Connecting to API...");

    const templateParams = {
        to_email: userEmail,
        message: userMsg
    };

    emailjs.send(CONFIG.SERVICE_ID, CONFIG.TEMPLATE_ID, templateParams)
        .then(function(response) {
            addLog("✅ API SUCCESS: Email sent to " + userEmail);
        }, function(error) {
            addLog("❌ API FAIL: " + JSON.stringify(error));
            // Keep your mailto backup!
            window.location.href = `mailto:${userEmail}?subject=Emergency&body=${userMsg}`;
        });
};


// --- HELPERS ---
function announceStatus(text) {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
}

function addLog(text) {
    const log = document.getElementById('activity-log');
    const entry = document.createElement('p');
    entry.className = "log-entry";
    entry.innerText = `> ${new Date().toLocaleTimeString()}: ${text}`;
    log.prepend(entry);
}