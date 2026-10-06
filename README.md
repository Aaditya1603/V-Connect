# WebRTC Core Video Platform 📹

A functionality-first, low-latency video conferencing platform inspired by Zoom and Google Meet. This project skips superficial UI styling to prioritize core real-time engineering principles, peer-to-peer data streaming, and hardware media device control using the **MERN stack** and **WebRTC**.

🌐 **[Live Demo Link - https://zerodha-frontend-kch5.onrender.com ]**

## ⚙️ Core Engineering & Functionality

*   **Pure WebRTC P2P Video/Audio** – Native real-time media streams established directly between browsers for low-latency conferencing.
*   **Granular Stream Mutators** – Full software controls for instant audio muting, microphone toggles, and dynamic video track freezing.
*   **Parallel Live Chat** – Sub-second latency text messaging layer working seamlessly alongside active video rooms via WebSockets.
*   **Meeting Authorization** – Secure room routing ensuring only authenticated users can initiate or join active communication sessions.

## 🛠️ Tech Stack & Protocols

*   **Real-Time Protocols:** WebRTC (MediaStream API), WebSockets ([e.g., Socket.io])
*   **Frontend:** React.js, JavaScript (ES6+)
*   **Backend:** Node.js, Express.js (Signaling Server)
*   **Database:** MongoDB

## 🔬 Architectural Focus

Rather than focusing on visual templates, this project focuses heavily on the structural complexities of real-time communication:
1. Handling browser media permission states (`getUserMedia`).
2. Managing signaling server handshakes (Offer/Answer exchange).
3. Handling network ICE candidates and connection tracking.
