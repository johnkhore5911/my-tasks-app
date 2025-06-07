My Tasks App
Author: John
Project Description
"My Tasks" is a mobile application built with React Native and Expo, designed to help users manage tasks efficiently. The app allows users to add, view, complete, and delete tasks, with additional features like task prioritization, editing, local notifications, and data persistence. It fulfills all core requirements and includes advanced features outlined in the AffWorld LLC assignment.
Features

Task Input: Add tasks via a text input field with an "Add Task" button, including error handling to prevent empty tasks.
Task List Display: Displays tasks in a scrollable list with clear text presentation.
Task Completion: Toggle task completion with a checkbox, visually distinguished by a strikethrough effect.
Delete Task: Remove tasks using a trash icon next to each task.
Local Notifications: Schedules a notification for each new task (triggers 10 seconds after creation) with the task name and a reminder message. Completed tasks have their notifications cancelled.
Advanced Features:
Data Persistence: Tasks are saved locally using AsyncStorage, persisting across app restarts.
Edit Task: Edit existing task text via an edit icon and save changes.
Task Prioritization: Assign high, medium, or low priority to tasks, with visual indicators in the list.
UI/UX Enhancements: Includes smooth animations for task addition/deletion and a clean, intuitive design.



Setup and Run Instructions

Prerequisites:

Node.js (v14 or later)
Expo CLI (npm install -g expo-cli)
Expo Go app on your mobile device (iOS/Android)


Clone the Repository:
git clone https://github.com/johnkhore5911/my-tasks-app.git
cd my-tasks-app


Install Dependencies:
npm install


Start the Expo Development Server:
expo start


Run the App:

Open the Expo Go app on your mobile device.
Scan the QR code displayed by the Expo development server.
Alternatively, run expo start --ios or expo start --android for simulator/emulator testing.


Permissions:

Grant notification permissions when prompted to enable task reminders.



Challenges and Design Choices

Challenge: Data PersistenceEnsuring tasks persisted across app sessions was achieved using AsyncStorage. I handled edge cases like JSON parsing errors to ensure robust data handling.

Design Choice: UI/UXI prioritized a clean, minimalistic design with subtle animations to improve usability without compromising performance. Task priorities are color-coded for quick recognition (red for high, yellow for medium, green for low).

Design Choice: Error HandlingAdded validation to prevent empty task submissions and provided user feedback via alerts, ensuring a smooth interaction flow.


Notes

Meaningful variable names and modular components ensure readability and maintainability.
The app is tested on both iOS and Android via Expo Go for cross-platform compatibility.

Thank you for reviewing my submission! For any questions, please contact johnkhore26@gmail.com +91 90556653906
