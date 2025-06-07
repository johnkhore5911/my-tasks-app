My Tasks App
Author: John
Assignment: React Native Developer Assignment for AffWorld LLCSubmission Deadline: 11/06/2025

📋 Project Overview
"My Tasks" is a mobile application built with React Native and Expo, designed to help users manage tasks efficiently. The app fulfills all core requirements and includes advanced features as specified in the AffWorld LLC assignment. It features a clean, intuitive interface with robust functionality, including task management, local notifications, and data persistence.

🚀 Features
Core Functionality

Task Input: Add tasks via a text input field with an "Add Task" button. Prevents empty task submissions with user-friendly error handling.
Task List Display: Shows tasks in a scrollable list with clear, readable text.
Task Completion: Toggle completion status using a checkbox, with a strikethrough effect to visually distinguish completed tasks.
Delete Task: Remove tasks using a trash icon next to each task.
Local Notifications: Schedules a notification for each new task (triggers 10 seconds after creation) with a message like "Time to complete: [Task Name]." Notifications for completed tasks are cancelled.

Advanced Features (Bonus)

Data Persistence: Saves tasks locally using AsyncStorage, ensuring tasks persist after app closure.
Edit Task: Edit existing task text via an edit icon and save changes seamlessly.
Task Prioritization: Assign high, medium, or low priority to tasks, displayed with color-coded indicators (red for high, yellow for medium, green for low).
UI/UX Enhancements: Includes smooth animations (e.g., fade-in for task addition/deletion) and a modern, minimalistic design for improved usability.


🛠️ Setup and Installation
Prerequisites

Node.js: Version 14 or later
Expo CLI: Install globally with npm install -g expo-cli
Expo Go: Install the Expo Go app on your iOS or Android device

Steps to Run

Clone the Repository:
git clone https://github.com/johnkhore5911/my-tasks-app.git
cd my-tasks-app


Install Dependencies:
npm install


Start the Expo Server:
npx expo start


Run the App:

Open the Expo Go app on your mobile device.
Scan the QR code displayed by the Expo server.
Alternatively, use npx expo start --ios or npx expo start --android for simulator/emulator testing.


Grant Permissions:

Allow notification permissions when prompted to enable task reminders.




🧠 Challenges and Design Choices

Notification Management:Integrating Expo Notifications required handling permissions and ensuring cross-platform compatibility. I chose a 10-second trigger for testing purposes and implemented notification cancellation for completed tasks to enhance user experience.

Data Persistence:Used AsyncStorage to persist tasks across app sessions. Added error handling for JSON parsing to ensure reliability.

UI/UX Design:Focused on a clean, minimalistic interface with subtle animations (e.g., task addition/deletion transitions) to improve usability without impacting performance. Color-coded priority indicators (red for high, yellow for medium, green for low) make task status clear at a glance.

Error Handling:Implemented validation to prevent empty task submissions, with user feedback via alerts for a seamless experience.



📝 Notes

The codebase uses ES6+ with React Hooks (useState, useEffect) for efficient state management.
Modular components and meaningful variable names ensure code readability and maintainability.
Tested on both iOS and Android via Expo Go for cross-platform compatibility.
The repository includes all necessary files to run the app out of the box.


📬 Contact
For any questions or feedback, please reach out to 
johnkhore26@gmail.com
+91 9056653906
Thank you for reviewing my submission!
