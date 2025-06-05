# **App Name**: Nova Sync

## Core Features:

- Presence Detection: User Presence Detection: Uses facial recognition (integrated with the local Python AI) to detect the presence of authorized users and update 'user' collection.
- Activity Logger: System Activity Logging: Tracks cursor movement, typing, downloads, and saves them as real-time logs in the 'system_logs' collection.
- Command Execution: Command Queue: The assistant executes system-level commands pushed to Firebase from the 'commands' collection such as turnOnWifi, downloadFile, moveMouse, etc.
- Status Sync: Real-time Status Updates: Continuously sync system status and other relevant states from the assistant back to Firebase for external monitoring.
- Adaptive Tips: Adaptive Assistant: When triggered, the assistant determines from system activity whether to display helpful tips, auto-adjust settings, or recommend optimizations.

## Style Guidelines:

- Primary color: Dark indigo (#4B0082) for a sophisticated and intelligent feel, nodding to Python origins.
- Background color: Very dark gray (#222222) to enhance focus and reduce eye strain.
- Accent color: Electric purple (#BF00FF) to highlight active elements and draw user attention.
- Body and headline font: 'Inter', a sans-serif font, for clean, modern readability and a neutral technology feel.
- Code font: 'Source Code Pro' for clear and distinct display of log data.
- Minimal, geometric icons in a vibrant purple hue, suggesting system and data flow.
- Dashboard-style layout with clear sections for system status, command logs, and user information.