# 🛡️ RapidCare
### *Voice-Activated Emergency Response System*

RapidCare is a privacy-focused safety tool designed for individuals who may be physically unable to reach their phones during a crisis. By utilizing real-time browser-based voice recognition, it acts as a digital guardian that listens for a distress signal and automatically triggers alerts to an emergency contact.

---

## 🚀 Core Features

*   Hands-Free Monitoring: Uses the Web Speech API to listen for a user-defined Code Word locally on the device.
*   Automated Notifications: Integrated with EmailJS to send instant email alerts when the trigger word is detected.
*   Privacy-First Architecture: Audio processing is performed strictly on-device; no recordings are stored or transmitted to the cloud.
*   Accessibility Driven: Created specifically for the elderly, individuals with mobility issues, or those living alone.

---

## 🛠️ Technical Stack

| Component | Technology |
| :--- | :--- |
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Voice Recognition | Web Speech API |
| Alert System | EmailJS API |
| Security | .gitignore Secret Management |

---

## 🔐 Security & Professionalism

This project follows industry-standard security practices to ensure private data remains protected:

*   Secret Management: Sensitive API keys are stored in a local config.js file, which is excluded from the repository.
*   Template Configuration: A config.example.js is provided as a blueprint for safe local setup.
*   Clean History: The repository history is maintained without any exposed credentials.

---

## 📖 Setup Instructions

Follow these steps to run RapidCare on your local machine:

### 1. Clone the Repository
git clone https://github.com/koramlahari2/rapidcare.git

### 2. Configure Your API Keys
* Locate sampleconfig.js in the project root.
* Rename the file to config.js.
* Replace the placeholders with your actual EmailJS credentials:

const config = {
  SERVICE_ID: 'your_service_id',
  TEMPLATE_ID: 'your_template_id',
  PUBLIC_KEY: 'your_public_key'
};

### 3. Launch the Application
1. Open index.html in your browser (preferably via VS Code Live Server).
2. Allow microphone permissions when prompted.
3. Speak your Code Word to test the system.

---

## 💡 Project Background
This project was developed during an intensive 2-day hackathon. The goal was to bridge the gap between traditional emergency services and modern web technology, proving that a browser-based solution can be both highly effective and completely private.

---

## 📄 License
This project is open-source and available under the MIT License.
